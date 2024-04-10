import Image from "next/image";
import Button from "@/components/frontend/UI/Button";
import Slider from "react-slick";
import { NextButton, PrevButton } from "@/components/frontend/UI/sliderButton";

const OfferSlider = ({ slides, className, loading = false }) => {
    const SliderBox = ({ slide }) => {
        const { title, offer, description, buttonText, buttonLink, image, mode } = slide;

        return (
            <div className={`offer_slider_box ${mode === "dark" ? "offer_dark_slider_box" : ""} ${mode === "dark2" ? "offer_dark2_slider_box" : ""}`}>
                <div className="offer_slider_text">
                    <h2>
                        {title}
                        {offer?.trim().length !== 0 ? <span>{" " + offer?.trim()}</span> : ""}
                    </h2>
                    <p className="white_text" dangerouslySetInnerHTML={{ __html: description }} />
                    <Button href={buttonLink} variant={`${mode === "purple" && "transparent"}` || `${mode === "dark" && null}``${mode === "dark2" && null}`}>
                        {buttonText}
                    </Button>
                </div>

                <div className="offer_slider_img">
                    <Image loading="lazy" quality={40} src={image} alt="BattingIon Offer" width={513} height={355} />{" "}
                </div>
            </div>
        );
    };

    const settings = {
        slidesToShow: 2,
        slidesToScroll: 1,
        swipeToSlide: true,
        infinite: true,
        dots: false,
        arrows: true,
        autoplay: true,
        speed: 1000,
        prevArrow: <PrevButton />,
        nextArrow: <NextButton />,
        responsive: [{ breakpoint: 767, settings: { slidesToShow: 1 } }],
    };

    return loading ? (
        <div className="slider_box_loader offer_slider_loader"></div>
    ) : (
        slides?.length !== 0 && (
            <Slider className={`slider_box_space offer_slider ${className ? className : ""}`} {...settings}>
                {slides?.map((slide, index) => {
                    return <SliderBox key={index} slide={slide} />;
                })}
            </Slider>
        )
    );
};

export default OfferSlider;
