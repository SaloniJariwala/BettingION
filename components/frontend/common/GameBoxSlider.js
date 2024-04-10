import Slider from "react-slick";
import GameBox from "./GameBox";
import { NextButton, PrevButton } from "@/components/frontend/UI/sliderButton";

const GameBoxSlider = (props) => {
    var settings = {
        slidesToShow: 3,
        slidesToScroll: 2,
        infinite: true,
        dots: true,
        arrows: true,
        autoplay: false,
        variableWidth: true,
        prevArrow: <PrevButton />,
        nextArrow: <NextButton />,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
        ],
    };

    return (
        <section className="games_slider">
            {props.title && (
                <div className="casino_provide_title">
                    <h3
                        dangerouslySetInnerHTML={{
                            __html: props.title,
                        }}
                    ></h3>
                </div>
            )}

            {props.loading ? (
                <div className="slider_box_loader"></div>
            ) : (
                <Slider className={`${props.className ? props.className : "game_box_slider"}`} {...(props.settings ? props.settings : settings)}>
                    {props.sliderData?.map((data) => (
                        <GameBox key={data.id} data={data} />
                    ))}
                </Slider>
            )}
        </section>
    );
};

export default GameBoxSlider;
