import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import sha1 from "sha1";
import axios from "axios";
import OfferSlidesList from "./OfferSlider/SlidesList";
import BannerSlidesList from "./BannerSlider/SlidesList";
import CreateOfferSlide from "./OfferSlider/CreateSlide";
import CreateBannerSlide from "./BannerSlider/CreateSlide";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const SlideAccrordion = ({ slider, sliderType }) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const {
        formState: { errors },
    } = methods;
    const [newSlide, setNewSlide] = useState(false);
    const [slidesList, setSlidesList] = useState([]);
    const [refreshSlides, setRefreshSlides] = useState(false);
    const [loadingSlides, setLoadingSlides] = useState(true);

    const reloadSlides = () => {
        setNewSlide(!newSlide);
        setRefreshSlides(!refreshSlides);
    };

    useEffect(() => {
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`
        );

        setLoadingSlides(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/admin-slider-slide/get-slides-list?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&sliderId=${slider?.id}&type=${sliderType}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSlidesList(response.data?.data);
                } else {
                    setSlidesList([]);
                }
            })
            .catch((error) => {
                setSlidesList([]);
            })
            .finally(() => {
                setLoadingSlides(false);
            });
    }, [refreshSlides]);

    return (
        <div className="slider_main_accordion_content">
            <div>
                {loadingSlides ? (
                    <>
                        <span
                            className="load-more mt_20"
                            style={{
                                display: loadingSlides ? "block" : "none",
                                textAlign: "center",
                                margin: 0,
                                fontSize: "25px",
                            }}>
                            <i className="fad fa-spinner-third fa-spin"></i>
                        </span>
                    </>
                ) : (
                    slidesList?.length > 0 &&
                    slidesList?.map((slide) => {
                        if ("offer" === sliderType) {
                            return (
                                <OfferSlidesList
                                    key={`${slide?.id}-slide`}
                                    slider={slider}
                                    slide={slide}
                                    refreshSlides={reloadSlides}
                                    sliderType={sliderType}
                                />
                            );
                        } else if ("banner" === sliderType) {
                            return (
                                <BannerSlidesList
                                    key={`${slide?.id}-slide`}
                                    slider={slider}
                                    slide={slide}
                                    refreshSlides={reloadSlides}
                                    sliderType={sliderType}
                                />
                            );
                        }
                    })
                )}

                {newSlide ? (
                    <>
                        {"offer" === sliderType && (
                            <CreateOfferSlide
                                key={`${slider?.id}-create`}
                                slider={slider}
                                refreshSlides={reloadSlides}
                                sliderType={sliderType}
                            />
                        )}
                        {"banner" === sliderType && (
                            <CreateBannerSlide
                                key={`${slider?.id}-create`}
                                slider={slider}
                                refreshSlides={reloadSlides}
                                sliderType={sliderType}
                            />
                        )}
                    </>
                ) : (
                    <Row>
                        <Col lg={12} className={`mb_20 ${slidesList?.length === 0 ? "mt_20" : ""}`}>
                            <button className="sec_btn" onClick={() => setNewSlide(true)}>
                                {adminLanguageData?.offer_slider_page?.slider_new_slide_button?.value}{" "}
                                <i className="far fa-plus-circle"></i>
                            </button>
                        </Col>
                    </Row>
                )}
            </div>
        </div>
    );
};

export default SlideAccrordion;
