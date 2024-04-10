import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { LanguageState } from "./FrontLanguageProvider";
const GameProviderContext = createContext();

const GamesProvider = ({ children }) => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const [providerId, setProviderId] = useState("");
    const [providerTitle, setProviderTitle] = useState(
        languageData?.provider_sidebar?.all_providers_label?.value || "All Providers"
    );
    const [allGamesCount, setAllGamesCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [pagePerProvider, setPagePerProvider] = useState(0);
    const [isUpdate, setIsUpdate] = useState(false);
    const [gameType, setGameType] = useState("");
    const [isGameTypeClick, setIsGameTypeClick] = useState(false);

    useEffect(() => {
        if (
            router.pathname === "/casino" ||
            router.pathname === "/live-dealer" ||
            router.pathname === "/virtual-sports"
        ) {
            setProviderId("");
            setProviderTitle(languageData?.provider_sidebar?.all_providers_label?.value || "All Providers");
            setAllGamesCount(0);
            setErrorMessage("");
        }
    }, [router]);

    const updateGames = () => {
        setIsUpdate((prev) => !prev);
    };

    return (
        <GameProviderContext.Provider
            value={{
                providerId,
                setProviderId,
                providerTitle,
                setProviderTitle,
                allGamesCount,
                setGamesCount: setAllGamesCount,
                errorMessage,
                setErrorMessage,
                pagePerProvider,
                setPagePerProvider,
                isUpdate,
                updateGames,
                gameType,
                setGameType,
                isGameTypeClick,
                setIsGameTypeClick,
            }}>
            {children}
        </GameProviderContext.Provider>
    );
};

export const GamesProviderState = () => {
    return useContext(GameProviderContext);
};

export default GamesProvider;
