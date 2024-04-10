import Image from "next/image";
import Button from "@/components/frontend/UI/Button";
import { Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import { NextButton, PrevButton } from "@/components/frontend/UI/sliderButton";

const BannerSlider = ({ banners }) => {
    const settings = {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        arrows: false,
        autoplay: false,
        autoplaySpeed: 3000,
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
        <>
            <Slider className="banner_slider" {...settings}>
                {banners?.map((banner) => {
                    const { id, backgroundImage, title, image, buttonText, buttonLink, description } = banner;

                    return (
                        <div className="main_banner_wrapper" key={id}>
                            {backgroundImage && (
                                <div className="banner_bg_img">
                                    <Image loading="lazy" src={backgroundImage} alt={title} width={1920} height={960} />
                                </div>
                            )}
                            <div>
                                <Row className="align-items-center">
                                    <Col lg={7}>
                                        <div className="banner_text">
                                            <h1 className="h1_title">{title}</h1>
                                            <p>{description}</p>
                                            {buttonText?.trim()?.length > 0 && (buttonLink.trim()?.length > 0 ? <Button href={buttonLink}>{buttonText}</Button> : <Button>{buttonText}</Button>)}
                                        </div>
                                    </Col>

                                    <Col lg={5}>
                                        <div className="banner_img">
                                            <Image loading="lazy" src={image} alt={title} width={540} height={480} />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    );
                })}
            </Slider>
        </>
    );
};

export default BannerSlider;
