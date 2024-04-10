import AdminLayout from "@/components/admin/AdminLayout";
import SliderModal from "@/components/admin/Modals/SliderModal";
import SliderInfoModal from "@/components/admin/Modals/SlidersInfoModal";
import SliderAccordion from "@/components/admin/Sliders/Slider";
import Title from "@/components/admin/UI/Title";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";

const BannerSliders = (props) => {
    const type = "banner";
    const { adminLanguageData } = AdminLanguageState();
    const [sliderModal, setSliderModal] = useState(false);
    const [slidersList, setSlidersSlist] = useState([]);
    const [refreshList, setRefreshList] = useState(false);
    const [sliderAction, setSliderAction] = useState("");
    const [loading, setIsLoading] = useState(true);
    const [slidersInfoModal, setSlidersInfoModal] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    const reloadList = () => {
        setRefreshList((prev) => !prev);
    };

    const sliderActionHandler = (action, sliderId = 0, slider = {}) => {
        const sliderAction = {
            action: action,
            sliderId: sliderId,
            slider: slider,
        };
        setSliderAction(sliderAction);
        setSliderModal(true);
    };

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);

        setIsLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/admin-slider/admin-slider-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&type=${type}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSlidersSlist(response.data?.data);
                } else {
                    setSlidersSlist([]);
                }
            })
            .catch((error) => {
                setSlidersSlist([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refreshList]);

    return (
        <React.Fragment>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <section className="slider_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {adminLanguageData?.banner_sliders_page?.banner_slider_page_title?.value}
                                        <button type="button" className="sec_btn icon_btn " onClick={() => setSlidersInfoModal(true)}>
                                            <i className="far fa-info"></i>
                                        </button>
                                    </Title>
                                </div>
                            </Col>
                            <Col lg={6} className="text-lg-end">
                                <button type="button" className="sec_btn" onClick={() => sliderActionHandler("add")}>
                                    {adminLanguageData?.banner_sliders_page?.add_slider_button?.value} <i className="far fa-plus-circle"></i>
                                </button>
                            </Col>
                        </Row>
                    </div>

                    {loading ? (
                        <>
                            <span
                                className="load-more"
                                style={{
                                    display: loading ? "block" : "none",
                                    textAlign: "center",
                                    margin: 0,
                                    fontSize: "25px",
                                }}
                            >
                                <i className="fad fa-spinner-third fa-spin"></i>
                            </span>
                        </>
                    ) : slidersList?.length > 0 ? (
                        <div className="slider_main">
                            {slidersList?.map((slider) => {
                                return <SliderAccordion key={`${slider?.id}-slider`} slider={slider} refreshList={reloadList} sliderType={type} />;
                            })}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center">{adminLanguageData?.banner_sliders_page?.no_sliders_found?.value}</p>
                        </div>
                    )}
                </section>
            </AdminLayout>

            <SliderInfoModal show={slidersInfoModal} setShow={setSlidersInfoModal} sliderType={type} />
            <SliderModal setShow={setSliderModal} show={sliderModal} refreshList={reloadList} action={sliderAction} sliderType={type} />
        </React.Fragment>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Offer Sliders",
            description: "Sliders",
        },
    };
}

export default BannerSliders;
