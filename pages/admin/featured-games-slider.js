import AdminLayout from "@/components/admin/AdminLayout";
import FeaturedGamesPagesList from "@/components/admin/Sliders/FeaturedGames/FeaturedGamesPagesList";
import Title from "@/components/admin/UI/Title";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";

const FeaturedGamesSlider = (props) => {
	const [loading, setIsLoading] = useState(false);
	const [isNotAccessible, setIsNotAccessible] = useState(true);
	const [featuredPages, setFeaturedPages] = useState([]);
	const [error, setError] = useState(null);

	/**
	 * Validate user access permission
	 */
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("User"));
		['super-agent', 'administrator'].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
	}, []);

	/**
	 * Fetch all available games
	 */
	useEffect(() => {
		(async () => {
			setIsLoading(true);

			let pages = [], errorStatus = false;
			const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

			await axios
				.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/get-feature-games-pages?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`)
				.then((response) => {
					if (response.data?.status === 200) {
						pages = response.data?.data?.pages;
					} else {
						setError(response.data?.message);
						errorStatus = true;
					}
				})
				.catch((error) => {
					setError(error.message);
					errorStatus = true;
				});

			if (errorStatus || pages.length === 0) {
				setIsLoading(false);
				return;
			};

			let pagesList = pages?.map(page => page?.type);

			await axios
				.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/get-current-feature-games?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`)
				.then((response) => {
					if (response.data?.status === 200) {
						const responseData = response.data?.data;
						const featuredGamesPages = responseData?.filter(games => pagesList?.includes(games?.type));
						setFeaturedPages(featuredGamesPages);
					} else {
						setError(response.data?.message);
					}
				})
				.catch((error) => {
					setError(response.data?.message);
				})
				.finally(() => {
					setIsLoading(false);
				});
		})();
	}, []);

	return (
		<>
			<Head>
				<meta name="title" content={props.title} />
				<meta name="description" content={props.description} />
			</Head>
			<AdminLayout>
				<section className="featured_games_slider_sec">
					<div className="title_bar">
						<Row className="align-items-center">
							<Col lg={6}>
								<div className="title">
									<Title>Featured Games</Title>
								</div>
							</Col>
						</Row>
					</div>

					{!isNotAccessible ? (
						<Col lg={12}>
							<div className="use_main_form">
								<p className="error-msg" style={{ display: "block" }}>
									{adminLanguageData?.common_restriction_message?.page_not_accessible_message?.value}
								</p>
							</div>
						</Col>
					) : (
						<>
							{loading ? (
								<>
									<span
										className="load-more"
										style={{
											display: loading ? "block" : "none",
											textAlign: "center",
											margin: 0,
											fontSize: "1.4rem",
										}}
									>
										<i className="fad fa-spinner-third fa-spin"></i>
									</span>
								</>
							) : (
								<div className="slider_main">
									{featuredPages?.map((page) => {
										return <FeaturedGamesPagesList key={page?.id} page={page?.type} games={page?.games} />
									})}
								</div>
							)}
						</>
					)}
				</section>
			</AdminLayout>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: {
			title: "Featured Games Slider",
			description: "Featured Games Slider",
		},
	};
}

export default FeaturedGamesSlider;
