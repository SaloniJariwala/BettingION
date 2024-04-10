/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncSelect from "react-select/async";
import sha1 from "sha1";
import Modal from "react-bootstrap/Modal";
import Button from "@/components/frontend/UI/Button";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import CodeInput from "@/components/frontend/CodeInput";
import AccountSidebar from "@/components/frontend/account/AccountSideBar";

const Deposit = () => {
    const { fetchBalance, setFetchBalance, balance, userDefaultCurrency } = BalanceState();
    const [selectedOption, setSelectedOption] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [input, setInput] = useState("");
    // const [balance, setBalance] = useState();
    const [amount, setAmount] = useState("");
    const [transferLoading, setTransferLoading] = useState(false);
    const [show, setShow] = useState(false);
    // const [fetchAgain, setFetchAgain] = useState(false);
    const [isUnverified, setIsUnverified] = useState(false);
    const [isCancelled, setIsCancelled] = useState(false);
    const [runningRequest, setRunningRequest] = useState(false);
    const [otp, setOtp] = useState("");
    const { languageData } = LanguageState();
    const [fundTransfer, setFundTransfer] = useState(false);
    const [isEnableTransefer2Fa, setIsEnableTransefer2Fa] = useState(false);
    const [transactionId, setTransactionId] = useState();

    useEffect(() => {
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transactions?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&status=unverified&authKey=${authKey}&txnType=transfer`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.length > 0) {
                        setIsUnverified(true);
                        setAmount(response.data?.data[0]?.amount);
                        setTransactionId(response.data?.data[0]?.transactionID);
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, [isCancelled, isUnverified]);

    const loadOptions = async (input) => {
        let res;
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/all-users?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&username=${input}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    res = response.data?.data?.map((option) => ({
                        label: `${option.username} (${option.email})`,
                        value: option.remoteId,
                    }));
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
        return res;
    };

    const handleInputChange = (newValue) => {
        setInput(newValue);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleClose = () => {
        setShow(false);
        setSelectedOption(null);
        setAmount("");
        setInput("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        if (!selectedOption) {
            setErrorMessage(languageData?.transfer_page?.search_select_username?.value);
            return;
        }
        if (!amount) {
            setErrorMessage("Please enter amount to be transferred");
            return;
        } else {
            if (amount > balance) {
                setErrorMessage("Entered amount is greater than current wallet amount.");
                return;
            }
        }

        const authkeyDeposit = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&authKey=${authkeyDeposit}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (
                        response?.data?.data?.isEnabled2fa &&
                        response?.data?.data?.auth2FAmodule?.transferFund
                    ) {
                        setIsEnableTransefer2Fa(true);
                    } else {
                        setFundTransfer((prev) => !prev);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const transferFundsRequest = async () => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `action=debit&remote_id=${selectedOption?.value}&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&currency=${userDefaultCurrency?.currencyAbrv}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&amount=${amount}&sender_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );

        setTransferLoading(true);
        await axios
            .get(
                `${
                    process.env.NEXT_PUBLIC_API_DOMAIN
                }/players/transfer-funds-request?action=debit&remote_id=${selectedOption?.value}&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&currency=${userDefaultCurrency?.currencyAbrv}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&amount=${amount}&sender_id=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&status=transfer-funds-between-accounts&txnAction=debitAndCredit`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    // setFetchAgain(!fetchAgain);
                    setFetchBalance(!fetchBalance);
                    setIsUnverified(true);
                    setErrorMessage("");
                    setSuccessMessage("");
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setTransferLoading(false);
                setRunningRequest(false);
            });
    };

    const handleOtpVerify = async (event, flag) => {
        if (flag === "verify") {
            event.preventDefault();
        }
        setErrorMessage("");
        setSuccessMessage("");
        const payload = {
            remoteId: JSON.parse(localStorage.getItem("User"))?.remoteId,
            transactionId: transactionId,
            otpCode: otp || "",
            action: flag,
        };
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&transactionId=${transactionId}&action=${flag}`
        );
        setRunningRequest(true);
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transfer-verify-otp?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    setFetchBalance(!fetchBalance);
                    setTimeout(() => {
                        if (flag === "verify") {
                            setIsUnverified(false);
                            setShow(true);
                        } else {
                            setIsCancelled(true);
                            setIsUnverified(false);
                            setAmount("");
                            setSuccessMessage("");
                        }
                        setOtp("");
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

    useEffect(() => {
        if (selectedOption && amount) {
            transferFundsRequest();
        }
    }, [fundTransfer]);

    return (
        <>
            <AccountSidebar>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: languageData?.transfer_page?.transfer_page_balance_title?.value,
                    }}></h2>

                <hr />
                {isEnableTransefer2Fa ? (
                    <div className="login_verification edit_account_security">
                        <CodeInput
                            setIsEnableTransefer2Fa={setIsEnableTransefer2Fa}
                            setFundTransfer={setFundTransfer}
                        />
                    </div>
                ) : (
                    <>
                        {!isUnverified && (
                            <form method="post" onSubmit={handleSubmit}>
                                <div className="woo-wallet-add-amount">
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                languageData?.transfer_page?.transfer_username_input_label
                                                    ?.value
                                            }
                                        </label>

                                        <AsyncSelect
                                            className="select_box"
                                            classNamePrefix="react-select"
                                            cacheOptions
                                            inputValue={input}
                                            loadOptions={loadOptions}
                                            onInputChange={handleInputChange}
                                            isLoading={loading}
                                            labelKey="label"
                                            valueKey="value"
                                            placeholder={
                                                languageData?.transfer_page
                                                    ?.transfer_username_input_placeholder?.value
                                            }
                                            onChange={handleSelectChange}
                                            value={selectedOption}
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: "#e150e7",
                                                    primary25: "#e150e7",
                                                    neutral0: "#161a23",
                                                },
                                            })}
                                        />
                                    </div>

                                    <div className="form_input_wp">
                                        <label htmlFor="wallet_balance_to_add">
                                            {languageData?.transfer_page?.transfer_amount_input_label?.value}
                                        </label>

                                        <div className="currency_input mb-0">
                                            <span className="wallet_input_group_addon">
                                                {userDefaultCurrency?.currencyAbrv}
                                            </span>

                                            <input
                                                type="number"
                                                step="any"
                                                min="0"
                                                className="form_input"
                                                id="wallet_balance_to_add"
                                                value={amount ?? amount}
                                                onChange={(event) => setAmount(event.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <p
                                        className="error-msg mb-2"
                                        style={{ display: errorMessage ? "block" : "none" }}>
                                        {errorMessage}
                                    </p>

                                    <div className="woo_add_btn">
                                        <Button type="submit">
                                            {languageData?.transfer_page?.transfer_form_button?.value}
                                        </Button>
                                        <span
                                            className="load-more"
                                            style={{
                                                display: transferLoading ? "inline-block" : "none",
                                            }}>
                                            <i className="fad fa-spinner-third fa-spin"></i>
                                        </span>
                                    </div>
                                </div>
                            </form>
                        )}

                        {isUnverified && (
                            <>
                                <form
                                    onSubmit={(event) => {
                                        handleOtpVerify(event, "verify");
                                        setRunningRequest(true);
                                    }}>
                                    <h5>
                                        Amount:{" "}
                                        {renderAmountWithCurrency(amount, userDefaultCurrency?.currencyAbrv)}
                                    </h5>
                                    <div className="woo-wallet-add-amount">
                                        <label htmlFor="withdrawal-request-verification">
                                            Transfer Request OTP Verification
                                        </label>
                                        <input
                                            type="text"
                                            name="withdrawal-request-verification"
                                            id="withdrawal-request-verification"
                                            className="form_input"
                                            onChange={(event) => setOtp(event.target.value)}
                                            value={otp ?? ""}
                                        />
                                    </div>

                                    <div className="button_group mt_20" style={{ alignItems: "center" }}>
                                        <Button type="submit" disabled={runningRequest}>
                                            {
                                                languageData?.withdrawal_request_page
                                                    ?.withdrawal_request_form_verify_button?.value
                                            }
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={(event) => handleOtpVerify(event, "cancel")}
                                            disabled={runningRequest}>
                                            {
                                                languageData?.withdrawal_request_page
                                                    ?.withdrawal_request_form_cancel_button?.value
                                            }
                                        </Button>
                                        <span
                                            className="load-more"
                                            style={{ display: loading ? "inline-block" : "none" }}>
                                            <i className="fad fa-spinner-third fa-spin"></i>
                                        </span>
                                    </div>
                                </form>
                                <p
                                    className="success-msg"
                                    style={{ display: successMessage ? "block" : "none" }}>
                                    {successMessage}
                                </p>
                                <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                    {errorMessage}
                                </p>
                            </>
                        )}
                    </>
                )}
            </AccountSidebar>

            <Modal show={show}>
                <div
                    className="close_modal_overlay"
                    onClick={() => {
                        setShow(false);
                    }}></div>
                <Modal.Body>
                    <div className="transfer_modal_box">
                        <button type="button" className="close" onClick={handleClose}>
                            <i className="fal fa-times"></i>
                        </button>

                        <h4
                            className="modal-title"
                            dangerouslySetInnerHTML={{
                                __html: languageData?.transfer_page?.success_modal_title?.value,
                            }}></h4>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(
                                    languageData?.transfer_page?.success_modal_content?.value
                                ),
                            }}></p>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Deposit;
