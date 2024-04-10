import Slider from "react-slick";
import { NextButton, PrevButton } from "@/components/frontend/UI/sliderButton";
import Image from "next/image";
import commonGenera from "./genres/ClassicSlots.png";
import { LanguageState } from "@/context/FrontLanguageProvider";

const Genres = ({ allGameTypes, setPage, setGameType, setIsGameTypeClick, errorMessage, allGamesCount, gameType }) => {
    const { languageData } = LanguageState();

    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: true,
        dots: false,
        arrows: true,
        autoplay: true,
        speed: 1000,
        variableWidth: true,
        prevArrow: <PrevButton />,
        nextArrow: <NextButton />,
    };

    const tryRequire = (path) => {
        try {
            return require(`${path}`);
        } catch (err) {
            return false;
        }
    };

    // Function to convert camelCase to regular sentence
    const camelCaseToRegular = (text) => {
        return text.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
            return str.toUpperCase();
        });
    };

    return errorMessage ? (
        <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
            {errorMessage}
        </p>
    ) : (
        <div className="genres_sec">
            <button
                className="genres_games_button"
                type="button"
                onClick={() => {
                    setPage(1);
                    setGameType("");
                    setIsGameTypeClick(true);
                }}
            >
                {languageData?.all_casino_page?.all_genres?.value || "All Genres"}
                <span>
                    {allGamesCount} {languageData?.all_casino_page?.all_genres_games?.value || "games"}
                </span>
            </button>
            <Slider className="slider_box_space genres_slider" {...settings}>
                {allGameTypes?.map((data, index) => {
                    const path = `./genres/${data?.name}.png`;
                    return (
                        <div
                            className={`genres_slider_box ${gameType === data?.name ? "genres_slider_box_active" : ""}`}
                            key={index}
                            onClick={() => {
                                setPage(1);
                                setGameType(data?.name);
                                setIsGameTypeClick(true);
                            }}
                        >
                            <div className="genres_slider_img">
                                {tryRequire(path) ? (
                                    <Image loading="lazy" src={tryRequire(path)?.default} alt={data?.name} width={100} height={100} />
                                ) : (
                                    <Image loading="lazy" src={commonGenera} alt={data?.name} width={100} height={100} />
                                )}
                            </div>
                            <h6>
                                {camelCaseToRegular(data?.name)} <span>{data?.gamesCount} games</span>
                            </h6>
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
};

export default Genres;
