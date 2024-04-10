import { useEffect, useReducer, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ViewFeaturedGames from "./ViewFeaturedGames/ViewFeaturedGames";
import AllSelectableGames from "./UpdateFeaturedGames/AllSelectableGames";
import RemovableFeaturedGames from "./UpdateFeaturedGames/RemovableFeaturedGames";
import sha1 from 'sha1';
import axios from "axios";

const getGameIds = (games) => {
	const ids = games.map((game) => game?.indexId);
	return ids;
};

const gameReducer = (state, action) => {
	let matchIndex;

	switch (action.type) {
		case 'ADD':
			matchIndex = state.games?.findIndex(game => game?.id === action.game.id);
			if (matchIndex === -1) {
				state.games.push(action.game)
				state.gameIds.push(action.game?.id);
			}
			return state;
		case 'REMOVE':
			matchIndex = state.games?.findIndex(game => game?.id === action.game.id);
			const matchGameIdIndex = state.gameIds.filter(id => id !== action.game?.id);
			if (matchIndex !== -1) {
				state.games.splice(matchIndex, 1);
			}
			state.gameIds = matchGameIdIndex;
			return state;
		case 'RESET':
			state.games = [...state.defaultGames];
			state.gameIds = [...state.defaultGameIds];
			return state;
		case 'REFRESH':
			return state = {
				games: action.games,
				gameIds: getGameIds(action.games),
				defaultGames: [...action.games],
				defaultGameIds: [...getGameIds(action.games)]
			};
		default:
			return state;
	}
}

const FeaturedGamesPagesList = ({ page, games }) => {
	const [updatedGames, dispatch] = useReducer(gameReducer, { games: games, gameIds: getGameIds(games), defaultGames: [...games], defaultGameIds: [...getGameIds(games)] });
	const [accordion, setAccordion] = useState(false);
	const [actionType, setActionType] = useState('view');
	const [refreshToggle, setRefreshToggle] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState(false);

	const refreshGames = () => {
		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

		axios
			.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/get-current-feature-games?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`)
			.then((response) => {
				if (response.data?.status === 200) {
					const responseData = response.data?.data;
					const featuredGamesPages = responseData?.filter(games => page === games?.type);
					gameModifyHandler('REFRESH', null, featuredGamesPages.at(0)?.games);
				} else {
					setErrorMessage(response.data?.message);
				}
			});
	};

	useEffect(() => {
		getGameIds(games);
	});

	const accordionHandler = (action) => {
		if (action === 'update') {
			setAccordion(prev => {
				return actionType === 'view' ? true : !prev;
			});
			setActionType('update');
		} else {
			setAccordion(prev => !prev);
			setActionType('view');
		}
	};

	const gameModifyHandler = (handle, game, games = []) => {
		const handleDispatches = {
			ADD: { type: 'ADD', game: game },
			REMOVE: { type: 'REMOVE', game: game },
			REFRESH: { type: 'REFRESH', games: games },
			RESET: { type: 'RESET' }
		}

		if (handle in handleDispatches) {
			dispatch(handleDispatches[handle]);
			setRefreshToggle(prev => !prev);
		}
	};

	const updateGamesHandler = () => {
		setSubmitLoading(true);
		setErrorMessage(null);
		setSuccessMessage(null);

		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

		axios
			.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/save-update-feature-games?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&pageKey=${page}&gamesIds=[${updatedGames?.gameIds}]`)
			.then(response => {
				if (response.data?.status === 200) {
					setSuccessMessage(response.data?.message);
					refreshGames();
				} else {
					setErrorMessage(response.data?.message);
				}
			})
			.catch((error) => {
				setError(error.message)
			})
			.finally(() => {
				setSubmitLoading(false);
			});
	};

	return (
		<div className={`slider_main_accordion ${accordion ? "active_accordion" : ""}`}>
			<div className="table_btn_group">
				<ul>
					<li>
						<button type="button" onClick={() => accordionHandler('view')}>
							<i className="far fa-eye"></i> View
						</button>
					</li>
					<li>
						<button type="button" onClick={() => accordionHandler('update')}>
							<i className="far fa-pencil-alt"></i> Update
						</button>
					</li>
				</ul>
			</div>
			<div className="h5_title slider_main_accordion_title" onClick={() => accordionHandler('view')}>
				<b>
					<span>{page}</span>
				</b>
				<span>
					<i className="fal fa-chevron-right"></i>
				</span>
			</div>
			<div className="slider_main_accordion_content">
				<div>
					{accordion && actionType === 'view' && (
						<ViewFeaturedGames games={updatedGames?.defaultGames} />
					)}

					{accordion && actionType === 'update' && (
						<div className="slider_main_accordion">
							<Row>
								<AllSelectableGames page={page} checkHandler={gameModifyHandler} activeGameIds={updatedGames?.gameIds} refresh={refreshToggle} />
								<RemovableFeaturedGames games={updatedGames?.games} refresh={refreshToggle} removeHandler={gameModifyHandler} />
							</Row>

							<hr />

							<Row>
								<Col lg={12}>
									<div className="featured-games-responses">
										{submitLoading && (
											<>
												<span
													className="load-more mb_10"
													style={{
														display: "block",
														margin: 0,
														fontSize: "25px",
														textAlign: 'center'
													}}
												>
													<i className="fad fa-spinner-third fa-spin"></i>
												</span>
											</>
										)}
										{errorMessage && <p className="error-msg mt_0" style={{ display: "block" }}>{errorMessage}</p>}
										{successMessage && <p className="success-msg mt_0" style={{ display: "block" }}>{successMessage}</p>}
									</div>
									<div className="featured_slider_button button_group">
										<button type="button" className="sec_btn" onClick={updateGamesHandler}>
											Update Games
										</button>
										<button type="button" className="sec_btn" onClick={() => gameModifyHandler('RESET')}>
											cancel
										</button>
									</div>
								</Col>
							</Row>
						</div>
					)}
				</div>
			</div>
		</div >
	);
}

export default FeaturedGamesPagesList;