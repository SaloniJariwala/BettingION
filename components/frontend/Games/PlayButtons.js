import React, { useEffect, useState } from "react";
import Button from "../UI/Button";
import { providerIds } from "@/pages/api/SessionNotRequiredProviderIds";
import axios from "axios";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import LoginModal from "../Modal/LoginModal";
import { LanguageState } from "@/context/FrontLanguageProvider";

const PlayButtons = ({
    settingGameUrl,
    data,
    id,
    setPokerGameUrl,
    setErrorMessage,
    settingErrorMessage,
    pageType = false,
    isPlay,
    gameCurrency
}) => {
    const { updateBalance } = BalanceState();
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [playMoney, setPlayMoney] = useState(false);
    const [currentUser, setCurrentUser] = useState(false);
    const { languageData } = LanguageState();

    const getGameUrl = async (mode, data, currency) => {
        let gameUrl;
        let gamePlayUrl;

        if (providerIds?.includes(Number(data?.providerId))) {
            let url;
            if (mode === "offline") {
                url = `${data?.serverUrl}?token=${process.env.NEXT_PUBLIC_TOKEN}&currency=${currency}&action=gameLoad&casino=${process.env.NEXT_PUBLIC_CASINO}&game_id=${data?.id}&language=${router?.locale}&mode=offline`;
            } else {
                url = `${data?.serverUrl}?token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${JSON.parse(localStorage.getItem("User"))?.userId
                    }&currency=${currency}&action=gameLoad&casino=${process.env.NEXT_PUBLIC_CASINO}&game_id=${data?.id
                    }&language=${router?.locale}`;
            }
            await axios
                .get(url)
                .then((response) => {
                    if (response.data?.status === 200) {
                        gameUrl = response.data?.result;
                    } else {
                        if (setErrorMessage) {
                            setErrorMessage(response.data?.response);
                        }
                        if (settingErrorMessage) {
                            settingErrorMessage(response.data?.response, id);
                        }
                    }
                })
                .catch((error) => {
                    if (setErrorMessage) {
                        setErrorMessage(error.message);
                    }
                    if (settingErrorMessage) {
                        settingErrorMessage(error.message, id);
                    }
                });
        } else {
            const url = `${data?.serverUrl}?token=${process.env.NEXT_PUBLIC_TOKEN
                }&currency=${currency}&action=gameLoad&casino=${process.env.NEXT_PUBLIC_CASINO}&game_id=${data?.id
                }&remote_id=${JSON.parse(localStorage.getItem("User"))?.userId}`;
            await axios
                .get(url)
                .then((response) => {
                    if (response.data?.status) {
                        let token = response.data?.result;
                        let serverUrl = response.data?.serverUrl;
                        if (mode === "offline") {
                            gameUrl = `${data?.gameUrl}?token=${data?.providerSecret}&casino=${data?.partnerClientId}&language=${router?.locale}&currency=${currency}&mode=offline&session_id=${token}&game_id=${data?.providerGameId}&server=${serverUrl}`;
                        } else {
                            gameUrl = `${data?.gameUrl}?token=${data?.providerSecret}&casino=${data?.partnerClientId
                                }&language=${router?.locale}&currency=${currency}&remote_id=${JSON.parse(localStorage.getItem("User"))?.userId
                                }&session_id=${token}&game_id=${data?.providerGameId}&server=${serverUrl}`;
                        }
                    } else {
                        if (setErrorMessage) {
                            setErrorMessage(response.data?.response);
                        }
                        if (settingErrorMessage) {
                            settingErrorMessage(response.data?.response, id);
                        }
                    }
                })
                .catch((error) => {
                    if (setErrorMessage) {
                        setErrorMessage(error.message);
                    }
                    if (settingErrorMessage) {
                        settingErrorMessage(error.message, id);
                    }
                });
        }
        if (gameUrl) {
            if (gameUrl?.includes("?")) {
                gamePlayUrl = `${gameUrl}&deposit=${process.env.NEXT_PUBLIC_SITE_URL}/my-account/deposit/`;
            } else {
                gamePlayUrl = `${gameUrl}?deposit=${process.env.NEXT_PUBLIC_SITE_URL}/my-account/deposit/`;
            }
        }
        return gamePlayUrl;
    };

    /**
     * Set current user
     */
    useEffect(() => {
        if (localStorage.getItem("User")) {
            setCurrentUser(JSON.parse(localStorage.getItem("User")));
        }
    }, []);

    /**
     * Poker Page Url Generate
     */
    useEffect(() => {
        if ("poker" === pageType && data && JSON.parse(localStorage.getItem("User"))) {
            (async () => {
                const pokerUrl = await getGameUrl("online", data, gameCurrency);
                if (setPokerGameUrl) {
                    setPokerGameUrl(pokerUrl);
                    isPlay(true);
                    setInterval(updateBalance, 15000);
                }
            })();
        }
    }, [data, show]);

    const moneyPlayGame = async () => {
        const url = await getGameUrl("online", data, gameCurrency);
        if (settingGameUrl) settingGameUrl(url, id);
        setPlayMoney();
        setInterval(updateBalance, 15000);
    };

    useEffect(() => {
        if (playMoney === "yes") {
            moneyPlayGame();
        }
    }, [show, playMoney]);

    return (
        <>
            <div className="single_game_step1">
                <div className="button_group">
                    {playMoney !== "yes" && (
                        <>
                            {(!("poker" === pageType || data?.gameType === "LiveGames") ||
                                (router.pathname === "/casino" && data?.isFreemode && data?.isDemo) ||
                                (router.pathname !== "/live-dealer" && data?.isDemo) ||
                                (data?.isFreemode && data?.isDemo)
                            ) && (
                                    <Button
                                        type="button"
                                        variant="transparent"
                                        onClick={async () => {
                                            const url = await getGameUrl(
                                                "offline",
                                                data,
                                                gameCurrency
                                            );
                                            if (settingGameUrl) {
                                                settingGameUrl(url, id);
                                            }
                                        }}
                                    >
                                        {languageData?.game_box?.free_play_button?.value}
                                    </Button>
                                )
                            }

                            {(!pageType || !("poker" === pageType && currentUser !== false)) && (
                                <>
                                    <Button
                                        type="button"
                                        onClick={async () => {
                                            if (currentUser === false) {
                                                setShow(true);
                                            } else {
                                                moneyPlayGame();
                                            }
                                        }}>
                                        {languageData?.game_box?.real_money_button?.value}
                                    </Button>
                                    <LoginModal show={show} setShow={setShow} setPlayMoney={setPlayMoney} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </div >
        </>
    );
};

export default PlayButtons;
