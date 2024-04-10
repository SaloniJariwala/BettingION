import Title from "@/frontend/ui/Title";
import gameProvidersTitleIcon from "@/frontend/images/game_providers_title_icon.svg";
import ProviderSlider from "@/frontend/common/ProviderSlider";
import { LanguageState } from "@/context/FrontLanguageProvider";

const GameProviders = ({ allProviders, errorMessage, loading }) => {
    const { languageData } = LanguageState();

    return loading ? (
        <div className="slider_box_loader"></div>
    ) : (
        <section className="game_provider_sec">
            <Title className="mb_0" title={languageData?.main_page?.games_providers?.value || "Game Providers"} icon={gameProvidersTitleIcon} link="/" />

            <ProviderSlider allProviders={allProviders} errorMessage={errorMessage} />
        </section>
    );
};

export default GameProviders;
