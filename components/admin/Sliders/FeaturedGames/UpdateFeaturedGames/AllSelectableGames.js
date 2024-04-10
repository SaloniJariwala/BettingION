import GameBoxLoader from "@/components/frontend/UI/GameBoxLoader";
import axios from "axios";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import sha1 from 'sha1';

const DataLoader = () => {
	return (
		<li className="load-more-div">
			<i className="fad fa-spinner-third fa-spin"></i>
		</li>
	);
}

var searchIdentifier;
const AllSelectableGames = ({ page, checkHandler, activeGameIds, refresh }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [allGames, setAllGames] = useState([]);
	const [data, setData] = useState();
	const [search, setSearch] = useState({ value: '', toggle: false, refresh: false, loading: false });
	const [pageNumber, setPageNumber] = useState(1);

	/**
	 * Clear timeout
	 */
	useEffect(() => {
		if (!refresh?.loading) {
			clearTimeout(searchIdentifier);
		}
	}, [refresh?.loading]);

	/**
	 * Search input handler
	 */
	const searchInputHandler = (event) => {
		clearTimeout(searchIdentifier);

		setSearch(searched => {
			return {
				...searched,
				loading: true
			}
		});

		searchIdentifier = setTimeout(() => {
			setSearch(searched => {
				return {
					value: event.target.value,
					toggle: pageNumber === 1 ? !searched?.toggle : searched?.toggle,
					refresh: true,
					loading: false
				};
			});

			if (pageNumber !== 1) {
				setPageNumber(1);
			}
		}, 1000);
	}

	/**
	 * Fetch games
	 */
	useEffect(() => {
		setLoading(true);

		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

		axios
			.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/get-feature-games-pages?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&limit=30&page=${pageNumber}&gameSearch=${search?.value}`)
			.then((response) => {
				if (response.data?.status === 200) {
					if (search?.refresh) {
						setAllGames(response.data?.data?.games?.currentGames);
					} else {
						setAllGames(currentGames => currentGames.concat(response.data?.data?.games?.currentGames).flat(1));
					}

					setData(response.data?.data?.games);
				} else {
					setError(response.data?.message);
				}
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [pageNumber, search?.toggle]);

	const checkboxChangeHandler = (checked, game) => {
		checkHandler(checked ? 'ADD' : 'REMOVE', game);
	};

	const getInfiniteData = () => {
		if (search?.refresh) {
			setSearch(searched => {
				return { ...searched, refresh: false }
			});
		}

		setPageNumber(page => page + 1);
	};

	return (
		<Col lg="9">
			<div className="featured_slider_left_content">
				<div className="featured_slider_top_bar">
					<h5 className="h5_title">Select Games</h5>

					<div className="form_input_wp form-element input_search_loader">
						<i className="far fa-search"></i>
						<input name="search" type="search" placeholder={"Search Games"} className="form_input" autoComplete="off" onChange={searchInputHandler} />
						{search?.loading && <span className="fad fa-spinner-third fa-spin load-more"></span>}
					</div>
				</div>

				<div className="featured_slider_list">
					<ul id="scrollable-selectable-games">
						{loading && <DataLoader />}
						{data && <InfiniteScroll
							dataLength={allGames?.length || 0}
							next={getInfiniteData}
							hasMore={data?.cureentGamesCount !== 0}
							loader={loading && <DataLoader />}
							style={{ height: "auto", overflow: "hidden" }}
							scrollableTarget="scrollable-selectable-games"
						>
							{allGames?.map((game) => {
								return (
									<li key={game?.id}>
										<div className="form_checkbox">
											<input
												type="checkbox"
												name="transaction_checkbox"
												className="form-check-input"
												id={`select-${page}-${game?.id}`}
												onChange={(event) => checkboxChangeHandler(event.target.checked, game)}
												checked={activeGameIds?.includes(game?.id)}
											/>

											<label className="form-check-label" htmlFor={`select-${page}-${game?.id}`} >
												{game?.name}
												<span>{game?.gameType} - #{game?.id}</span>
											</label>
										</div>
									</li>
								);
							})}
						</InfiniteScroll>}
					</ul>
				</div>
			</div>
		</Col>
	);
};

export default AllSelectableGames;