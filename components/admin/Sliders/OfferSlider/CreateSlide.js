import { useEffect, useState } from "react";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import NextTooltip from "../../UI/NextTooltip";
import SliderModal from "../../Modals/SliderModal";
import sha1 from "sha1";
import axios from "axios";
import Image from "next/image";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const CreateBannerSlide = ({ slider, refreshSlides, sliderType }) => {
    const sliderId = slider?.id;
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const {
        formState: { errors },
    } = methods;
    const [accordionSub, setAccordionSub] = useState(false);
    const languages = [
        { value: "en", label: adminLanguageData?.offer_slider_page?.language_option_english?.value },
    ];

    const [uploadImage, setUploadImage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [imageErrorMessage, setImageErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [imageFile, setImageFile] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChangeTest = (event) => {
        setImageErrorMessage("");
        const file = event.target.files[0];
        if (file?.size > 4194304) {
            setImageErrorMessage("File is too large");
            return;
        }
        setImageFile(file);
        setUploadImage(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const previewHandleClose = () => {
        setImage(false);
        setUploadImage(false);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        let payload = {
            file: imageFile,
            sliderId: slider?.id,
            title: methods.getValues("title"),
            offer: methods.getValues("offer"),
            description: methods.getValues("description"),
            mode: methods.getValues("mode"),
            buttonText: methods.getValues("buttonText"),
            buttonLink: methods.getValues("buttonLink"),
            status: methods.getValues("status"),
            language: methods.getValues("language")?.value,
            type: sliderType,
        };

        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`
        );

        const createSlideUrl = `${
            process.env.NEXT_PUBLIC_API_DOMAIN
        }/api/admin-slider-slide/create-slide?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
            process.env.NEXT_PUBLIC_CASINO
        }&authKey=${authKey}&remoteId=${
            JSON.parse(localStorage?.getItem("User"))?.userId
        }&type=${sliderType}`;
        let createSlide;

        if (image) {
            createSlide = [
                createSlideUrl,
                payload,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "multipart/form-data",
                    },
                },
            ];
        } else {
            createSlide = [createSlideUrl, payload];
        }

        await axios
            .post(...createSlide)
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Slide created successfully");
                    setTimeout(() => {
                        refreshSlides();
                    }, 3000);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className={`slider_main_accordion ${accordionSub ? "active_accordion" : ""}`}>
            <div
                className="h5_title slider_main_accordion_title"
                onClick={() => setAccordionSub(!accordionSub)}>
                <b>
                    <i className="far fa-plus-circle" style={{ color: "#57fba0" }}></i>&nbsp;{" "}
                    {adminLanguageData?.offer_slider_page?.slider_new_slide_title?.value}
                </b>

                <span>
                    <i className="fal fa-chevron-right"></i>
                </span>
            </div>

            <div className="slider_main_accordion_content">
                <div>
                    <FormProvider {...methods}>
                        <form
                            method="POST"
                            className="create_rewards_form create_rewards_box slider_main_form"
                            onSubmit={methods.handleSubmit(handleSubmit)}>
                            <Row>
                                <Col md={12} xl={9} className="order-xl-1 order-2">
                                    <Row>
                                        <Col lg={6}>
                                            <div className="form_input_wp">
                                                <label>
                                                    {" "}
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_title_label?.value
                                                    }
                                                </label>
                                                <input
                                                    name="title"
                                                    type="text"
                                                    className={`form_input ${
                                                        errors?.title ? "input_error" : ""
                                                    }`}
                                                    autoComplete="off"
                                                    {...methods.register("title", {
                                                        required: "Title is required",
                                                    })}
                                                />
                                                {errors?.title && (
                                                    <p className="player-bet-loss">
                                                        {errors?.title?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form_input_wp">
                                                <label>
                                                    {" "}
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_offer_label?.value
                                                    }
                                                </label>
                                                <input
                                                    name="Offer"
                                                    type="text"
                                                    className={`form_input ${
                                                        errors?.offer ? "input_error" : ""
                                                    }`}
                                                    autoComplete="off"
                                                    {...methods.register("offer", {
                                                        required: "Offer is required",
                                                    })}
                                                />
                                                {errors?.offer && (
                                                    <p className="player-bet-loss">
                                                        {errors?.offer?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="form_input_wp">
                                                <label>
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_description_label?.value
                                                    }
                                                </label>
                                                <textarea
                                                    cols="30"
                                                    rows="20"
                                                    className={`form_input ${
                                                        errors?.description ? "input_error" : ""
                                                    }`}
                                                    {...methods.register("description", {
                                                        required: "Description is required",
                                                    })}></textarea>
                                                {errors?.description && (
                                                    <p className="player-bet-loss">
                                                        {errors?.description?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <Row>
                                                <Col lg={12}>
                                                    <div className="form_input_wp">
                                                        <label>
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.slider_button_text_label?.value
                                                            }
                                                        </label>
                                                        <input
                                                            name="button_text"
                                                            type="text"
                                                            className={`form_input ${
                                                                errors?.buttonText ? "input_error" : ""
                                                            }`}
                                                            autoComplete="off"
                                                            {...methods.register("buttonText", {
                                                                required: "Button text is required",
                                                            })}
                                                        />
                                                        {errors?.buttonText && (
                                                            <p className="player-bet-loss">
                                                                {errors?.buttonText?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>

                                                <Col lg={12}>
                                                    <div className="form_input_wp">
                                                        <label>
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.slider_button_link_label?.value
                                                            }
                                                        </label>
                                                        <input
                                                            name="button_link"
                                                            type="text"
                                                            className={`form_input ${
                                                                errors?.buttonLink ? "input_error" : ""
                                                            }`}
                                                            autoComplete="off"
                                                            {...methods.register("buttonLink", {
                                                                required: "Button link is required",
                                                            })}
                                                        />
                                                        {errors?.buttonLink && (
                                                            <p className="player-bet-loss">
                                                                {errors?.buttonLink?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form_input_wp form-element">
                                                <label>
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_mode_label?.value
                                                    }
                                                </label>
                                                <div className="position-relative">
                                                    <select
                                                        name="mode"
                                                        className={`form_input ${
                                                            errors?.mode ? "input_error" : ""
                                                        }`}
                                                        {...methods.register("mode", {
                                                            required: "Mode is required",
                                                        })}>
                                                        <option value="purple">
                                                            {" "}
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.mode_option_purple?.value
                                                            }
                                                        </option>
                                                        <option value="dark">
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.mode_option_dark?.value
                                                            }
                                                        </option>
                                                        <option value="dark2">
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.mode_option_silver?.value
                                                            }
                                                        </option>
                                                    </select>
                                                    <i className="far fa-angle-down"></i>
                                                    {errors?.mode && (
                                                        <p className="player-bet-loss">
                                                            {errors?.mode?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form_input_wp">
                                                <label>
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_language_label?.value
                                                    }
                                                </label>

                                                <Select
                                                    className={`select_box form_input ${
                                                        errors?.language ? "input_error" : ""
                                                    }`}
                                                    classNamePrefix="react-select"
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary: "#fff",
                                                            primary25: "#bd57fb",
                                                            neutral0: "black",
                                                        },
                                                    })}
                                                    {...methods.register("language", {
                                                        required: "Language is required",
                                                    })}
                                                    onChange={(value) => {
                                                        methods.setValue("language", value);
                                                        if (methods.getValues("language") !== "") {
                                                            methods.clearErrors("language");
                                                        }
                                                    }}
                                                    options={languages}
                                                />
                                                {errors?.language && (
                                                    <p className="player-bet-loss">
                                                        {errors?.language?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </Col>
                                        <Col lg={4}>
                                            <div className="form_input_wp form-element">
                                                <label>
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_status_label?.value
                                                    }
                                                </label>
                                                <div className="position-relative">
                                                    <select
                                                        name="status"
                                                        className={`form_input ${
                                                            errors?.status ? "input_error" : ""
                                                        }`}
                                                        {...methods.register("status", {
                                                            required: "Status is required",
                                                        })}>
                                                        <option value={true}>
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.status_option_active?.value
                                                            }
                                                        </option>
                                                        <option value={false}>
                                                            {
                                                                adminLanguageData?.offer_slider_page
                                                                    ?.status_option_not_active?.value
                                                            }
                                                        </option>
                                                    </select>
                                                    <i className="far fa-angle-down"></i>
                                                    {errors?.status && (
                                                        <p className="player-bet-loss">
                                                            {errors?.status?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={12}>
                                            {loading && (
                                                <span
                                                    className="load-more"
                                                    style={{
                                                        display: loading ? "inline-block" : "none",
                                                    }}>
                                                    <i className="fad fa-spinner-third fa-spin"></i>
                                                </span>
                                            )}
                                            <p
                                                className="error-msg"
                                                style={{
                                                    display: errorMessage ? "block" : "none",
                                                }}>
                                                {errorMessage}
                                            </p>
                                            <p
                                                className="success-msg"
                                                style={{
                                                    display: successMessage ? "block" : "none",
                                                }}>
                                                {successMessage}
                                            </p>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col md={12} xl={3} className="mx-auto order-xl-2 order-1">
                                    <div className="accordion_right_content">
                                        <div className="reward_preview create_rewards_box">
                                            <div className="create_rewards_form_title">
                                                <h5 className="h5_title">
                                                    {
                                                        adminLanguageData?.offer_slider_page
                                                            ?.slider_image_title?.value
                                                    }
                                                </h5>
                                            </div>
                                            <div
                                                className="attach_proof_preview_wp"
                                                style={{ display: uploadImage ? "block" : "none" }}>
                                                <div className="attach_proof_preview">
                                                    {uploadImage && (
                                                        <>
                                                            <div className="reward_img">
                                                                <Image
                                                                    src={image}
                                                                    alt="Reward Image"
                                                                    width={350}
                                                                    height={350}
                                                                />
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="finance-image-preview-close close"
                                                                onClick={previewHandleClose}>
                                                                <span aria-hidden="true">×</span>
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="attachment_items">
                                                <ul>
                                                    <li>
                                                        <NextTooltip
                                                            title={
                                                                adminLanguageData?.common_finance_module
                                                                    ?.modals_attach_image_tooltip?.value
                                                            }>
                                                            <div className="sec_btn">
                                                                <input
                                                                    type="file"
                                                                    name="attach_proof_test"
                                                                    id={`attach_proof_${sliderId}`}
                                                                    accept="image/jpg, image/png, image/jpeg"
                                                                    onChange={(event) => {
                                                                        handleFileChangeTest(event);
                                                                    }}
                                                                />
                                                                <label htmlFor={`attach_proof_${sliderId}`}>
                                                                    <i className="far fa-images"></i>
                                                                </label>
                                                                {
                                                                    adminLanguageData?.offer_slider_page
                                                                        ?.slider_upload_image?.value
                                                                }
                                                            </div>
                                                        </NextTooltip>
                                                    </li>
                                                </ul>
                                                {imageErrorMessage && (
                                                    <p
                                                        className="text-center player-bet-loss"
                                                        style={{
                                                            display: imageErrorMessage ? "block" : "none",
                                                        }}>
                                                        {imageErrorMessage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="create_rewards_box">
                                            <h5 className="h5_title">
                                                {
                                                    adminLanguageData?.offer_slider_page
                                                        ?.slider_actions_update?.value
                                                }
                                            </h5>
                                            <div className="button_group">
                                                <button
                                                    type="submit"
                                                    className="sec_btn"
                                                    onClick={() => {
                                                        if (!image || !imageFile) {
                                                            setImageErrorMessage("Image is required");
                                                        }
                                                    }}>
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    );
};

export default CreateBannerSlide;
