/* react-hooks/exhaustive-deps */
import FrontLayout from "@/components/frontend/FrontLayout";
import Title from "@/components/frontend/UI/Title";
import GameBox from "@/components/frontend/common/GameBox";
import { useEffect, useState } from "react";
import liveGamesTitleIcon from "@/frontend/images/live_games_title_icon.svg";
import axios from "axios";
import sha1 from "sha1";
import { useRouter } from "next/router";
import Loader from "@/components/admin/UI/Loader";
import { GamesProviderState } from "@/context/GamesProvider";
import Head from "next/head";
import { LanguageState } from "@/context/FrontLanguageProvider";

const Favorites = (props) => {
    const { isUpdate } = GamesProviderState();
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");
    const [favoriteGames, setFavoriteGames] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        } else {
            setLoggedInUser(localStorage.getItem("User"));
        }
    }, []);

    useEffect(() => {
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.userId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/get-favorite-game-list?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.userId
                }&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data === "") {
                        setFavoriteGames([]);
                    } else {
                        setFavoriteGames(response.data?.data);
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, [isUpdate]);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <section className="feature_games_section">
                    {!loggedInUser && <Loader fullScreen />}
                    <Title
                        className="mb_0"
                        title={languageData?.favorite_games_page?.favorite_games?.value || "Favorite Games"}
                        icon={liveGamesTitleIcon}
                        link="/"
                    />

                    {errorMessage ? (
                        <p className="register-error" style={{ display: errorMessage ? "block" : "none" }}>
                            {errorMessage}
                        </p>
                    ) : (
                        <div className="game_wrap">
                            {favoriteGames?.map((data) => (
                                <GameBox key={data?.id} data={data} />
                            ))}
                        </div>
                    )}
                </section>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Favourite game",
            description: "Favourite game",
        },
    };
}

export default Favorites;
