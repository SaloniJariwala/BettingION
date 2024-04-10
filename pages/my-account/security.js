/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import sha1 from "sha1";
import QRCode from "qrcode";
import Button from "@/components/frontend/UI/Button";
import AccountSetting from "@/components/frontend/account/AccountSetting";
import AccountSecurity from "@/components/frontend/account/AccountSecurity";
import SecurityContentStep1 from "@/components/Security/SecurityContentStep1";
import SecurityContentStep2 from "@/components/Security/SecurityContentStep2";
import SecurityContentStep3 from "@/components/Security/SecurityContentStep3";
import SecurityContentStep4 from "@/components/Security/SecurityContentStep4";
import SecurityContentStep5 from "@/components/Security/SecurityContentStep5";
import { LanguageState } from "@/context/FrontLanguageProvider";

const Security = (props) => {
    const [isCopy, setIsCopy] = useState(false);
    const [step, setStep] = useState(1);
    const [finalStep, setFinalStep] = useState(true);
    const [secretKey, setSecretKey] = useState("");
    const [qrcodeUrl, setqrCodeUrl] = useState("");
    const [verifyError, setVerifyError] = useState("");
    const [verifySuccess, setVerifySuccess] = useState("");
    const [verifiedToggle, setVerifiedToggle] = useState(false);
    const [verifiedStatus, setVerifiedStatus] = useState(false);
    const [finalError, setFinalError] = useState("");
    const [finalSuccess, setFinalSuccess] = useState("");
    const [updateError, setUpdateError] = useState("");
    const [moduleStatus, setModuleStatus] = useState({});
    const [loading, setIsLoading] = useState(true);
    const [firstLoad, setFirstLoad] = useState(true);
    const [otp, setOtp] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
        otp5: "",
        otp6: "",
    });
    const { languageData } = LanguageState();

    const updateModule = async (module) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/update-module-status?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}&moduleKey=${module}`
            )
            .then(async (response) => {
                setModuleStatus({ ...moduleStatus, [module]: false });
            })
            .catch((error) => {
                setUpdateError(error?.message);
            });
    };

    const reset2faModules = async () => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.remoteId}`);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.remoteId
                }`
            )
            .then(async (response) => {
                if (response.data?.data?.auth2FAmodule?.login) {
                    await updateModule("login");
                }
                if (response.data?.data?.auth2FAmodule?.changePassword) {
                    await updateModule("changePassword");
                }
                if (response.data?.data?.auth2FAmodule?.withdraw) {
                    await updateModule("withdraw");
                }
                if (response.data?.data?.auth2FAmodule?.deposit) {
                    await updateModule("deposit");
                }
                if (response.data?.data?.auth2FAmodule?.transferFund) {
                    await updateModule("transferFund");
                }
                await handleDisable();
            });
    };

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.remoteId}`);

        if (firstLoad && finalStep) {
            setFirstLoad(false);
            return;
        }

        setFinalSuccess("");
        setFinalError("");
        setIsLoading(true);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.remoteId
                }`
            )
            .then(async (response) => {
                setFinalStep(response.data?.data?.isEnabled_2Fa);
                setModuleStatus(response.data?.data?.auth2FAmodule);
            })
            .catch((error) => {
                setFirstLoad(false);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [finalStep, firstLoad]);

    const verifiedHandle = () => {
        setVerifiedToggle(!verifiedToggle);
    };

    useEffect(() => {
        if (!finalStep) {
            const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);

            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/otp/generate?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                        JSON.parse(localStorage?.getItem("User"))?.userId
                    }`
                )
                .then((response) => {
                    setSecretKey(response.data?.secretKey);
                    QRCode.toString(response.data?.otpAuthUrl, function (err, string) {
                        setqrCodeUrl(string);
                    });
                })
                .catch()
                .finally();
        }
    }, [finalStep]);

    const inputFocus = (element) => {
        if (element.key === "Delete" || element.key === "Backspace") {
            const next = element.target.tabIndex - 2;
            if (next > -1) {
                element.target.form.elements[next].focus();
            }
        } else {
            const next = element.target.tabIndex;
            if (next < 6) {
                if (element.target.value) {
                    element.target.form?.elements[next].focus();
                }
            }
        }
    };

    const handlePaste = (event) => {
        let copyVal = event.clipboardData.getData("text");
        setOtp({
            ...otp,
            otp1: copyVal ? copyVal[0] : "",
            otp2: copyVal ? copyVal[1] : "",
            otp3: copyVal ? copyVal[2] : "",
            otp4: copyVal ? copyVal[3] : "",
            otp5: copyVal ? copyVal[4] : "",
            otp6: copyVal ? copyVal[5] : "",
        });
    };

    useEffect(() => {
        setVerifyError("");
        setVerifySuccess("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        const authToken = `${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`;

        if (!authToken) return;

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/otp/verify?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&authToken=${authToken}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.isVerified2fa) {
                        setVerifySuccess(languageData?.security_page?.security_step_3_successful_message?.value);
                        setVerifiedStatus(true);
                    }
                } else {
                    setVerifyError(response.data?.message);
                }
            })
            .catch((error) => {
                setVerifyError(error?.message);
            })
            .finally();
    }, [verifiedToggle, finalStep]);

    const inputCodeHandler = (event) => {
        event.target.value = event.target.value?.slice(0, 1);
        setOtp({ ...otp, [event.target.name]: event.target.value });
    };

    const handleUpdate = (event, module) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);

        setUpdateError("");
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/update-module-status?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}&moduleKey=${module}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    event.target.checked = response.data?.data?.authModules[module];
                } else {
                    setUpdateError(response.data?.message);
                    event.target.checked = !event.target.checked;
                }
            })
            .catch((error) => {
                setUpdateError(error?.message);
                event.target.checked = !event.target.checked;
            })
            .finally();
    };

    const removeAuthHandler = async () => {
        await reset2faModules();
    };

    const handleDisable = async () => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);
        setFinalError("");
        setFinalSuccess("");
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/otp/disable?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }`
            )
            .then(async (response) => {
                if (response.data?.status === 200) {
                    setFinalSuccess(`Authentication disbaled successfully`);
                    setFinalStep(false);
                    setStep(1);
                    setOtp({
                        otp1: "",
                        otp2: "",
                        otp3: "",
                        otp4: "",
                        otp5: "",
                        otp6: "",
                    });
                    setVerifiedStatus(false);
                } else {
                    setFinalError(response.data?.message);
                }
            })
            .catch((error) => {
                setFinalError(error?.message);
            })
            .finally();
    };

    const handleCopy = async () => {
        if ("clipboard" in navigator) {
            setIsCopy(true);
            return await navigator.clipboard.writeText(secretKey);
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
            <AccountSetting>
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
                ) : finalStep ? (
                    <AccountSecurity finalStep={finalStep}>
                        <div className="security_content_step4 security_final_step">
                            {loading ? (
                                <span
                                    className="load-more"
                                    style={{
                                        display: loading ? "block" : "none",
                                    }}
                                >
                                    <i className="fad fa-spinner-third fa-spin"></i>
                                </span>
                            ) : (
                                <>
                                    <SecurityContentStep4 handleUpdate={handleUpdate} moduleStatus={moduleStatus} updateError={updateError} />

                                    <div className="text_center mt_20">
                                        <Button
                                            type="button"
                                            variant="transparent"
                                            size="sm"
                                            onClick={async () => {
                                                const removeStatus = confirm("Remove Authentication");
                                                if (removeStatus) {
                                                    await removeAuthHandler();
                                                }
                                            }}
                                        >
                                            {languageData?.security_page?.security_step_4_button_title?.value || "Remove Authentication"}
                                        </Button>
                                        <p className="error-msg text_center mt_20">{finalError}</p>
                                        <p className="success-msg text_center mt_20">{finalSuccess}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </AccountSecurity>
                ) : (
                    <>
                        {step === 1 && (
                            <AccountSecurity stepNum={1} setStep={setStep}>
                                <SecurityContentStep1 languageData={languageData} />
                            </AccountSecurity>
                        )}
                        {step === 2 && (
                            <AccountSecurity stepNum={2} setStep={setStep}>
                                <SecurityContentStep2 qrcodeUrl={qrcodeUrl} secretKey={secretKey} isCopy={isCopy} handleCopy={handleCopy} languageData={languageData} />
                            </AccountSecurity>
                        )}
                        {step === 3 && (
                            <AccountSecurity stepNum={3} setStep={setStep}>
                                <SecurityContentStep3
                                    otp={otp}
                                    inputCodeHandler={inputCodeHandler}
                                    inputFocus={inputFocus}
                                    handlePaste={handlePaste}
                                    verifyError={verifyError}
                                    verifySuccess={verifySuccess}
                                    languageData={languageData}
                                />
                            </AccountSecurity>
                        )}
                        {step === 4 && (
                            <AccountSecurity stepNum={4} setStep={setStep} verifiedStatus={verifiedStatus} verifiedHandle={verifiedHandle}>
                                <SecurityContentStep4 handleUpdate={handleUpdate} moduleStatus={moduleStatus} updateError={updateError} languageData={languageData} />
                            </AccountSecurity>
                        )}
                        {step === 5 && (
                            <AccountSecurity stepNum={5} setFinalStep={setFinalStep}>
                                <SecurityContentStep5 languageData={languageData} />
                            </AccountSecurity>
                        )}
                    </>
                )}
            </AccountSetting>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Security",
            description: "Security",
        },
    };
}

export default Security;
