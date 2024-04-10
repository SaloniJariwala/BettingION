/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router"; // Importing useRouter
import { GamesProviderState } from "@/context/GamesProvider";
import Head from "next/head";
import sha1 from "sha1";
import FrontLayout from "@/components/frontend/FrontLayout";
import OfferSlider from "@/components/frontend/common/OfferSlider";
import AllProvider from "@/components/frontend/AllProvider";
import ProviderSidebar from "@/components/frontend/ProviderSidebar";
import BannerSlider from "@/components/frontend/common/BannerSlider";
import GameProviders from "@/components/frontend/Home/GameProviders";
import Genres from "@/components/frontend/common/Genres";

const Casino = ({ title, description }) => {
    const router = useRouter();

    const {
        providerId,
        setProviderId,
        setGamesCount,
        setErrorMessage,
        pagePerProvider,
        gameType,
        setGameType,
        isGameTypeClick,
        setIsGameTypeClick,
    } = GamesProviderState();

    const [page, setPage] = useState(1);
    const [allGameData, setAllGameData] = useState([]);
    const [allGameError, setAllGameError] = useState("");
    const [gameTypeData, setGameTypeData] = useState([]);
    const [totalGames, setTotalGames] = useState(0);
    const [onPageLoad, setOnPageLoad] = useState(true);
    const [currentGameCount, setCurrentGameCount] = useState(0);
    const [allProviders, setAllProviders] = useState([]);
    const [slidesList, setSlidesList] = useState([]);
    const [bannersList, setBannersList] = useState([]);
    const [offerLoading, setOfferLoading] = useState(true);

    const fetchGames = () => {
        let url = `${
            process.env.NEXT_PUBLIC_API_DOMAIN
        }/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
            process.env.NEXT_PUBLIC_CASINO
        }&page=${pagePerProvider === 1 ? 1 : page}&provider=${providerId}&gameSearch=`;

        if (gameType) {
            url += `&gameType=${gameType}`;
        }

        if (localStorage.getItem("User")) {
            url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
        }

        setOnPageLoad(true);
        axios
            .get(url)
            .then((response) => {
                setAllGameData(response.data?.availableGames?.games);
                if (allProviders?.length === 0) {
                    setAllProviders(response.data?.providers);
                }
                setCurrentGameCount(response.data?.availableGames?.currentGamesCount);
                if (!isGameTypeClick) {
                    if (gameType === "" || gameType === null) {
                        setTotalGames(response.data?.availableGames?.totalGames);
                        setGamesCount(response.data?.availableGames?.totalGames);
                        setGameTypeData(response.data?.gamesTypes);
                    }
                }
            })
            .catch((error) => {
                setAllGameError(error.message);
                setErrorMessage(error.message);
            })
            .finally(() => {
                setOnPageLoad(false);
                setIsGameTypeClick(false);
            });
    };

    useEffect(() => {
        if (router.query?.gametype && router.query.gametype !== gameType) {
            setGameType(router.query.gametype);
        }
    }, [router.query?.gametype]);

    useEffect(() => {
        if (page !== 1) {
            setOnPageLoad(false);
            let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&page=${page}&provider=${providerId}&gameType=${gameType}&gameSearch=`;

            if (localStorage.getItem("User")) {
                url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
            }
            axios
                .get(url)
                .then((response) => {
                    setAllGameData((allGameData) => {
                        return allGameData?.concat(response.data?.availableGames?.games).flat(1);
                    });
                    if (allProviders?.length === 0) {
                        setAllProviders(response.data?.providers);
                    }
                    setCurrentGameCount(response.data?.availableGames?.currentGamesCount);

                    if (!isGameTypeClick) {
                        if (gameType === "" || gameType === null) {
                            setTotalGames(response.data?.availableGames?.totalGames);
                            setGamesCount(response.data?.availableGames?.totalGames);
                            setGameTypeData(response.data?.gamesTypes);
                        }
                    }
                })
                .catch((error) => {
                    setAllGameError(error.message);
                    setErrorMessage(error.message);
                });
        }
    }, [page]);

    useEffect(() => {
        fetchGames();
    }, [providerId, gameType]);

    const setGameTypeHandler = (type) => {
        if (type === gameType) {
            setGameType("");
            router.replace("/casino", undefined, { shallow: true });
        } else {
            setGameType(type);
            router.replace(`/casino/${type}`, undefined, { shallow: true });
        }
    };

    /**
     * Get Offer Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=casino&status=true&type=offer`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSlidesList(response.data?.data);
                } else {
                    setSlidesList([]);
                }
            })
            .catch((error) => {
                setSlidesList([]);
            })
            .finally(() => {
                setOfferLoading(false);
            });
    }, []);

    /**
     * Get Banner Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=casino&status=true&type=banner`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setBannersList(response.data?.data);
                } else {
                    setBannersList([]);
                }
            })
            .catch((error) => {
                setBannersList([]);
            })
            .finally();
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={title} />
                <meta name="description" content={description} />
            </Head>
            <FrontLayout>
                <ProviderSidebar
                    allProviders={allProviders}
                    allGameTypes={gameTypeData}
                    onPageLoad={onPageLoad}
                />
                <section className="main_banner">
                    {bannersList?.length > 0 && <BannerSlider banners={bannersList} />}
                    {allProviders?.length > 0 && (
                        <GameProviders allProviders={allProviders} errorMessage={allGameError} />
                    )}
                </section>

                <OfferSlider slides={slidesList} loading={offerLoading} />

                <Genres
                    allGameTypes={gameTypeData}
                    setPage={setPage}
                    setGameType={setGameTypeHandler}
                    setIsGameTypeClick={setIsGameTypeClick}
                    errorMessage={allGameError}
                    gameType={gameType}
                    allGamesCount={totalGames}
                />

                <AllProvider
                    allGames={allGameData}
                    errorMessage={allGameError}
                    page={page}
                    setPage={setPage}
                    allGamesCount={totalGames}
                    currentGameCount={currentGameCount}
                    onPageLoad={onPageLoad}
                    allProviders={allProviders}
                    setProviderId={setProviderId}
                />
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps(context) {
    const initialGameType = context.query?.gametype ?? "";

    return {
        props: {
            initialGameType,
            title: "Casino",
            description: "Casino",
        },
    };
}

export default Casino;