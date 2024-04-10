import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import sha1 from "sha1";
import homePageBg from "@/frontend/images/main_bg_img.png";
import FrontLayout from "@/components/frontend/FrontLayout";
import OfferSlider from "@/components/frontend/common/OfferSlider";
import PopularSlot from "@/components/frontend/Home/PopularSlot";
import FeatureGames from "@/components/frontend/Home/FeatureGames";
import GameProviders from "@/components/frontend/Home/GameProviders";
import LiveGames from "@/components/frontend/Home/LiveGames";
import Loader from "@/components/admin/UI/Loader";

const Home = (props) => {
    const [allProviders, setAllProviders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [pageLoad, setPageLoad] = useState(true);
    const [slidesList, setSlidesList] = useState([]);
    const [offerLoading, setOfferLoading] = useState(true);

    useEffect(() => {
        setPageLoad(false);
    }, []);

    useEffect(() => {
        setLoading(true);
        axios
            .get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/games/admin/getAllCombineAPI?action=get_providers&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}`)
            .then((response) => {
                if (response.data?.status === 200) {
                    setAllProviders(response.data?.data);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    /**
     * Get Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=main-page&status=true&type=offer`
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

    return (
        <>
            {/* {pageLoad ? (
                <Loader fullScreen />
            ) : ( */}
            <>
                <Head>
                    <meta name="title" content={props.title} />
                    <meta name="description" content={props.description} />
                </Head>
                <FrontLayout>
                    {/* {pageLoad && <Loader fullScreen />} */}

                    {/* <div className="page_bg_img">
                        <Image
                            loading="lazy"
                            src={homePageBg}
                            alt="BettingIon Home Background"
                            layout="responsive"
                            sizes="100vw"
                            quality={10}
                            placeholder="blur"
                            style={{
                                width: "100%",
                                height: "auto",
                                objectFit: "cover",
                            }}
                        />
                    </div> */}

                    <OfferSlider className="home_page_offer_slider" slides={slidesList} loading={offerLoading} />

                    <PopularSlot />
                    <FeatureGames />
                    <GameProviders allProviders={allProviders} errorMessage={errorMessage} loading={loading} />
                    <LiveGames />
                </FrontLayout>
            </>
            {/* )} */}
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Main page",
            description: "Main page",
        },
    };
}

export default Home;
