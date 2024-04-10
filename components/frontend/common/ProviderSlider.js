import { NextButton, PrevButton } from "../UI/sliderButton";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import slugify from "slugify";
import { useRouter } from "next/router";

const ProviderSlider = ({ providerPage = false, ...props }) => {
    const router = useRouter(); // Initializing router

    var settings = {
        slidesToShow: 3,
        slidesToScroll: 3,
        swipeToSlide: true,
        infinite: true,
        dots: false,
        arrows: true,
        variableWidth: true,
        autoplay: false,
        speed: 1000,
        prevArrow: <PrevButton />,
        nextArrow: <NextButton />,
        responsive: [
            {
                breakpoint: 1367,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 576,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
            {
                breakpoint: 430,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    arrows: false,
                },
            },
        ],
    };

    return !props.errorMessage ? (
        <Slider className="game_provider_list_slider" {...(props.settings ? props.settings : settings)}>
            {props.allProviders?.map((data, index) => (
                <Link
                    href={{
                        pathname: "/provider/[page]/[provider]",
                        query: {
                            page: providerPage ? providerPage : router.pathname === "/" ? "all" : router.pathname?.replace("/", ""),
                            provider: slugify(data?.name, { lower: true }),
                        },
                    }}
                    className={`game_provider_box ${props.activeProvider === data?.name ? "game_provider_box_active" : ""}`}
                    key={index}
                    title={data?.name}
                >
                    {data.logoURL ? <Image className="game_provider_img" src={data?.logoURL} alt={data?.name} width={200} height={80} loading="lazy" quality={40} /> : data.name}
                </Link>
            ))}
        </Slider>
    ) : (
        <p className="error-msg" style={{ display: props.errorMessage ? "block" : "none" }}>
            {props.errorMessage}
        </p>
    );
};

export default ProviderSlider;
