/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import sha1 from "sha1";
import Head from "next/head";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import AccountSideBar from "@/components/frontend/account/AccountSideBar";
import Button from "@/components/frontend/UI/Button";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import CodeInput from "@/components/frontend/CodeInput";
import CurrencyDropDown from "@/components/frontend/common/CurrencyDropDown";
import Link from "next/link";
import { BalanceState } from "@/context/BalanceProvider";
import Dropdown from "@/frontend/ui/Dropdown";
import Select from "react-select";
import useGetConfig from "@/hooks/use-getConfig";
import BonusInfoModal from "@/components/frontend/Modal/BonusInfoModal";
const paymentLabels = {
    crypto: "Crypto",
    bankTransfer: "Bank Transfer",
    paypal: "Paypal",
    stripe: "Stripe",
};

const Deposit = (props) => {
    const router = useRouter();
    const getConfig = useGetConfig();
    const { userDefaultCurrency } = BalanceState();
    const { languageData } = LanguageState();
    const [tableShow, setTableShow] = useState(false);
    const [selectedOption, setSelectOptions] = useState(null);
    const [inputValue, setInputValue] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeTxn, setActiveTxn] = useState([]);
    const [toFaEnable, setToFaEnable] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [showBonus, setShowBonus] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [bank, setBank] = useState("");
    const [bonuses, setBonuses] = useState([]);
    const [selectedBonus, setSelectedBonus] = useState("");
    const [show, setShow] = useState(false);
    const [bonus, setBonus] = useState([]);

    /**
     * Bonus data
     */
    // useEffect(() => {
    //     const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

    //     axios
    //         .get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/list-activate-bonus-code-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&authKey=${authKey}`)
    //         .then((response) => {
    //             if (response.data?.status === 200) {
    //                 setBonuses(response.data?.data?.bonusCodes);
    //             }
    //         })
    //         .catch((error) => {
    //             console.log(error?.message);
    //         })
    //         .finally(() => { });
    // }, []);

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/get-campaign?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&limit=100&status=true`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setBonuses(response.data?.data);
                }
            })
            .catch((error) => {
                console.log(error?.message);
            })
            .finally(() => { });
    }, []);

    /**
     * Get pending deposit transactions
     */
    useEffect(() => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transactions?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&status=pending&txnType=deposit&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.length > 0) {
                        setActiveTxn(response.data?.data);
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    /**
     * Check form validation and verify 2FA authentication
     */
    const checkoutButton = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (paymentMethod?.length === 0) {
            setErrorMessage(languageData?.deposit_page?.select_payment_method?.value);
            return;
        }

        if (!inputValue) {
            setErrorMessage(languageData?.deposit_page?.amount_error_message?.value || "Please enter amount");
            return;
        }

        if (paymentMethod === "crypto" && !selectedOption) {
            setErrorMessage(
                languageData?.deposit_page?.select_currency_error_message?.value || "Please select currency"
            );
            return;
        }

        if (paymentMethod === "bankTransfer" && !bank) {
            setErrorMessage(
                languageData?.deposit_page?.select_bank_error_message?.value || "Please select bank"
            );
            return;
        }

        const authkeyDeposit = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&authKey=${authkeyDeposit}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response?.data?.data?.isEnabled2fa && response?.data?.data?.auth2FAmodule?.deposit) {
                        setToFaEnable(true);
                    } else {
                        setIsDepositing((prev) => !prev);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * Create deposit request
     */
    useEffect(() => {
        if ((selectedOption && inputValue) || (bank && inputValue)) {
            const userData = JSON.parse(localStorage.getItem("User"));
            const payload = {
                remoteId: userData?.remoteId,
                amount: Number(inputValue),
                currency: userDefaultCurrency?.currencyAbrv,
                withdrawMethod: paymentMethod,
            };

            if (paymentMethod === "bankTransfer") {
                payload.bankAccountNumber = bank?.value;
            } else if (paymentMethod === "crypto") {
                payload.coin = selectedOption?.value;
            }

            if (selectedBonus?.trim().length !== 0) {
                payload.bonusCode = selectedBonus;
            }
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${payload.remoteId}&amount=${Number(inputValue)}`
            );
            setLoading(true);
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/create-deposit-txn?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                    payload
                )
                .then((response) => {
                    if (response.data?.txnId) {
                        router.push({
                            pathname: "/checkout",
                            query: {
                                txnId: response.data?.txnId,
                            },
                        });
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
        }
    }, [isDepositing]);

    const bonusInformationHandler = (bonus) => {
        setBonus(bonus);
        setShow(true);
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountSideBar>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: HrefLocalReplace(languageData?.deposit_page?.deposit_page_title?.value),
                    }}></h2>
                <hr />
                {toFaEnable ? (
                    <div className="login_verification edit_account_security">
                        <CodeInput setIsDepositing={setIsDepositing} setDeposit2Fa={setToFaEnable} />
                    </div>
                ) : (
                    <>
                        <form method="post" action="">
                            <div className="woo-wallet-add-amount">
                                <label
                                    htmlFor="woo_wallet_balance_to_add"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.deposit_page?.deposit_amount_input_label?.value,
                                    }}></label>
                            </div>
                            <div className="currency_input">
                                <span className="wallet_input_group_addon">
                                    {userDefaultCurrency?.currencyAbrv}
                                </span>

                                <input
                                    type="number"
                                    step="any"
                                    min="0"
                                    className="form_input"
                                    required
                                    id="woo_wallet_balance_to_add"
                                    value={inputValue ?? ""}
                                    onChange={(e) => {
                                        setInputValue(e.target.value);
                                    }}
                                />
                            </div>

                            <ul>
                                <label>
                                    {languageData?.deposit_page?.payment_method_label?.value ||
                                        "Payment Method"}
                                </label>
                                {getConfig?.paymentMethods &&
                                    Object.entries(getConfig?.paymentMethods).map(([key, value]) => {
                                        if (value === true) {
                                            return (
                                                <li
                                                    key={key}
                                                    className={paymentMethod === key ? "active_option" : ""}
                                                    onClick={() => setPaymentMethod(key)}>
                                                    <div className="form_checkbox">
                                                        <input
                                                            type="radio"
                                                            name="payment_method"
                                                            id={key}
                                                            defaultChecked={paymentMethod === key}
                                                        />
                                                        <label htmlFor={key}>
                                                            {paymentLabels[key] || key}
                                                        </label>
                                                    </div>
                                                </li>
                                            );
                                        }
                                    })}
                            </ul>

                            {paymentMethod === "crypto" && (
                                <>
                                    <label htmlFor="select_currency">
                                        {languageData?.deposit_page?.currency?.value || "Select Currency"}
                                    </label>
                                    <CurrencyDropDown
                                        id="select_currency"
                                        selectedOption={selectedOption}
                                        setSelectedOption={setSelectOptions}
                                    />
                                </>
                            )}

                            {paymentMethod === "bankTransfer" && (
                                <>
                                    <div className="form_input_wp">
                                        <label htmlFor="bank-transfer">
                                            {languageData?.deposit_page?.select_bank_label?.value ||
                                                "Select Bank"}
                                        </label>
                                        <Select
                                            id="bank-transfer"
                                            className={`select_box form_input ${
                                                /*errors?.bonusType ? "input_error" : ""*/ ""
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
                                            value={bank}
                                            onChange={(value) => {
                                                setBank(value);
                                            }}
                                            options={getConfig?.optionsData?.bankAccountsOptions}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="choose_bonus mt_10">
                                <p className="text_button" onClick={() => setShowBonus(!showBonus)}>
                                    <i className="fas fa-gift"></i>
                                    {languageData?.deposit_page?.choose_bonus?.value || "Choose your bonus"}
                                </p>

                                {showBonus && (
                                    <form className="choose_bonus_list">
                                        <ul>
                                            {bonuses?.length > 0
                                                ? bonuses?.map((bonus, index) => {
                                                    return bonus?.translation?.map((promoCode) => {
                                                        return (
                                                            <li key={bonus?.id}>
                                                                <div className="form_checkbox">
                                                                    <input
                                                                        type="radio"
                                                                        name="choose_bonus"
                                                                        id={bonus?.id}
                                                                        onChange={() => {
                                                                            setSelectedBonus(bonus?.code);
                                                                        }}
                                                                    />

                                                                    <label
                                                                        htmlFor={bonus?.id}
                                                                        className="m-0">
                                                                        <p className={`choose_bonus_promo_code ${!bonus.code ? 'empty_promocode' : ''}`}>
                                                                            {bonus.code ? bonus?.code : "Promocode not available!"}
                                                                        </p>
                                                                        <span>{promoCode?.title}</span>
                                                                        <p className="promocode_description">{promoCode?.description}</p>
                                                                    </label>
                                                                    <i
                                                                        className="far fa-external-link"
                                                                        onClick={() => {
                                                                            bonusInformationHandler(bonus);
                                                                        }}></i>
                                                                </div>
                                                            </li>
                                                        );
                                                    });
                                                })
                                                : "No active bonus found"}
                                        </ul>
                                    </form>
                                )}
                            </div>

                            <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                {errorMessage}
                            </p>

                            <div className="woo_add_btn mt_10">
                                <Button type="submit" onClick={checkoutButton}>
                                    {languageData?.deposit_page?.deposit_form_button?.value}
                                </Button>
                                <span
                                    className="load-more"
                                    style={{ display: loading ? "inline-block" : "none" }}>
                                    <i className="fad fa-spinner-third fa-spin"></i>
                                </span>
                                {activeTxn?.length > 0 && (
                                    <button
                                        className="text_button"
                                        type="button"
                                        onClick={() => setTableShow(!tableShow)}>
                                        {languageData?.deposit_page?.active_deposit_button?.value}
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}

                {tableShow && (
                    <div className="casino-table-wp">
                        <table className="custom_table">
                            <thead>
                                <tr>
                                    <th>{languageData?.deposit_page?.my_account_table_amount_cell?.value}</th>
                                    <th>{languageData?.deposit_page?.my_account_table_status_cell?.value}</th>
                                    <th>{languageData?.deposit_page?.my_account_table_method_cell?.value}</th>
                                    <th>{languageData?.deposit_page?.my_account_table_date_cell?.value}</th>
                                    <th>{languageData?.deposit_page?.my_account_table_action_cell?.value}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTxn?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <p className="wallet_price">
                                                <bdi>
                                                    {renderAmountWithCurrency(
                                                        item.amount,
                                                        userDefaultCurrency?.currencyAbrv
                                                    )}
                                                </bdi>
                                            </p>
                                        </td>
                                        <td style={{ textTransform: "capitalize" }}>{item.status}</td>
                                        <td>
                                            {paymentLabels[item.withdrawMethod] || item.withdrawMethod} -{" "}
                                            {item.withdrawCoin}
                                        </td>
                                        <td>{getDescriptiveDate(item.createdAt)}</td>
                                        <td className="text_center">
                                            <Link
                                                href={`/checkout?txnId=${item?.transactionID}`}
                                                target="_blank"
                                                title="Checkout order">
                                                <i className="far fa-external-link"></i>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <BonusInfoModal show={show} setShow={setShow} bonus={bonus} modalFor="welcome" />
            </AccountSideBar>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Deposit",
            description: "Deposit",
        },
    };
}

export default Deposit;
