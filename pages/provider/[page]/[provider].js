/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { GamesProviderState } from "@/context/GamesProvider";
import axios from "axios";
import { useRouter } from "next/router"; // Importing useRouter
import slugify from "slugify";
import sha1 from "sha1";
import Head from "next/head";
import FrontLayout from "@/components/frontend/FrontLayout";
import OfferSlider from "@/components/frontend/common/OfferSlider";
import ProviderSlider from "@/components/frontend/common/ProviderSlider";
import AllProvider from "@/components/frontend/AllProvider";
import BannerSlider from "@/components/frontend/common/BannerSlider";
import Genres from "@/components/frontend/common/Genres";

const Casino = ({ initialGameType, title, description }) => {
    const router = useRouter(); // Initializing router
    const { setGamesCount, setErrorMessage, pagePerProvider } = GamesProviderState();
    const [gameType, setGameType] = useState(initialGameType || "");
    const [page, setPage] = useState(1);
    const [allGameData, setAllGameData] = useState([]);
    const [allGameError, setAllGameError] = useState("");
    const [gameTypeData, setGameTypeData] = useState([]);
    const [totalGames, setTotalGames] = useState(0);
    const [onPageLoad, setOnPageLoad] = useState(true);
    const [isGameTypeClick, setIsGameTypeClick] = useState(false);
    const [currentGameCount, setCurrentGameCount] = useState(0);
    const [allProviders, setAllProviders] = useState([]);
    const [providerId, setProviderId] = useState("");
    const [activeProvider, setActiveProvider] = useState("");
    const [pageFor, setPageFor] = useState("");
    const [providerPage, setProviderPage] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState("");
    const [loadingProvider, setLoadingProvider] = useState(true);
    const [slidesList, setSlidesList] = useState([]);
    const [bannersList, setBannersList] = useState([]);
    const [offerLoading, setOfferLoading] = useState(true);

    const pageGameTypes = {
        all: "",
        casino: "",
        live_dealer: "LiveGames",
        virtual_sports: "Virtual",
    };

    useEffect(() => {
        const slugSplitted = window?.location?.pathname?.split("/");
        const providerIndex = slugSplitted?.indexOf("provider");
        const pageName = slugSplitted?.at(providerIndex + 1);
        const provider = slugSplitted?.at(providerIndex + 2);
        setProviderPage(pageName);
        setNotFound(false);
        setLoadingProvider(true);

        if (pageName?.replace("-", "_") in pageGameTypes) {
            if (pageName?.replace("-", "_") !== "live_dealer")
                setGameType(pageGameTypes[pageName?.replace("-", "_")]);
            setNotFound(true);
        } else {
            setGameType("");
        }

        setPageFor(pageName?.replace("-", "_"));

        let matchedProvider = false;
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/games/admin/getAllCombineAPI?action=get_providers&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    response.data?.data?.filter((providerObject) => {
                        if (provider === slugify(providerObject?.name, { lower: true })) {
                            matchedProvider = true;
                            setProviderId(providerObject?.providerID);
                            setActiveProvider(providerObject?.name);
                        }
                    });
                } else {
                    setNotFound(!matchedProvider);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
                setError(error.message);
                setNotFound(true);
            })
            .finally(() => {
                setNotFound(!matchedProvider);
                setLoadingProvider(false);
            });
    }, [router]);

    const fetchGames = () => {
        if (providerId === "") return;
        setOnPageLoad(true);

        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN
            }/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO
            }&page=${pagePerProvider === 1 ? 1 : page}&provider=${providerId}&gameType=${pageFor === "live_dealer" ? pageGameTypes[pageFor] : gameType
            }${pageFor === "live_dealer" ? "&gameTypeSecondary=" + gameType : ""}`;
        if (localStorage.getItem("User")) {
            url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
        }
        axios
            .get(url)
            .then((response) => {
                setAllGameData(response.data?.availableGames?.games);
                setCurrentGameCount(response.data?.availableGames?.currentGamesCount);
                if (!isGameTypeClick) {
                    if (gameType === "" || gameType === null || gameType === pageGameTypes[pageFor]) {
                        setTotalGames(response.data?.availableGames?.totalGames);
                        setGamesCount(response.data?.availableGames?.totalGames);
                        if (pageFor === "live_dealer") {
                            setGameTypeData(response.data?.subGameTypes);
                        } else {
                            setGameTypeData(response.data?.gamesTypes);
                        }
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
        if (page === 1) {
            let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&page=${page}&gameType=${gameType}`;
            if (localStorage.getItem("User")) {
                url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
            }
            axios
                .get(url)
                .then((response) => {
                    if (allProviders?.length === 0) {
                        setAllProviders(response.data?.providers);
                    }
                })
                .catch((error) => {
                    setAllGameError(error.message);
                    setErrorMessage(error.message);
                });
        }
    }, []);

    useEffect(() => {
        if (page !== 1) {
            setOnPageLoad(false);
            let url = `${process.env.NEXT_PUBLIC_API_DOMAIN
                }/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&page=${page}&provider=${providerId}&gameType=${pageFor === "live_dealer" ? pageGameTypes[pageFor] : gameType
                }${pageFor === "live_dealer" ? "&gameTypeSecondary=" + gameType : ""}`;
            if (localStorage.getItem("User")) {
                url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
            }
            axios
                .get(url)
                .then((response) => {
                    setAllGameData([...allGameData, ...response.data?.availableGames?.games]);
                    setCurrentGameCount(response.data?.availableGames?.currentGamesCount);
                    if (!isGameTypeClick) {
                        if (gameType === "" || gameType === null || gameType === pageGameTypes[pageFor]) {
                            setTotalGames(response.data?.availableGames?.totalGames);
                            setGamesCount(response.data?.availableGames?.totalGames);
                            if (pageFor === "live_dealer") {
                                setGameTypeData(response.data?.subGameTypes);
                            } else {
                                setGameTypeData(response.data?.gamesTypes);
                            }
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
    }, [gameType, providerId]);

    /**
     * Get Offer Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=providers&status=true&type=offer`
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
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=providers&status=true&type=banner`
            )
            .then((response) => {
                console.log(response.data);
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

    return loadingProvider ? (
        <>
            <span
                className="load-more reward_error"
                style={{
                    display: loadingProvider ? "block" : "none",
                    textAlign: "center",
                    margin: 0,
                    fontSize: "25px",
                }}>
                <i className="fad fa-spinner-third fa-spin"></i>
            </span>
        </>
    ) : notFound ? (
        <>
            <div className="reward_error">
                <h1 className="h3_title">{error ? error : "404 | This page could not be found."}</h1>
            </div>
        </>
    ) : (
        <>
            <Head>
                <meta name="title" content={title} />
                <meta name="description" content={description} />
            </Head>
            <FrontLayout>
                <section className="main_banner">
                    {bannersList?.length > 0 && <BannerSlider banners={bannersList} />}

                    <div className="pt_30">
                        <ProviderSlider
                            allProviders={allProviders}
                            activeProvider={activeProvider}
                            errorMessage={allGameError}
                            providerPage={providerPage}
                        />
                    </div>
                </section>

                <div className="pt_30">
                    <OfferSlider slides={slidesList} loading={offerLoading} />
                </div>

                <Genres
                    allGameTypes={gameTypeData}
                    setPage={setPage}
                    setGameType={setGameType}
                    setIsGameTypeClick={setIsGameTypeClick}
                    errorMessage={allGameError}
                    gameType={gameType}
                    allGamesCount={totalGames}
                />

                <AllProvider
                    activeProvider={activeProvider}
                    allGames={allGameData}
                    errorMessage={allGameError}
                    page={page}
                    setPage={setPage}
                    allGamesCount={totalGames}
                    currentGameCount={currentGameCount}
                    onPageLoad={onPageLoad}
                    pageSlug="provider-page"
                />
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps(context) {
    const initialGameType = context.query.gameType || "";

    return {
        props: {
            initialGameType,
            title: "Provider single page",
            description: "Provider single page",
        },
    };
}

export default Casino;
