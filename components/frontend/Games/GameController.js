import Image from "next/image";
import React, { useEffect, useState } from "react";
import fullscreenIcon from "@/frontend/images/fullscreen_icon.svg";
import minimizeScreenIcon from "@/frontend/images/minimize_screen.svg";
import axios from "axios";
import sha1 from "sha1";

const GameController = ({ data, showGame, setShowGame, mainScreenFull }) => {
    const [favToggle, setFavToggle] = useState();
    const [isLogin, setIsLogin] = useState();
    const [isFullScreen, setIsFullScreen] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setFavToggle(data?.favorite);
        }, 1);
    }, [data]);

    useEffect(() => {
        if (localStorage.getItem("User")) {
            setIsLogin(true);
        }
    }, []);

    const displayButtonData = [
        {
            icon: (
                <svg width="24" height="24" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m17 2h-14c-0.55228 0-1 0.44772-1 1v9c0 0.5523 0.44772 1 1 1h14c0.5523 0 1-0.4477 1-1v-9c0-0.55229-0.4477-1-1-1zm-14-2c-1.6568 0-3 1.3432-3 3v9c0 1.6569 1.3432 3 3 3h14c1.6569 0 3-1.3431 3-3v-9c0-1.6568-1.3431-3-3-3h-14z"
                        fill="currentColor"
                        clipRule="evenodd"
                        fillRule="evenodd"
                    />
                    <path d="m6 17h8l1 2h-10l1-2z" fill="currentColor" />
                </svg>
            ),
        },

        {
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m9 2h-6c-0.55228 0-1 0.44772-1 1v9c0 0.5523 0.44772 1 1 1h6v-11zm2 0v11h6c0.5523 0 1-0.4477 1-1v-9c0-0.55229-0.4477-1-1-1h-6zm-8-2c-1.6568 0-3 1.3432-3 3v9c0 1.6569 1.3432 3 3 3h14c1.6569 0 3-1.3431 3-3v-9c0-1.6568-1.3431-3-3-3h-14zm2.7236 17.553c0.16939-0.3388 0.51565-0.5528 0.89442-0.5528h6.764c0.3787 0 0.725 0.214 0.8944 0.5528 0.3324 0.6649-0.1511 1.4472-0.8944 1.4472h-6.764c-0.74338 0-1.2269-0.7823-0.89442-1.4472z"
                        fill="currentColor"
                        clipRule="evenodd"
                        fillRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m3 2h6v4.5h-7v-3.5c0-0.55228 0.44772-1 1-1zm-1 6.5v3.5c0 0.5523 0.44772 1 1 1h6v-4.5h-7zm9 0v4.5h6c0.5523 0 1-0.4477 1-1v-3.5h-7zm7-2v-3.5c0-0.55229-0.4477-1-1-1h-6v4.5h7zm-18-3.5c0-1.6568 1.3432-3 3-3h14c1.6569 0 3 1.3432 3 3v9c0 1.6569-1.3431 3-3 3h-14c-1.6568 0-3-1.3431-3-3v-9zm6.618 14c-0.37877 0-0.72503 0.214-0.89442 0.5528-0.33245 0.6649 0.15104 1.4472 0.89442 1.4472h6.764c0.7433 0 1.2268-0.7823 0.8944-1.4472-0.1694-0.3388-0.5157-0.5528-0.8944-0.5528h-6.764z"
                        fill="currentColor"
                        clipRule="evenodd"
                        fillRule="evenodd"
                    />
                </svg>
            ),
        },
    ];

    const DisplayButton = ({ data, index }) => {
        var gameIndex = index + 1;

        const gameControllerButton = () => {
            setShowGame(gameIndex);
        };

        return (
            <li>
                <button className={`hide_large_tablet ${gameIndex === showGame ? "game_controller_active" : ""}`} onClick={() => gameControllerButton(gameIndex)}>
                    {data.icon}
                </button>
            </li>
        );
    };

    const handleFavorite = (gameId) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/add-favorite-game?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&gameId=${gameId}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
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
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/remove-favorite-game?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&gameId=${gameId}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&authKey=${authKey}
        `
            )
            .then((response) => {
                if (response?.data?.status === 200) {
                    setFavToggle(false);
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <div className="single_game_controller">
            <ul>
                {isLogin && (
                    <li>
                        <button onClick={() => (favToggle ? handleRemoveFavourite(data?.id) : handleFavorite(data?.id))}>
                            {favToggle ? (
                                <svg stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                                    <path
                                        d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z"
                                        fill="currentColor"
                                        strokeWidth="0"
                                    />
                                </svg>
                            ) : (
                                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h24v24H0z" fill="none" stroke="none" />
                                    <path d="m19.5 12.572-7.5 7.428-7.5-7.428a5 5 0 1 1 7.5-6.566 5 5 0 1 1 7.5 6.572" />
                                </svg>
                            )}
                        </button>
                    </li>
                )}

                <li>
                    {mainScreenFull.active === true ? (
                        <button type="button" onClick={mainScreenFull.exit}>
                            <Image loading="lazy" quality={50} src={minimizeScreenIcon} alt="BettingIon Minimize screen" />
                        </button>
                    ) : (
                        <button type="button" onClick={mainScreenFull.enter}>
                            <Image loading="lazy" quality={50} src={fullscreenIcon} alt="BettingIon Fullscreen" />
                        </button>
                    )}
                </li>

                {displayButtonData?.map((data, index) => {
                    return <DisplayButton key={index} data={data} index={index} />;
                })}
            </ul>
        </div>
    );
};

export default GameController;
