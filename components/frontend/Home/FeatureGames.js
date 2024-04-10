import { useState, useEffect } from "react";
import featureTitleIcon from "@/frontend/images/feature_title_icon.svg";
import Title from "@/frontend/ui/Title";
import GameBoxSlider from "@/frontend/common/GameBoxSlider";
import axios from "axios";
import { LanguageState } from "@/context/FrontLanguageProvider";
import sha1 from 'sha1';

const FeatureGames = () => {
    const [loading, setLoading] = useState(false);
    const [gameData, setGameData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const { languageData } = LanguageState();

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/get-current-feature-games?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`;
        setLoading(true);
        axios
            .get(url)
            .then((response) => {
                if (response.data?.status === 200) {
                    const games = response.data?.data;
                    const finalGames = games.filter(game => game.type === "all");
                    setGameData(finalGames.at(0)?.games);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <section className="feature_games_section">
            <Title className="mb_0" title={languageData?.main_page?.featured_games?.value || "Featured Games"} icon={featureTitleIcon} link="/" />

            {errorMessage ? (
                <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                    {errorMessage}
                </p>
            ) : (
                <GameBoxSlider sliderData={gameData} loading={loading} />
            )}
        </section>
    );
};

export default FeatureGames;
