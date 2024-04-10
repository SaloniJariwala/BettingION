import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";

const RemovableFeaturedGames = ({ games, refresh, removeHandler }) => {
	const [updatedGames, setUpdatedGames] = useState(games);

	useEffect(() => {
		setUpdatedGames(games);
	}, [refresh]);

	return (
		<Col lg="3">
			<div className="featured_slider_right_content">
				<h5 className="h5_title">Current Games</h5>

				<div className="featured_slider_available_games">
					<ul>
						{updatedGames?.map((game) => {
							if (!('indexId' in game)) {
								game.indexId = game?.id;
							} else {
								game.id = game?.indexId;
							}

							return (
								<li key={'updated-game-list-' + game?.indexId}>
									<span>
										{game?.name}
										<span>{game?.gameType} - #{game?.indexId}</span>
									</span>
									<button onClick={() => removeHandler('REMOVE', game)}>X</button>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</Col>
	);
};

export default RemovableFeaturedGames;