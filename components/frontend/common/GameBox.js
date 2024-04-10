import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import sha1 from "sha1";
import playIcon from "@/frontend/images/play_icon.svg";
import Link from "next/link";
import slugify from "slugify";
import { useRouter } from "next/router";
import { GamesProviderState } from "@/context/GamesProvider";
import defaultGameImage from "@/public/bettingion.jpg";

const GameBox = ({ data }) => {
    const router = useRouter();
    const { updateGames } = GamesProviderState();
    const [favToggle, setFavToggle] = useState(data?.favorite);
    const [isLogin, setIsLogin] = useState();

    useEffect(() => {
        if (localStorage.getItem("User")) {
            setIsLogin(true);
        }
    }, []);

    useEffect(() => {
        if (router?.pathname === "/my-account/favorite-games") {
            setFavToggle(true);
        }
    }, []);

    const handleFavorite = (gameId) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/add-favorite-game?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&gameId=${gameId}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                }&authKey=${authKey}`
            )
            .then((response) => {
                if (response?.data?.status === 200) {
                    setFavToggle(true);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleRemoveFavourite = (gameId) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/remove-favorite-game?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&gameId=${gameId}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                }&authKey=${authKey}
        `
            )
            .then((response) => {
                if (response?.data?.status === 200) {
                    setFavToggle(false);
                    if (router.pathname === "/my-account/favorite-games") {
                        updateGames();
                    }
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const query = (router.query = `${data?.providerId}-${data?.id}`);

    return (
        <>
            <div className="game_box">
                {data?.badge && <div className={`game_badge ${data?.badge === "exclusive" ? "exclusive_badge" : ""}`}>{data?.badge}</div>}
                <div className="game_box_content">
                    <Image className="game_image" src={data?.gameThumbnail || data?.gameIcon || defaultGameImage} alt={`${data?.name} Game`} height={200} width={200} loading="lazy" quality={60} />
                    <div className="game_box_overlay">
                        <Link
                            href={{
                                pathname: `/games/${slugify(data?.providerName || data?.providerId)}/${slugify(data?.name)}`,
                                query: { id: query },
                            }}
                            title={`${data?.name} Game`}
                            className="round_btn"
                        >
                            <Image src={playIcon} alt="Play Game" width={17} height={20} loading="lazy" quality={30} />
                        </Link>
                        {isLogin && (
                            <button className="fav_button" onClick={() => (favToggle ? handleRemoveFavourite(data?.id) : handleFavorite(data?.id))}>
                                <i className={`${favToggle ? "fas" : "fal"} fa-heart`}></i>
                            </button>
                        )}
                    </div>
                </div>
                <h6>
                    <span className="game_title">{data?.name}</span>
                    <span className="game_provider_title">{data?.providerName}</span>
                </h6>
            </div>
        </>
    );
};

export default GameBox;
