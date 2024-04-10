import { Col, Row } from "react-bootstrap";

const ViewFeaturedGames = ({ games }) => {
	return (
		<div className="slider_main_accordion">
			<Row>
				<Col lg="12">
					<div className="featured_slider_left_content">
						<div className="featured_slider_top_bar">
							<h5 className="h5_title">Current Games</h5>
						</div>

						<div className="featured_slider_list">
							<ul className="featured_slider_list current_game_list">
								{games?.map((game) => {
									return <li key={game?.gameID}>
										<div className="form_checkbox">
											<label className="form-check-label">
												{game?.name}
												<span>{game?.gameType} - #{game?.indexId}</span>
											</label>
										</div>
									</li>
								})}
							</ul>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default ViewFeaturedGames;