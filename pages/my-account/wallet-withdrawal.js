/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import AccountWalletSideBar from "@/components/frontend/account/AccountWalletSideBar";
import Button from "@/components/frontend/UI/Button";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { LanguageState } from "@/context/FrontLanguageProvider";
import CodeInput from "@/components/frontend/CodeInput";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const WalletWithdrawal = () => {
    const router = useRouter();
    const { fetchBalance, setFetchBalance, userDefaultCurrency } = BalanceState();
    const [amount, setAmount] = useState();
    const [method, setMethod] = useState("crypto");
    const [transactionId, setTransactionId] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isUnverified, setIsUnverified] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [pendingRequestData, setPendingRequestData] = useState([]);
    const [isCancelled, setIsCancelled] = useState(false);
    const { languageData } = LanguageState();
    const [withdrawal, setWithdrawal] = useState(false);
    const [isWithdrawalEnable2Fa, setIsWithdrawalEnable2Fa] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState();

    useEffect(() => {
        if (typeof localStorage !== "undefined") {
            setLoggedInUser(JSON.parse(localStorage.getItem("User")));
        }
    }, []);

    const cancelledTransactions = () => {
        if (typeof localStorage !== "undefined") {
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            );
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transactions?token=${process.env.NEXT_PUBLIC_TOKEN
                    }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                    }&status=unverified&authKey=${authkey}&txnType=withdraw`
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
        }
    };

    const unverifiedTransactions = () => {
        if (typeof localStorage !== "undefined") {
            if (!isUnverified) {
                const authkey = sha1(
                    process.env.NEXT_PUBLIC_AUTH_KEY +
                    `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
                );
                axios
                    .get(
                        `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transactions?token=${process.env.NEXT_PUBLIC_TOKEN
                        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                        }&status=pending&authKey=${authkey}&txnType=withdraw`
                    )
                    .then((response) => {
                        if (response.data?.status === 200) {
                            if (response.data?.data?.length > 0) {
                                setIsPending(true);
                                setPendingRequestData(response.data?.data);
                            }
                        } else {
                            setErrorMessage(response.data?.message);
                        }
                    })
                    .catch((error) => {
                        setErrorMessage(error.message);
                    });
            }
        }
    };

    useEffect(() => {
        cancelledTransactions();
    }, [isCancelled]);

    useEffect(() => {
        unverifiedTransactions();
    }, [isUnverified]);

    const handleInitialRequest = async (event) => {
        event.preventDefault();
        if (typeof localStorage !== "undefined") {
            setErrorMessage("");
            if (!method) {
                setErrorMessage("Please select a method");
                return;
            }
            if (!amount) {
                setErrorMessage("Please enter amount");
                return;
            }
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            );
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN
                    }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                    }&hide=false&authKey=${authkey}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        if (response?.data?.data?.isEnabled2fa && response?.data?.data?.auth2FAmodule?.withdraw) {
                            setIsWithdrawalEnable2Fa(true);
                        } else {
                            setWithdrawal((prev) => !prev);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleOtpVerify = async (event, flag) => {
        if (flag === "verify") {
            event.preventDefault();
        }
        setErrorMessage("");
        setSuccessMessage("");
        const payload = {
            remoteId: loggedInUser?.remoteId,
            transactionId: transactionId,
            otpCode: otp || "",
            action: flag,
        };
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${loggedInUser?.remoteId
            }&transactionId=${transactionId}&action=${flag}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/withdraw-verify-otp?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    setFetchBalance(!fetchBalance);
                    setTimeout(() => {
                        if (flag === "verify") {
                            setIsPending(true);
                            setIsUnverified(false);
                        } else {
                            setIsCancelled(true);
                            setIsPending(false);
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
        if (amount && userDefaultCurrency) {
            setErrorMessage("");
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&amount=${amount}&withdrawMethod=${method}`
            );
            const payload = {
                remoteId: JSON.parse(localStorage.getItem("User"))?.remoteId,
                amount: amount,
                withdrawMethod: method,
                currency: userDefaultCurrency?.currencyAbrv,
            };
            setLoading(true);
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/withdraw-request-init?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                    payload
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setTransactionId(response.data?.data?.transactionId);
                        setAmount(response.data?.data?.amount);
                        setMethod("crypto");
                        setIsUnverified(true);
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
    }, [withdrawal]);

    return (
        <AccountWalletSideBar>
            <h2
                dangerouslySetInnerHTML={{
                    __html: languageData?.withdrawal_request_page?.withdrawal_request_page_title?.value,
                }}></h2>

            <hr />
            {isWithdrawalEnable2Fa ? (
                <div className="login_verification edit_account_security">
                    <CodeInput
                        setIsWithdrawalEnable2Fa={setIsWithdrawalEnable2Fa}
                        setWithdrawal={setWithdrawal}
                    />
                </div>
            ) : (
                <>
                    {!isUnverified && !isPending && (
                        <form method="post" onSubmit={handleInitialRequest}>
                            <div className="woo-wallet-add-amount">
                                <label htmlFor="woo_wallet_balance_to_add">
                                    {languageData?.withdrawal_request_page?.amount?.value}{" "}
                                </label>

                                <div className="currency_input">
                                    <span className="wallet_input_group_addon">
                                        {userDefaultCurrency?.currencyAbrv}
                                    </span>

                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        className="form_input"
                                        id="woo_wallet_balance_to_add"
                                        onChange={(event) => setAmount(event.target.value.toString())}
                                        value={amount ?? amount}
                                    />
                                </div>
                            </div>

                            <div className="wallet-inputs form_input_wp">
                                <label
                                    htmlFor="wallet_withdrawal_method"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.withdrawal_request_page?.method?.value,
                                    }}></label>

                                <select
                                    name="wallet_withdrawal_method"
                                    id="wallet_withdrawal_method"
                                    className="form_input"
                                    onChange={(event) => setMethod(event.target.value)}
                                    value={method}>
                                    <option value="crypto">
                                        {
                                            languageData?.withdrawal_request_page
                                                ?.withdrawal_request_page_select_box?.value
                                        }
                                    </option>
                                </select>
                            </div>

                            <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                {errorMessage}
                            </p>

                            <div className="woo_add_btn">
                                <Button type="submit">
                                    {languageData?.withdrawal_request_page?.submit_button?.value}
                                </Button>
                                <span
                                    className="load-more"
                                    style={{ display: loading ? "inline-block" : "none" }}>
                                    <i className="fad fa-spinner-third fa-spin"></i>
                                </span>
                            </div>
                        </form>
                    )}
                </>
            )}

            {isUnverified && (
                <>
                    <form onSubmit={(event) => handleOtpVerify(event, "verify")}>
                        <h5>{languageData?.withdrawal_request_page?.requested_amount?.value}: </h5>
                        <div className="woo-wallet-add-amount">
                            <label htmlFor="withdrawal-request-verification">
                                {languageData?.withdrawal_request_page?.withdrawal_request_input_label?.value}
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
                        <div className="button_group mt_20 mb_10" style={{ alignItems: "center" }}>
                            <Button type="submit">
                                {
                                    languageData?.withdrawal_request_page
                                        ?.withdrawal_request_form_verify_button?.value
                                }
                            </Button>
                            <Button type="button" onClick={(event) => handleOtpVerify(event, "cancel")}>
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
                    <p className="success-msg" style={{ display: successMessage ? "block" : "none" }}>
                        {successMessage}
                    </p>
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                </>
            )}

            {isPending && (
                <div className="casino-table-wp">
                    <table className="custom_table">
                        <thead>
                            <tr>
                                <th>
                                    {
                                        languageData?.withdrawal_request_page?.my_account_table_amount_cell
                                            ?.value
                                    }
                                </th>
                                <th>
                                    {
                                        languageData?.withdrawal_request_page?.my_account_table_status_cell
                                            ?.value
                                    }
                                </th>
                                <th>
                                    {
                                        languageData?.withdrawal_request_page?.my_account_table_method_cell
                                            ?.value
                                    }
                                </th>
                                <th>
                                    {languageData?.withdrawal_request_page?.my_account_table_date_cell?.value}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequestData?.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <p className="wallet_price">
                                            <bdi>{renderAmountWithCurrency(item.amount, item.currency)}</bdi>
                                        </p>
                                    </td>
                                    <td style={{ textTransform: "capitalize" }}>{item.status}</td>
                                    <td>
                                        {item.withdrawMethod} - {item.withdrawCoin}
                                    </td>
                                    <td>{getDescriptiveDate(item.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AccountWalletSideBar>
    );
};

export async function getServerSideProps() {
    return {
        props: {}
    };
}

export default WalletWithdrawal;
