import Head from "next/head";
import { BalanceState } from "@/context/BalanceProvider";
import { useEffect, useState } from "react";
import axios from "axios";
import FrontLayout from "@/components/frontend/FrontLayout";
import PlayButtons from "@/components/frontend/Games/PlayButtons";

const OnlinePoker = (props) => {
    const { updateBalance, userDefaultCurrency } = BalanceState();
    const [url, setUrl] = useState("");
    const [gameData, setGameData] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isPlay, setIsPlay] = useState(false);

    useEffect(() => {
        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/games/admin/getAllCombineAPI?action=search_game&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&id=6-601`;
        if (localStorage.getItem("User")) {
            url = url + `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
        }
        axios
            .get(url)
            .then((response) => {
                if (response.data?.status === 200) {
                    setGameData(response.data?.data?.currentGame);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <section className="single_game">
                    <div className="single_game_main_fullscreen">
                        <section className="single_game_sec">
                            {errorMessage ? (
                                <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                    {errorMessage}
                                </p>
                            ) : !url && !isPlay && userDefaultCurrency?.currencyAbrv ? (
                                <PlayButtons setPokerGameUrl={setUrl} isPlay={setIsPlay} data={gameData} pageType="poker" gameCurrency={userDefaultCurrency?.currencyAbrv ? userDefaultCurrency?.currencyAbrv : 'USD'} setErrorMessage={setErrorMessage} />
                            ) : (
                                <iframe
                                    width="560"
                                    height="315"
                                    src={url}
                                    title="Game player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            )}
                        </section>
                    </div>
                </section>
            </FrontLayout>
            {/* <LoginModal show={true} /> */}
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Online Poker",
            description: "Online Poker",
        },
    };
}

export default OnlinePoker;
