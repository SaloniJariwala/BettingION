/* react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import BonusTranslationModal from "../Modals/BonusTranslationModal";
import Image from "next/image";
import TimezoneContainer from "./TimezoneContainer";
import { Col, Row } from "react-bootstrap";
import RolloversDataContainer from "./RolloversDataContainer";
import BonusDataContainer from "./BonusDataContainer";
import AllocationCriteria from "./AllocationCriteria";
import PromoCodeContainer from "./PromoCodeContainer";
import EndTimeContainer from "../FormField/EndTimeContainer";
import EndDateContainer from "../FormField/EndDateContainer";
import StartTimeContainer from "../FormField/StartTimeContainer";
import StartDateContainer from "../FormField/StartDateContainer";
import StatusContainer from "./StatusContainer";
import CurrencyContainer from "./CurrencyContainer";
import BonusTypeContainer from "./BonusTypeContainer";
import InternalNameContainer from "./InternalNameContainer";
import { FormProvider, useForm } from "react-hook-form";
import Title from "../UI/Title";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import sha1 from "sha1";
import { useRouter } from "next/router";
import JA from "@/frontend/images/ja.png";
import EN from "@/frontend/images/en_US.png";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AddEditBonus = ({ bonusDetails }) => {
    const methods = useForm();
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const [promoCodes, setPromoCodes] = useState();
    const [allocationInfo, setAllocationInfo] = useState();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitClick, setIsSubmitClick] = useState(false);
    const [fetchCurrency, setFetchCurrency] = useState(false);
    const [fixedBonusInfo, setFixedBonusInfo] = useState([]);
    const [depositPercentageInfo, setDepositPercentageInfo] = useState([]);
    const [show, setShow] = useState(false);
    const [language, setLanguage] = useState("");
    const [translation, setTranslation] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [translationData, setTranslationData] = useState();
    const [allocationInfoError, setAllocationInfoError] = useState([]);
    const [showDepositPercentage, setShowDepositPercentage] = useState(false);
    const [fixedBonusDisplay, setFixedBonusDisplay] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    useEffect(() => {
        if (bonusDetails) {
            methods.setValue("internalName", bonusDetails?.internalName);
            methods.setValue("status", bonusDetails?.status === false ? "no" : true);
            methods.setValue("startDate", new Date(bonusDetails?.startDate?.split("T")[0]));
            const stime = bonusDetails?.startDate?.split("T")[1]?.split(".")[0];
            const startTime = new Date(bonusDetails?.startDate?.split("T")[0]).setHours(
                stime?.split(":")[0],
                stime?.split(":")[1],
                stime?.split(":")[2]
            );
            methods.setValue("startTime", startTime);
            methods.setValue("endDate", new Date(bonusDetails?.endDate?.split("T")[0]));
            const etime = bonusDetails?.endDate?.split("T")[1]?.split(".")[0];
            const endTime = new Date(bonusDetails?.endDate?.split("T")[0]).setHours(
                etime?.split(":")[0],
                etime?.split(":")[1],
                etime?.split(":")[2]
            );
            methods.setValue("endTime", endTime);
            methods.setValue("allocationType", bonusDetails?.allocationType);
            setTranslationData(bonusDetails?.translation);
            setTranslation(bonusDetails?.translation);
        }
    }, [bonusDetails]);

    const gettingDates = () => {
        let startDate = methods.getValues("startDate");
        let startTime = new Date(methods.getValues("startTime"));
        let endDate = methods.getValues("endDate");
        let endTime = new Date(methods.getValues("endTime"));
        if (!startDate) {
            startDate = new Date();
        }
        if (!startTime) {
            startTime = new Date(new Date().setHours(0, 0, 0));
        }
        if (!endDate) {
            endDate = new Date();
        }
        if (!endTime) {
            endTime = new Date(new Date().setHours(11, 59, 59));
        }
        const startDateTime = `${startDate?.getFullYear()}-${
            startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)
        }-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()}T${
            startTime?.getHours() > 9 ? startTime?.getHours() : "0" + startTime?.getHours()
        }:${startTime?.getMinutes() > 9 ? startTime?.getMinutes() : "0" + startTime?.getMinutes()}:${
            startTime?.getSeconds() > 9 ? startTime?.getSeconds() : "0" + startTime?.getSeconds()
        }Z`;
        const endDateTime = `${endDate?.getFullYear()}-${
            endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)
        }-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()}T${
            endTime?.getHours() > 9 ? endTime?.getHours() : "0" + endTime?.getHours()
        }:${endTime?.getMinutes() > 9 ? endTime?.getMinutes() : "0" + endTime?.getMinutes()}:${
            endTime?.getSeconds() > 9 ? endTime?.getSeconds() : "0" + endTime?.getSeconds()
        }Z`;
        return {
            startDateTime,
            endDateTime,
        };
    };

    const errorsHandle = () => {
        let errors = [];
        // setAllocationInfoError();
        allocationInfo?.forEach((item) => {
            Object.entries(item)?.forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        errors = [
                            ...errors,
                            { currency: item?.currency, field: key, message: `${key} is required` },
                        ];
                    }
                } else {
                    if (value === "") {
                        errors = [
                            ...errors,
                            { currency: item?.currency, field: key, message: `${key} is required` },
                        ];
                    }
                }
            });
            setAllocationInfoError(errors);
        });
        setAllocationInfoError(errors);
        // if (bonusDetails) {
        return errors?.length > 0 ? errors : false;
        // }
    };

    const handleSubmit = async (values) => {
        // setAllocationInfoError([]);
        setErrorMessage("");
        if (promoCodes) {
            if (!values.allocationType) {
                setErrorMessage("Allocation type is required");
                return;
            }
            if (!values?.bonusDataType) {
                setErrorMessage("Bonus Data Type is required");
                return;
            }
            if (translation?.length === 0) {
                setErrorMessage("Translation information is required");
                return;
            } else {
                if (translation[0]?.title === "" || translation[0]?.description === "") {
                    setErrorMessage("Translation information is required");
                    return;
                }
            }
            if (bonusDetails) {
                if (values.allocationType === "deposits") {
                    const isError = errorsHandle();
                    if (isError) {
                        return;
                    }
                }
            }
            let payload;

            payload = {
                internalName: values?.internalName,
                startDate: gettingDates()?.startDateTime,
                endDate: gettingDates()?.endDateTime,
                currenciesList: values?.currenciesList?.map((item) => item.value),
                status: values?.status === "no" ? false : true,
                bonusType: values?.bonusType,
                // promoCodes: promoCodes?.map((i) => {
                //     return { code: i?.code?.toUpperCase(), tag: i?.tag };
                // }),
                code: promoCodes[0]?.code?.toUpperCase(),
                allocationType: values?.allocationType,
                bonusDataType: values?.bonusDataType,
                bonusData: values?.bonusDataType === "fixedBonus" ? fixedBonusInfo : depositPercentageInfo,
                rolloverData: {
                    rolloverMultiplier: values?.rolloverMultiplier,
                    daysToComplete: values?.daysToComplete,
                },
                // rolloverType: values?.rolloverType === "no" ? false : true,
                timezone: values?.timezone,
                translationArr: translation,
            };

            // if (values?.rolloverType === true) {
            //     payload = {
            //         ...payload,
            //         rolloverData: {
            //             rolloverMultiplier: values?.rolloverMultiplier,
            //             daysToComplete: values?.daysToComplete,
            //         },
            //     };
            // }
            if (values?.allocationType === "deposits") {
                payload = {
                    ...payload,
                    allocationInfo: allocationInfo,
                };
            }
            if (bonusDetails) {
                payload = {
                    ...payload,
                    campaignId: bonusDetails.id,
                };
            }
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                    `remoteId=${JSON.parse(localStorage.getItem("User"))?.userId}`
            );
            setLoading(true);
            const url = bonusDetails
                ? `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/update-campaign?token=${
                      process.env.NEXT_PUBLIC_TOKEN
                  }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                      JSON.parse(localStorage.getItem("User"))?.userId
                  }`
                : `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/create-campaign?token=${
                      process.env.NEXT_PUBLIC_TOKEN
                  }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                      JSON.parse(localStorage.getItem("User"))?.userId
                  }`;
            await axios
                .post(url, payload)
                .then((response) => {
                    if (response.data?.status === 200) {
                        setSuccessMessage(`Campaign ${bonusDetails ? "updated" : "published"} successfully`);
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
        }
    };

    return (
        <>
            <AdminLayout>
                <div className="create_rewards_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {bonusDetails
                                            ? adminLanguageData?.bonus_campaign_edit_page
                                                  ?.bonus_campaign_edit_page?.value
                                            : adminLanguageData?.bonus_campaign_create_page
                                                  ?.bonus_campaign_create_page_title?.value}
                                    </Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {!isNotAccessible ? (
                        <Col lg={12}>
                            <div className="use_main_form">
                                <p className="error-msg" style={{ display: "block" }}>
                                    {
                                        adminLanguageData?.common_restriction_message
                                            ?.page_not_accessible_message?.value
                                    }
                                </p>
                            </div>
                        </Col>
                    ) : (
                        <>
                            <FormProvider {...methods}>
                                <form
                                    method="POST"
                                    className="create_rewards_form"
                                    onSubmit={methods.handleSubmit(handleSubmit)}>
                                    <Row>
                                        <Col md={9}>
                                            <div className="create_rewards_box mb-3">
                                                <Row>
                                                    <Col md={6}>
                                                        <div className="create_rewards_form_title">
                                                            <h5 className="h5_title">
                                                                {
                                                                    adminLanguageData
                                                                        ?.bonus_campaign_create_page
                                                                        ?.bonus_campaign_create_campaign_details_title
                                                                        ?.value
                                                                }
                                                            </h5>
                                                        </div>
                                                    </Col>
                                                    <Col md={6} className="text-lg-end">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                router.push("/admin/bonus-system/campaigns")
                                                            }
                                                            className="sec_btn">
                                                            {
                                                                adminLanguageData?.bonus_campaign_create_page
                                                                    ?.bonus_campaign_create_go_list_button
                                                                    ?.value
                                                            }
                                                            <i className="fal fa-list"></i>
                                                        </button>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <InternalNameContainer methods={methods} />
                                                    </Col>
                                                    <Col md={6}>
                                                        <BonusTypeContainer
                                                            methods={methods}
                                                            bonusDetails={bonusDetails}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={6}>
                                                        <CurrencyContainer
                                                            methods={methods}
                                                            setFetchCurrency={setFetchCurrency}
                                                            bonusDetails={bonusDetails}
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <StatusContainer methods={methods} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={3}>
                                                        <div className="form_input_wp">
                                                            <StartDateContainer
                                                                methods={methods}
                                                                isBonus={true}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="form_input_wp">
                                                            <StartTimeContainer
                                                                methods={methods}
                                                                isBonus={true}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="form_input_wp">
                                                            <EndDateContainer
                                                                methods={methods}
                                                                isBonus={true}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="form_input_wp">
                                                            <EndTimeContainer
                                                                methods={methods}
                                                                isBonus={true}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="create_rewards_box create_rewards_promo mb-3">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.bonus_campaign_create_page
                                                                ?.bonus_campaign_create_promo_code_title
                                                                ?.value
                                                        }
                                                    </h5>
                                                </div>
                                                <Row>
                                                    <Col md={12}>
                                                        <PromoCodeContainer
                                                            setPromoCodes={setPromoCodes}
                                                            isSubmitted={isSubmitted}
                                                            isSubmitClick={isSubmitClick}
                                                            bonusDetails={bonusDetails}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="create_rewards_box mb-3">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.bonus_campaign_create_page
                                                                ?.bonus_campaign_create_allocation_criteria_title
                                                                ?.value
                                                        }
                                                    </h5>
                                                </div>
                                                <Row>
                                                    <Col md={12}>
                                                        <AllocationCriteria
                                                            methods={methods}
                                                            setInfo={setAllocationInfo}
                                                            fetchCurrency={fetchCurrency}
                                                            isSubmitted={isSubmitted}
                                                            isSubmitClick={isSubmitClick}
                                                            bonusDetails={bonusDetails}
                                                            errorsHandle={errorsHandle}
                                                            allocationInfoError={allocationInfoError}
                                                            setAllocationInfoError={setAllocationInfoError}
                                                            setShowDepositPercentage={
                                                                setShowDepositPercentage
                                                            }
                                                            setFixedBonusDisplay={setFixedBonusDisplay}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="create_rewards_box mb-3">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.bonus_campaign_create_page
                                                                ?.bonus_campaign_create_bonus_data_title
                                                                ?.value
                                                        }
                                                    </h5>
                                                </div>
                                                <Row>
                                                    <Col md={12}>
                                                        <BonusDataContainer
                                                            methods={methods}
                                                            allocationType={methods.getValues(
                                                                "allocationType"
                                                            )}
                                                            setFixedBonusInfo={setFixedBonusInfo}
                                                            fetchCurrency={fetchCurrency}
                                                            isSubmitted={isSubmitted}
                                                            isSubmitClick={isSubmitClick}
                                                            setDepositPercentageInfo={
                                                                setDepositPercentageInfo
                                                            }
                                                            bonusDetails={bonusDetails}
                                                            showDepositPercentage={showDepositPercentage}
                                                            setShowDepositPercentage={
                                                                setShowDepositPercentage
                                                            }
                                                            fixedBonusDisplay={fixedBonusDisplay}
                                                            setFixedBonusDisplay={setFixedBonusDisplay}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="create_rewards_box mb-3 create_rewards_rollovers">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.bonus_campaign_create_page
                                                                ?.bonus_campaign_create_rollovers_data_title
                                                                ?.value
                                                        }
                                                    </h5>
                                                </div>
                                                <Row>
                                                    <Col md={12}>
                                                        <RolloversDataContainer
                                                            methods={methods}
                                                            bonusDetails={bonusDetails}
                                                        />
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className="create_rewards_box mb-3">
                                                {errorMessage && (
                                                    <p className="player-bet-loss">{errorMessage}</p>
                                                )}
                                                {successMessage ? (
                                                    <div
                                                        className="error-msg player-bet-won mt_20"
                                                        style={{ display: successMessage && "block" }}>
                                                        {successMessage}
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            type="submit"
                                                            className="sec_btn"
                                                            onClick={() => {
                                                                setIsSubmitClick((prev) => !prev);
                                                                setIsSubmitted(true);
                                                            }}>
                                                            <i className="far fa-upload"></i> &nbsp;&nbsp;
                                                            {bonusDetails
                                                                ? adminLanguageData?.bonus_campaign_edit_page
                                                                      ?.bonus_campaign_edit_button?.value
                                                                : adminLanguageData
                                                                      ?.bonus_campaign_create_page
                                                                      ?.bonus_campaign_create_publish_campaign_button
                                                                      ?.value}
                                                        </button>
                                                        <span
                                                            className="load-more"
                                                            style={{
                                                                display: loading ? "inline-block" : "none",
                                                            }}>
                                                            <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={3}>
                                            <TimezoneContainer
                                                methods={methods}
                                                bonusDetails={bonusDetails}
                                            />

                                            <div className="create_rewards_box create_rewards_translation mb-3">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.bonus_campaign_create_page
                                                                ?.bonus_campaign_create_translations_title
                                                                ?.value
                                                        }
                                                    </h5>
                                                </div>

                                                <div className="create_rewards_translation_box_wrapper">
                                                    <div className="create_rewards_translation_box">
                                                        <span>
                                                            <Image
                                                                src={EN}
                                                                alt="English"
                                                                height={40}
                                                                width={30}
                                                            />
                                                            {
                                                                adminLanguageData?.bonus_campaign_create_page
                                                                    ?.bonus_campaign_create_english_translation
                                                                    ?.value
                                                            }
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="sec_btn sm_btn"
                                                            onClick={() => {
                                                                setLanguage("en");
                                                                setShow(true);
                                                            }}>
                                                            {translation?.find(
                                                                (item) => item.language === "en"
                                                            )?.title ||
                                                            translation?.find(
                                                                (item) => item.language === "en"
                                                            )?.description ? (
                                                                <>
                                                                    Edit <i className="fal fa-pencil"></i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Add <i className="far fa-plus-circle"></i>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                    <div className="create_rewards_translation_box">
                                                        <span>
                                                            <Image
                                                                src={JA}
                                                                alt="Japanese"
                                                                height={40}
                                                                width={30}
                                                            />
                                                            {
                                                                adminLanguageData?.bonus_campaign_create_page
                                                                    ?.bonus_campaign_create_japanese_translation
                                                                    ?.value
                                                            }
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="sec_btn sm_btn"
                                                            onClick={() => {
                                                                setLanguage("ja");
                                                                setShow(true);
                                                            }}>
                                                            {translation?.find(
                                                                (item) => item.language === "ja"
                                                            )?.title ||
                                                            translation?.find(
                                                                (item) => item.language === "ja"
                                                            )?.description ? (
                                                                <>
                                                                    {
                                                                        adminLanguageData
                                                                            ?.bonus_campaign_create_page
                                                                            ?.bonus_campaign_create_translation_edit_button
                                                                            ?.value
                                                                    }
                                                                    <i className="fal fa-pencil"></i>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    {
                                                                        adminLanguageData
                                                                            ?.bonus_campaign_create_page
                                                                            ?.bonus_campaign_create_translation_add_button
                                                                            ?.value
                                                                    }
                                                                    <i className="far fa-plus-circle"></i>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                <BonusTranslationModal
                                                    show={show}
                                                    setShow={setShow}
                                                    language={language}
                                                    setTranslation={setTranslation}
                                                    translation={translation}
                                                    translationData={translationData?.find(
                                                        (item) => item?.language === language
                                                    )}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </FormProvider>
                        </>
                    )}
                </div>
            </AdminLayout>
        </>
    );
};

export default AddEditBonus;
