/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";
import Image from "next/image";
import sha1 from "sha1";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import { BalanceState } from "@/context/BalanceProvider";
import Head from "next/head";
import verifiedImage from "@/frontend/images/successfully_icon.svg";
import FrontLayout from "@/components/frontend/FrontLayout";
import NextTooltip from "@/components/admin/UI/NextTooltip";

const Checkout = (props) => {
    const router = useRouter();
    const { fetchBalance, setFetchBalance } = BalanceState();
    const [checkData, setCheckData] = useState();
    const [isCopy, setIsCopy] = useState(false);
    const [loading, setIsLoading] = useState(true);
    const { languageData } = LanguageState();
    const [errorMessage, setErrorMessage] = useState("");

    let intervalId;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        checkout();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        intervalId = setInterval(() => {
            checkout();
        }, 30000);
    }, []);

    const checkout = async () => {
        const userData = JSON.parse(localStorage.getItem("User"));
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const txnId = urlParams.get("txnId");
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userData?.remoteId}&txnId=${txnId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/txn-by-id?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${userData?.remoteId}&txnId=${txnId}&authKey=${authkey}`
            )
            .then((response) => {
                if (response?.data?.status === "approved") {
                    clearInterval(intervalId);
                    setFetchBalance(!fetchBalance);
                } else {
                    setErrorMessage(response.data?.message);
                }
                setCheckData(response?.data);
                setIsLoading(false);
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            });
    };

    const handleCopy = async (event, copyValue) => {
        if ("clipboard" in navigator) {
            setIsCopy(true);
            return await navigator.clipboard.writeText(copyValue);
        } else {
            setIsCopy(false);
            return document.execCommand("copy", true, text);
        }
    };
    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <div className="inner-page-text">
                    <section className="checkout_section">
                        <Container>
                            <Row className="m-auto justify-content-center">
                                <Col lg={8}>
                                    <h2 className="h2_title text_center mb_10">
                                        {languageData?.checkout_page?.checkout_page_title?.value}
                                    </h2>
                                    {checkData?.withdrawMethod === "bankTransfer" && (
                                        <p className="text_center">
                                            {" "}
                                            {languageData?.checkout_page
                                                ?.payment_method_bank_transfer_method_message?.value ||
                                                "Please send money to the below account in Bank Details"}
                                        </p>
                                    )}

                                    <p
                                        className="error-msg text_center"
                                        style={{ display: errorMessage ? "block" : "none" }}>
                                        {errorMessage}
                                    </p>

                                    {loading ? (
                                        <>
                                            <span
                                                className="load-more"
                                                style={{
                                                    display: loading ? "block" : "none",
                                                    textAlign: "center",
                                                    margin: 0,
                                                    fontSize: "25px",
                                                }}>
                                                <i className="fad fa-spinner-third fa-spin"></i>
                                            </span>
                                        </>
                                    ) : (
                                        !errorMessage && (
                                            <>
                                                <div className="checkout_sec_box">
                                                    {checkData?.status === "approved" ? (
                                                        <>
                                                            <div className="checkout_qr">
                                                                <Image
                                                                    width={75}
                                                                    loading="lazy"
                                                                    height={75}
                                                                    src={verifiedImage}
                                                                    alt="Verified"
                                                                />
                                                            </div>
                                                            <div className="ca_details_box">
                                                                <div className="ca_details_text">
                                                                    <h5
                                                                        dangerouslySetInnerHTML={{
                                                                            __html: languageData
                                                                                ?.checkout_page
                                                                                ?.checkout_success_msg?.value,
                                                                        }}></h5>
                                                                    <h3>
                                                                        {renderAmountWithCurrency(
                                                                            checkData?.amount,
                                                                            checkData?.currency
                                                                        )}
                                                                    </h3>{" "}
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {checkData?.withdrawMethod === "bankTransfer" && (
                                                                <div className="active_bonus_content">
                                                                    <ul>
                                                                        <li>
                                                                            <h4>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_order_details
                                                                                        ?.value
                                                                                }
                                                                            </h4>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {" "}
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_transaction_id
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>{checkData?.txnId}</b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_amount
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {renderAmountWithCurrency(
                                                                                    checkData?.amount
                                                                                )}
                                                                            </b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_currency
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>{checkData?.currency}</b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_payment_method
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>{checkData?.withdrawMethod}</b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_common_iban
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>{checkData?.bankInfo?.IBAN}</b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_common_switft_orbic
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.switftORbic
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                    </ul>

                                                                    <ul>
                                                                        <li>
                                                                            <h4>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_bank_details
                                                                                        ?.value
                                                                                }
                                                                            </h4>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_bank_name
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.bankName
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_account_name
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.accountName
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_account_number
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.accountNumber
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {" "}
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_routing_number
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.routingNumber
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {" "}
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_common_iban
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>{checkData?.bankInfo?.IBAN}</b>
                                                                        </li>
                                                                        <li>
                                                                            <label>
                                                                                {" "}
                                                                                {
                                                                                    languageData
                                                                                        ?.checkout_page
                                                                                        ?.payment_method_bank_transfer_method_common_switft_orbic
                                                                                        ?.value
                                                                                }
                                                                            </label>
                                                                            <b>
                                                                                {
                                                                                    checkData?.bankInfo
                                                                                        ?.switftORbic
                                                                                }
                                                                            </b>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                            {checkData?.withdrawMethod === "crypto" ||
                                                                (checkData?.withdrawMethod !==
                                                                    "bankTransfer" && (
                                                                    <>
                                                                        <div className="checkout_qr">
                                                                            {loading ? (
                                                                                <>
                                                                                    <span
                                                                                        className="load-more"
                                                                                        style={{
                                                                                            display: loading
                                                                                                ? "inline-block"
                                                                                                : "none",
                                                                                        }}>
                                                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                                                    </span>
                                                                                </>
                                                                            ) : (
                                                                                <Image
                                                                                    src={`data:image/png;base64,${checkData?.qrCodeInfo?.qr_code}`}
                                                                                    loading="lazy"
                                                                                    width={250}
                                                                                    height={250}
                                                                                    alt="qr code"
                                                                                />
                                                                            )}
                                                                        </div>
                                                                        <div className="ca_details_box">
                                                                            <div className="ca_details_text">
                                                                                {loading ? (
                                                                                    <span
                                                                                        className="load-more"
                                                                                        style={{
                                                                                            display: loading
                                                                                                ? "inline-block"
                                                                                                : "none",
                                                                                        }}>
                                                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                                                    </span>
                                                                                ) : (
                                                                                    <>
                                                                                        {
                                                                                            languageData
                                                                                                ?.checkout_page
                                                                                                ?.checkout_amount
                                                                                                ?.value
                                                                                        }
                                                                                        <NextTooltip
                                                                                            title={
                                                                                                checkData?.coinPrice
                                                                                            }>
                                                                                            <button
                                                                                                className="ca_details_copy"
                                                                                                onClick={(
                                                                                                    event
                                                                                                ) =>
                                                                                                    handleCopy(
                                                                                                        event,
                                                                                                        `${checkData?.coinPrice}${checkData?.coin}`
                                                                                                    )
                                                                                                }>
                                                                                                <b className="ca_value">
                                                                                                    {
                                                                                                        checkData?.coinPrice
                                                                                                    }
                                                                                                </b>
                                                                                                <b>
                                                                                                    {
                                                                                                        checkData?.coin
                                                                                                    }
                                                                                                </b>
                                                                                            </button>
                                                                                        </NextTooltip>
                                                                                        <strong>
                                                                                            <span className="ca_fiat_total">
                                                                                                {renderAmountWithCurrency(
                                                                                                    checkData?.amount
                                                                                                )}
                                                                                            </span>
                                                                                        </strong>
                                                                                    </>
                                                                                )}
                                                                            </div>

                                                                            <div
                                                                                className="ca_payment_notification ca_notification_payment_received"
                                                                                dangerouslySetInnerHTML={{
                                                                                    __html: HrefLocalReplace(
                                                                                        languageData
                                                                                            ?.checkout_page
                                                                                            ?.checkout_page_payment_send_content
                                                                                            ?.value
                                                                                    ),
                                                                                }}></div>

                                                                            <div className="ca_details_input">
                                                                                <div className="ca_loader">
                                                                                    <i className="far fa-circle-notch fa-spin"></i>
                                                                                </div>

                                                                                {loading ? (
                                                                                    <>
                                                                                        <span
                                                                                            className="load-more"
                                                                                            style={{
                                                                                                display:
                                                                                                    loading
                                                                                                        ? "inline-block"
                                                                                                        : "none",
                                                                                            }}>
                                                                                            <i className="fad fa-spinner-third fa-spin"></i>
                                                                                        </span>
                                                                                    </>
                                                                                ) : (
                                                                                    <span>
                                                                                        {checkData?.address}
                                                                                    </span>
                                                                                )}

                                                                                <NextTooltip
                                                                                    title={
                                                                                        isCopy
                                                                                            ? languageData
                                                                                                  ?.checkout_page
                                                                                                  ?.copied_tooltip
                                                                                                  ?.value
                                                                                            : languageData
                                                                                                  ?.checkout_page
                                                                                                  ?.copy_tooltip
                                                                                                  ?.value
                                                                                    }>
                                                                                    <button
                                                                                        className="ca_details_input_copy"
                                                                                        onClick={(event) =>
                                                                                            handleCopy(
                                                                                                event,
                                                                                                checkData?.address
                                                                                            )
                                                                                        }>
                                                                                        <i className="fas fa-copy"></i>
                                                                                    </button>
                                                                                </NextTooltip>
                                                                            </div>
                                                                        </div>
                                                                    </>
                                                                ))}
                                                        </>
                                                    )}
                                                </div>

                                                <div className="ca_progress">
                                                    <div className={`ca_progress_icon waiting_payment done`}>
                                                        <svg
                                                            width="60"
                                                            height="60"
                                                            viewBox="0 0 50 50"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M49.2188 25C49.2188 38.3789 38.3789 49.2188 25 49.2188C11.6211 49.2188 0.78125 38.3789 0.78125 25C0.78125 11.6211 11.6211 0.78125 25 0.78125C38.3789 0.78125 49.2188 11.6211 49.2188 25ZM35.1953 22.1777L28.125 29.5508V11.7188C28.125 10.4199 27.0801 9.375 25.7812 9.375H24.2188C22.9199 9.375 21.875 10.4199 21.875 11.7188V29.5508L14.8047 22.1777C13.8965 21.2305 12.3828 21.2109 11.4551 22.1387L10.3906 23.2129C9.47266 24.1309 9.47266 25.6152 10.3906 26.5234L23.3398 39.4824C24.2578 40.4004 25.7422 40.4004 26.6504 39.4824L39.6094 26.5234C40.5273 25.6055 40.5273 24.1211 39.6094 23.2129L38.5449 22.1387C37.6172 21.2109 36.1035 21.2305 35.1953 22.1777V22.1777Z"
                                                                fill="#7c8496"></path>
                                                        </svg>

                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: HrefLocalReplace(
                                                                    languageData?.checkout_page
                                                                        ?.checkout_page_payment_process_step_one
                                                                        ?.value
                                                                ),
                                                            }}></p>
                                                    </div>
                                                    {checkData?.withdrawMethod !== "bankTransfer" && (
                                                        <div
                                                            className={`ca_progress_icon waiting_network ${
                                                                checkData?.status === "approved" ? "done" : ""
                                                            }`}>
                                                            <svg
                                                                width="60"
                                                                height="60"
                                                                viewBox="0 0 50 50"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg">
                                                                <path
                                                                    d="M46.875 15.625H3.125C1.39912 15.625 0 14.2259 0 12.5V6.25C0 4.52412 1.39912 3.125 3.125 3.125H46.875C48.6009 3.125 50 4.52412 50 6.25V12.5C50 14.2259 48.6009 15.625 46.875 15.625ZM42.1875 7.03125C40.8931 7.03125 39.8438 8.08057 39.8438 9.375C39.8438 10.6694 40.8931 11.7188 42.1875 11.7188C43.4819 11.7188 44.5312 10.6694 44.5312 9.375C44.5312 8.08057 43.4819 7.03125 42.1875 7.03125ZM35.9375 7.03125C34.6431 7.03125 33.5938 8.08057 33.5938 9.375C33.5938 10.6694 34.6431 11.7188 35.9375 11.7188C37.2319 11.7188 38.2812 10.6694 38.2812 9.375C38.2812 8.08057 37.2319 7.03125 35.9375 7.03125ZM46.875 31.25H3.125C1.39912 31.25 0 29.8509 0 28.125V21.875C0 20.1491 1.39912 18.75 3.125 18.75H46.875C48.6009 18.75 50 20.1491 50 21.875V28.125C50 29.8509 48.6009 31.25 46.875 31.25ZM42.1875 22.6562C40.8931 22.6562 39.8438 23.7056 39.8438 25C39.8438 26.2944 40.8931 27.3438 42.1875 27.3438C43.4819 27.3438 44.5312 26.2944 44.5312 25C44.5312 23.7056 43.4819 22.6562 42.1875 22.6562ZM35.9375 22.6562C34.6431 22.6562 33.5938 23.7056 33.5938 25C33.5938 26.2944 34.6431 27.3438 35.9375 27.3438C37.2319 27.3438 38.2812 26.2944 38.2812 25C38.2812 23.7056 37.2319 22.6562 35.9375 22.6562ZM46.875 46.875H3.125C1.39912 46.875 0 45.4759 0 43.75V37.5C0 35.7741 1.39912 34.375 3.125 34.375H46.875C48.6009 34.375 50 35.7741 50 37.5V43.75C50 45.4759 48.6009 46.875 46.875 46.875ZM42.1875 38.2812C40.8931 38.2812 39.8438 39.3306 39.8438 40.625C39.8438 41.9194 40.8931 42.9688 42.1875 42.9688C43.4819 42.9688 44.5312 41.9194 44.5312 40.625C44.5312 39.3306 43.4819 38.2812 42.1875 38.2812ZM35.9375 38.2812C34.6431 38.2812 33.5938 39.3306 33.5938 40.625C33.5938 41.9194 34.6431 42.9688 35.9375 42.9688C37.2319 42.9688 38.2812 41.9194 38.2812 40.625C38.2812 39.3306 37.2319 38.2812 35.9375 38.2812Z"
                                                                    fill="#7c8496"></path>
                                                            </svg>
                                                            <p
                                                                dangerouslySetInnerHTML={{
                                                                    __html: HrefLocalReplace(
                                                                        languageData?.checkout_page
                                                                            ?.checkout_page_payment_process_step_two
                                                                            ?.value
                                                                    ),
                                                                }}></p>
                                                        </div>
                                                    )}
                                                    <div
                                                        className={`ca_progress_icon payment_done ${
                                                            checkData?.status === "approved" ? "done" : ""
                                                        }`}>
                                                        <svg
                                                            width="60"
                                                            height="60"
                                                            viewBox="0 0 50 50"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg">
                                                            <path
                                                                d="M45.0391 12.5H7.8125C6.94922 12.5 6.25 11.8008 6.25 10.9375C6.25 10.0742 6.94922 9.375 7.8125 9.375H45.3125C46.1758 9.375 46.875 8.67578 46.875 7.8125C46.875 5.22363 44.7764 3.125 42.1875 3.125H6.25C2.79785 3.125 0 5.92285 0 9.375V40.625C0 44.0771 2.79785 46.875 6.25 46.875H45.0391C47.7754 46.875 50 44.7725 50 42.1875V17.1875C50 14.6025 47.7754 12.5 45.0391 12.5ZM40.625 32.8125C38.8994 32.8125 37.5 31.4131 37.5 29.6875C37.5 27.9619 38.8994 26.5625 40.625 26.5625C42.3506 26.5625 43.75 27.9619 43.75 29.6875C43.75 31.4131 42.3506 32.8125 40.625 32.8125Z"
                                                                fill="#7c8496"></path>
                                                        </svg>
                                                        <p
                                                            dangerouslySetInnerHTML={{
                                                                __html: HrefLocalReplace(
                                                                    languageData?.checkout_page
                                                                        ?.checkout_page_payment_process_step_three
                                                                        ?.value
                                                                ),
                                                            }}></p>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </div>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Deposit checkout",
            description: "Deposit checkout",
        },
    };
}

export default Checkout;
