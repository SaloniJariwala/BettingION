/* react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { GamesProviderState } from "@/context/GamesProvider";
import Head from "next/head";
import sha1 from "sha1";
import FrontLayout from "@/components/frontend/FrontLayout";
import OfferSlider from "@/components/frontend/common/OfferSlider";
import AllProvider from "@/components/frontend/AllProvider";
import ProviderSidebar from "@/components/frontend/ProviderSidebar";
import GameProviders from "@/components/frontend/Home/GameProviders";
import BannerSlider from "@/components/frontend/common/BannerSlider";

const VirtualSports = (props) => {
    const { providerId, setProviderId, setGamesCount, setErrorMessage, pagePerProvider } =
        GamesProviderState();
    const [page, setPage] = useState(1);
    const [allGameData, setAllGameData] = useState([]);
    const [allGameError, setAllGameError] = useState("");
    const [totalGames, setTotalGames] = useState(0);
    const [onPageLoad, setOnPageLoad] = useState(true);
    const [currentGameCount, setCurrentGameCount] = useState(0);
    const [allProviders, setAllProviders] = useState([]);
    const [slidesList, setSlidesList] = useState([]);
    const [bannersList, setBannersList] = useState([]);
    const [offerLoading, setOfferLoading] = useState(true);

    const fetchGames = () => {
        setOnPageLoad(true);
        let url = `${
            process.env.NEXT_PUBLIC_API_DOMAIN
        }/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
            process.env.NEXT_PUBLIC_CASINO
        }&page=${pagePerProvider === 1 ? 1 : page}&provider=${providerId}&gameType=Virtual&gameSearch=`;
        if (localStorage.getItem("User")) {
            url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
        }
        axios
            .get(url)
            .then((response) => {
                setAllGameData(response.data?.availableGames?.games);
                if (allProviders?.length === 0) {
                    setAllProviders(response.data?.providers);
                }
                setTotalGames(response.data?.availableGames?.totalGames);
                setCurrentGameCount(response.data?.availableGames?.currentGamesCount);
                setGamesCount(response.data?.availableGames?.totalGames);
            })
            .catch((error) => {
                setAllGameError(error.message);
                setErrorMessage(error.message);
            })
            .finally(() => {
                setOnPageLoad(false);
            });
    };

    useEffect(() => {
        if (page !== 1) {
            setOnPageLoad(false);
            let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/games/admin/getAllCombineAPI?action=available_games&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&page=${page}&provider=${providerId}&gameType=Virtual&gameSearch=`;
            if (localStorage.getItem("User")) {
                url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
            }
            axios
                .get(url)
                .then((response) => {
                    setAllGameData([...allGameData, ...response.data?.availableGames?.games]);
                    if (allProviders?.length === 0) {
                        setAllProviders(response.data?.providers);
                    }
                    setTotalGames(response.data?.availableGames?.totalGames);
                    setCurrentGameCount(response.data?.availableGames?.currentGamesCount);
                    setGamesCount(response.data?.availableGames?.totalGames);
                })
                .catch((error) => {
                    setAllGameError(error.message);
                    setErrorMessage(error.message);
                });
        }
    }, [page]);

    useEffect(() => {
        fetchGames();
    }, [providerId]);

    /**
     * Get Offer Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=virtual-sports&status=true&type=offer`
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
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=virtual-sports&status=true&type=banner`
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
            .finally(() => {
                // console.log(bannersList);
            });
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <ProviderSidebar allProviders={allProviders} onPageLoad={onPageLoad} showCategories={false} />
                <section className="main_banner">
                    {bannersList?.length > 0 && <BannerSlider banners={bannersList} />}
                    {allProviders?.length > 0 && (
                        <GameProviders allProviders={allProviders} errorMessage={allGameError} />
                    )}
                </section>

                <OfferSlider slides={slidesList} loading={offerLoading} />

                <div className="pt_30">
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
                </div>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Virtual sports",
            description: "Virtual sports",
        },
    };
}

export default VirtualSports;
