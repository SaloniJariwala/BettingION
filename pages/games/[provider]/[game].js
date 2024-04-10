/* react-hooks/exhaustive-deps */
import FrontLayout from "@/components/frontend/FrontLayout";
import { useState, useEffect } from "react";
import Title from "@/frontend/ui/Title";
import featureTitleIcon from "@/frontend/images/feature_title_icon.svg";
import GameBoxSlider from "@/frontend/common/GameBoxSlider";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Game from "@/components/frontend/Games/Game";
import GameSearch from "@/components/frontend/Games/GameSearch";
import PlayButtons from "@/components/frontend/Games/PlayButtons";
import axios from "axios";
import GameController from "@/components/frontend/Games/GameController";
import Topbar from "@/components/frontend/Games/Topbar";
import homePageBg from "@/frontend/images/main_bg_img.png";
import Image from "next/image";
import GameShare from "@/components/frontend/Games/GameShare";
import { useRouter } from "next/router";
import Head from "next/head";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { BalanceState } from "@/context/BalanceProvider";

const SingleGamePage = (props) => {
    const router = useRouter();
    const mainScreenFull = useFullScreenHandle();
    const screen1 = useFullScreenHandle();
    const screen2 = useFullScreenHandle();
    const screen3 = useFullScreenHandle();
    const screen4 = useFullScreenHandle();
    const { updateBalance, userDefaultCurrency } = BalanceState();
    const [showGame, setShowGame] = useState(1);
    const [gameData, setGameData] = useState({
        screen1: true,
        screen2: null,
        screen3: null,
        screen4: null,
    });
    const [mainGameData, setMainGameData] = useState(null);
    const [errorMessage, setErrorMessage] = useState({
        screen1: "",
        screen2: "",
        screen3: "",
        screen4: "",
    });
    const [gameUrl, setGameUrl] = useState({
        screen1: "",
        screen2: "",
        screen3: "",
        screen4: "",
    });
    const [gameController1, setGameController1] = useState(false);
    const [gameController2, setGameController2] = useState(false);
    const [gameController3, setGameController3] = useState(false);
    const [gameController4, setGameController4] = useState(false);
    const [relatedGames, setRelatedGames] = useState([]);
    const [tabletScreen, setTabletScreen] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        setGameUrl({ ...gameUrl, screen1: "" });
        const id = window.location.search?.split("=")[1];
        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/games/admin/getAllCombineAPI?action=search_game&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&id=${id}`;
        if (localStorage.getItem("User")) {
            url = url + `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
        }
        axios
            .get(url)
            .then((response) => {
                if (response.data?.status === 200) {
                    setGameData({ ...gameData, screen1: response.data?.data?.currentGame });
                    setRelatedGames(response.data?.data?.relatedGames);
                    if (mainGameData === null) {
                        setMainGameData(response.data?.data?.currentGame);
                    }
                } else {
                    setErrorMessage({ ...errorMessage, screen1: response.data?.message });
                }
            })
            .catch((error) => {
                setErrorMessage({ ...errorMessage, screen1: error.message });
            });
    }, [router]);

    const settingGameUrl = (url, id) => {
        if (id === 1) {
            setGameUrl({ ...gameUrl, screen1: url });
            setGameController1(false);
        } else if (id === 2) {
            setGameUrl({ ...gameUrl, screen2: url });
            setGameController2(false);
        } else if (id === 3) {
            setGameUrl({ ...gameUrl, screen3: url });
            setGameController3(false);
        } else {
            setGameUrl({ ...gameUrl, screen4: url });
            setGameController4(false);
        }
    };

    const getGameData = (data, id) => {
        if (id === 1) {
            setGameData({ ...gameData, screen1: data });
            setGameUrl({ ...gameUrl, screen1: "" });
        } else if (id === 2) {
            setGameData({ ...gameData, screen2: data });
            setGameUrl({ ...gameUrl, screen2: "" });
        } else if (id === 3) {
            setGameData({ ...gameData, screen3: data });
            setGameUrl({ ...gameUrl, screen3: "" });
        } else {
            setGameData({ ...gameData, screen4: data });
            setGameUrl({ ...gameUrl, screen4: "" });
        }
    };

    const settingErrorMessage = (message, id) => {
        if (id === 1) {
            setErrorMessage({ ...errorMessage, screen1: message });
        } else if (id === 2) {
            setErrorMessage({ ...errorMessage, screen2: message });
        } else if (id === 3) {
            setErrorMessage({ ...errorMessage, screen3: message });
        } else {
            setErrorMessage({ ...errorMessage, screen4: message });
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 1023) {
                setTabletScreen(true);
            }
        };

        window.addEventListener("resize", handleResize);
    }, [tabletScreen]);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <div className="page_bg_img">
                    <Image
                        src={gameData.screen1?.gameBackground || homePageBg}
                        alt="BettingIon Home Background"
                        loading="lazy"
                        layout="responsive"
                        width={1800}
                        height={1800}
                        sizes="100vw"
                        quality={30}
                    />
                </div>
                <section className="single_game">
                    <FullScreen handle={mainScreenFull} className="single_game_main_fullscreen">
                        <GameController data={gameData.screen1} showGame={showGame} setShowGame={setShowGame} mainScreenFull={mainScreenFull} />
                        <section className="single_game_sec">
                            <div className="single_game_step2 single_game_box_wrapper">
                                <>
                                    <div className="single_game_iframe_box">
                                        {errorMessage?.screen1 ? (
                                            <p className="error-msg" style={{ display: errorMessage?.screen1 ? "block" : "none" }}>
                                                {errorMessage?.screen1}
                                            </p>
                                        ) : gameData.screen1 ? (
                                            gameUrl.screen1 === "" ? (
                                                <PlayButtons settingGameUrl={settingGameUrl} data={gameData.screen1} id={1} settingErrorMessage={settingErrorMessage} gameCurrency={userDefaultCurrency?.currencyAbrv ? userDefaultCurrency?.currencyAbrv : "USD"} />
                                            ) : (
                                                <>
                                                    <Topbar selectedGame={gameData.screen1} handle={screen1} setGameController={setGameController1} mainframe={true} id={1} />
                                                    <Game selectedGame={gameData.screen1} mainframe={true} url={gameUrl.screen1} handle={screen1} setGameController={setGameController1} id={1} />

                                                    <div className={`single_game_box_controller ${gameController1 ? "swipe_down_controller" : ""}`}>
                                                        <GameSearch setGameController={setGameController1} showClose={true} getGameData={getGameData} id={1} />
                                                    </div>
                                                </>
                                            )
                                        ) : (
                                            <GameSearch getGameData={getGameData} setGameController={setGameController1} showClose={false} id={1} />
                                        )}
                                    </div>
                                </>
                                {!tabletScreen && (
                                    <>
                                        {(showGame === 2 || showGame === 3) && (
                                            <div className="single_game_iframe_box">
                                                {errorMessage?.screen2 ? (
                                                    <p
                                                        className="error-msg"
                                                        style={{
                                                            display: errorMessage?.screen2 ? "block" : "none",
                                                        }}
                                                    >
                                                        {errorMessage?.screen2}
                                                    </p>
                                                ) : gameData.screen2 ? (
                                                    gameUrl.screen2 === "" ? (
                                                        <PlayButtons settingGameUrl={settingGameUrl} data={gameData.screen2} id={2} settingErrorMessage={settingErrorMessage} gameCurrency={userDefaultCurrency?.currencyAbrv ? userDefaultCurrency?.currencyAbrv : "USD"} />
                                                    ) : (
                                                        <>
                                                            <Topbar
                                                                selectedGame={gameData.screen2}
                                                                handle={screen2}
                                                                setGameController={setGameController2}
                                                                mainframe={false}
                                                                getGameData={getGameData}
                                                                id={2}
                                                            />
                                                            <Game
                                                                selectedGame={gameData.screen2}
                                                                mainframe={false}
                                                                url={gameUrl.screen2}
                                                                handle={screen2}
                                                                setGameController={setGameController2}
                                                                id={2}
                                                            />

                                                            <div className={`single_game_box_controller ${gameController2 ? "swipe_down_controller" : ""}`}>
                                                                <GameSearch setGameController={setGameController2} showClose={true} getGameData={getGameData} id={2} />
                                                            </div>
                                                        </>
                                                    )
                                                ) : (
                                                    <GameSearch getGameData={getGameData} setGameController={setGameController2} showClose={false} id={2} />
                                                )}
                                            </div>
                                        )}
                                        {showGame === 3 && (
                                            <>
                                                <div className="single_game_iframe_box">
                                                    {errorMessage?.screen3 ? (
                                                        <p
                                                            className="error-msg"
                                                            style={{
                                                                display: errorMessage?.screen3 ? "block" : "none",
                                                            }}
                                                        >
                                                            {errorMessage?.screen3}
                                                        </p>
                                                    ) : gameData.screen3 ? (
                                                        gameUrl.screen3 === "" ? (
                                                            <PlayButtons settingGameUrl={settingGameUrl} data={gameData.screen3} id={3} settingErrorMessage={settingErrorMessage} gameCurrency={userDefaultCurrency?.currencyAbrv ? userDefaultCurrency?.currencyAbrv : "USD"} />
                                                        ) : (
                                                            <>
                                                                <Topbar
                                                                    selectedGame={gameData.screen3}
                                                                    handle={screen3}
                                                                    setGameController={setGameController3}
                                                                    mainframe={false}
                                                                    getGameData={getGameData}
                                                                    id={3}
                                                                />
                                                                <Game
                                                                    selectedGame={gameData.screen3}
                                                                    mainframe={false}
                                                                    url={gameUrl.screen3}
                                                                    handle={screen3}
                                                                    setGameController={setGameController3}
                                                                    id={3}
                                                                />

                                                                <div className={`single_game_box_controller ${gameController3 ? "swipe_down_controller" : ""}`}>
                                                                    <GameSearch setGameController={setGameController3} showClose={true} getGameData={getGameData} id={3} />
                                                                </div>
                                                            </>
                                                        )
                                                    ) : (
                                                        <GameSearch getGameData={getGameData} setGameController={setGameController3} showClose={false} id={3} />
                                                    )}
                                                </div>
                                                <div className="single_game_iframe_box">
                                                    {errorMessage?.screen4 ? (
                                                        <p
                                                            className="error-msg"
                                                            style={{
                                                                display: errorMessage?.screen4 ? "block" : "none",
                                                            }}
                                                        >
                                                            {errorMessage?.screen4}
                                                        </p>
                                                    ) : gameData.screen4 ? (
                                                        gameUrl.screen4 === "" ? (
                                                            <PlayButtons settingGameUrl={settingGameUrl} data={gameData.screen4} id={4} settingErrorMessage={settingErrorMessage} gameCurrency={userDefaultCurrency?.currencyAbrv ? userDefaultCurrency?.currencyAbrv : "USD"} />
                                                        ) : (
                                                            <>
                                                                <Topbar
                                                                    selectedGame={gameData.screen4}
                                                                    handle={screen4}
                                                                    setGameController={setGameController4}
                                                                    mainframe={false}
                                                                    getGameData={getGameData}
                                                                    id={4}
                                                                />
                                                                <Game
                                                                    selectedGame={gameData.screen4}
                                                                    mainframe={false}
                                                                    url={gameUrl.screen4}
                                                                    handle={screen4}
                                                                    setGameController={setGameController4}
                                                                    id={4}
                                                                />

                                                                <div className={`single_game_box_controller ${gameController4 ? "swipe_down_controller" : ""}`}>
                                                                    <GameSearch setGameController={setGameController4} showClose={true} getGameData={getGameData} id={4} />
                                                                </div>
                                                            </>
                                                        )
                                                    ) : (
                                                        <GameSearch getGameData={getGameData} setGameController={setGameController4} showClose={false} id={4} />
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                        <GameShare />
                    </FullScreen>

                    <section className="single_game_content">
                        <h2 className="h2_title">{mainGameData?.name}</h2>
                        <p>{mainGameData?.gameDescription}</p>
                    </section>
                </section>

                <section className="related_games">
                    <Title className="mb_0" title={languageData?.single_game_page?.related_games_title?.value || "Related Games"} icon={featureTitleIcon} link="/" />
                    <GameBoxSlider sliderData={relatedGames} />
                </section>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Single game page",
            description: "Single game page",
        },
    };
}

export default SingleGamePage;
