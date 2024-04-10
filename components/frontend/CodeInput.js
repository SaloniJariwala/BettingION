import { BalanceState } from "@/context/BalanceProvider";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import sha1 from "sha1";

const CodeInput = ({
    setIsDepositing,
    setChangePassword,
    setTwoFaEnable,
    setIsEnableTransefer2Fa,
    setFundTransfer,
    setIsWithdrawalEnable2Fa,
    setWithdrawal,
    loginData,
    setIsEnabled,
    setDeposit2Fa,
}) => {
    const router = useRouter();
    const { updateBalance } = BalanceState();
    const [otp, setOtp] = useState({
        otp1: "",
        otp2: "",
        otp3: "",
        otp4: "",
        otp5: "",
        otp6: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const inputCodeHandler = (event) => {
        event.target.value = event.target.value?.slice(0, 1);
        setOtp({ ...otp, [event.target.name]: event.target.value });
    };

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
                    element.target.form.elements[next].focus();
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

    const handleOtpVerify = async (event) => {
        event.preventDefault();
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${
                    router.pathname === "/login"
                        ? loginData?.remoteId
                        : JSON.parse(localStorage.getItem("User"))?.userId
                }`
        );
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/auth/otp/validate?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                    router.pathname === "/login"
                        ? loginData?.remoteId
                        : JSON.parse(localStorage.getItem("User"))?.userId
                }&authToken=${otp.otp1}${otp.otp2}${otp.otp3}${otp.otp4}${otp.otp5}${otp.otp6}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (router.pathname === "/login") {
                        localStorage.setItem("User", JSON.stringify(loginData));
                        localStorage.setItem("currency", JSON.stringify(loginData?.currencyObj));
                        router.push("/");
                        updateBalance();
                    }
                    if (router.pathname === "/my-account/deposit") {
                        setIsDepositing((prev) => !prev);
                    }
                    if (router.pathname === "/my-account/edit-account") {
                        setChangePassword((prev) => !prev);
                        setTwoFaEnable(false);
                    }
                    if (router.pathname === "/my-account/transfer") {
                        setFundTransfer((prev) => !prev);
                        setIsEnableTransefer2Fa(false);
                    }
                    if (router.pathname === "/my-account/wallet-withdrawal") {
                        setWithdrawal((prev) => !prev);
                        setIsWithdrawalEnable2Fa(false);
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCancelClick = () => {
        if (router.pathname === "/login") {
            setIsEnabled(false);
        }
        if (router.pathname === "/my-account/deposit") {
            setDeposit2Fa(false);
        }
        if (router.pathname === "/my-account/edit-account") {
            setChangePassword(false);
            setTwoFaEnable(false);
        }
        if (router.pathname === "/my-account/transfer") {
            setIsEnableTransefer2Fa(false);
        }
        if (router.pathname === "/my-account/wallet-withdrawal") {
            setIsWithdrawalEnable2Fa(false);
        }
    };

    return (
        <div className="security_content_step3">
            <p className="security_authenticator_title">Two-factor authentication</p>
            <p>Enter the six digit code from your authentication app</p>
            <form onSubmit={handleOtpVerify}>
                <div className="security_authenticator_otp">
                    <input
                        type="number"
                        name="otp1"
                        value={otp.otp1}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="1"
                    />
                    <input
                        type="number"
                        name="otp2"
                        value={otp.otp2}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="2"
                    />
                    <input
                        type="number"
                        name="otp3"
                        value={otp.otp3}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="3"
                    />
                    <input
                        type="number"
                        name="otp4"
                        value={otp.otp4}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="4"
                    />
                    <input
                        type="number"
                        name="otp5"
                        value={otp.otp5}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="5"
                    />
                    <input
                        type="number"
                        name="otp6"
                        value={otp.otp6}
                        onChange={inputCodeHandler}
                        className="form_input"
                        onKeyUp={(e) => inputFocus(e)}
                        onPaste={handlePaste}
                        tabIndex="6"
                    />
                </div>
                <p className="error-msg mb_15" style={{ display: errorMessage ? "block" : "none" }}>
                    {errorMessage}
                </p>
                <div className="form_submit">
                    <div className="button_group justify-content-center" style={{ alignItems: "center" }}>
                        <input className="sec_btn" type="submit" value="verify" tabIndex={7} />
                        <input
                            className="sec_btn"
                            type="button"
                            value="Cancel"
                            tabIndex={7}
                            onClick={handleCancelClick}
                        />
                        <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                            <i className="fad fa-spinner-third fa-spin"></i>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CodeInput;
