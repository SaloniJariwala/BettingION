import { useEffect, useState } from "react";
import AdminModal from "@/components/admin/AdminModal";
import { FormProvider, useForm } from "react-hook-form";
import NextTooltip from "../../UI/NextTooltip";
import axios from "axios";
import sha1 from "sha1";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const DecreaseModal = ({ show, setShow, userDetails, setFlag }) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { fetchBalance, setFetchBalance, userDefaultCurrency } = BalanceState();
    const [amount, setAmount] = useState(0);
    const [errorMessage, setErrorMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [paid, setPaid] = useState();
    const [description, setDescription] = useState("");

    const handleClose = () => {
        setShow(false);
        setAmount(0);
        setErrorMessage("");
        setDescription("");
    };

    // handle debit
    const handleDebit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `action=debit&remote_id=${userDetails?.remoteId}&token=${process.env.NEXT_PUBLIC_TOKEN}&currency=${userDefaultCurrency?.currencyAbrv}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&amount=${amount}&sender_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setIsLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos-admin/api?action=debit&remote_id=${userDetails?.remoteId}&token=${process.env.NEXT_PUBLIC_TOKEN}&currency=${
                    userDefaultCurrency?.currencyAbrv
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&amount=${amount}&description=${description}&operationType=${paid}&sender_id=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&status=transfer-funds-between-accounts&txnAction=debitAndCredit`
            )
            .then((response) => {
                if (response?.data?.status === 200) {
                    setFetchBalance(!fetchBalance);
                    handleClose();
                    if (setFlag) {
                        setFlag();
                    }
                } else if (response?.data?.status === 404) {
                    setErrorMessage(response?.data?.message);
                } else if (response?.data?.mainRes.status === 403) {
                    setErrorMessage(response?.data?.mainRes?.msg);
                } else {
                    setErrorMessage(response?.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const incrementCounter = (e) => {
        e.preventDefault();
        // if (amount || amount === 0) {
        setAmount((Number(amount) + 50).toFixed(2));
        // }
    };

    const decrementCounter = (e) => {
        e.preventDefault();
        if (amount > 50) {
            setAmount((Number(amount) - 50).toFixed(2));
        }
    };

    const handleSpecific = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
    };

    return (
        <AdminModal show={show} closeModal={handleClose}>
            <h3 className="h3-title modal_title">{adminLanguageData?.remove_credits_user_modal?.deduct_credits_modal_title?.value}</h3>
            <FormProvider {...methods}>
                <form action="" className="add_credit_form">
                    <div className="form_input_group">
                        <div className="input-group-prepend">
                            <span className="input-group-text input-modal-addon">
                                <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                        </div>
                        <input type="text" className="form_input" name="user_name" readOnly={userDetails?.username} defaultValue={userDetails?.username} />
                        <input
                            type="text"
                            className="form_input"
                            name="user_current_balance"
                            readOnly={renderAmountWithCurrency(userDetails?.userBalance, userDefaultCurrency?.currencyAbrv)}
                            defaultValue={renderAmountWithCurrency(userDetails?.userBalance, userDefaultCurrency?.currencyAbrv)}
                        />
                    </div>

                    <div className="form_input_group balance_input_group">
                        <div className="d-flex">
                            <div className="input-group-prepend">
                                <span className="input-group-text input-modal-addon">
                                    <i className="fas fa-coins" aria-hidden="true"></i>
                                </span>
                            </div>
                            <input
                                type="number"
                                className="form_input user_balanace_input"
                                name="user_balance"
                                aria-label="amount"
                                autoComplete="off"
                                min="0"
                                step=".01"
                                placeholder="0.00"
                                value={amount ?? amount}
                                onInput={(e) => {
                                    if (e.target.value.indexOf(".") !== -1) {
                                        const decimals = e.target.value.length - e.target.value.indexOf(".");
                                        if (decimals > 3) e.target.value = e.target.value.slice(0, e.target.value.indexOf(".") + 3);
                                    }
                                }}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="table_btn_group form_right_group">
                            <ul>
                                <li>
                                    <NextTooltip title={adminLanguageData?.common_finance_module?.modals_increase_tooltip?.value}>
                                        <button
                                            type="button"
                                            className="sec_btn icon_btn balance_action"
                                            value={amount ?? amount}
                                            onClick={(e) => {
                                                incrementCounter(e);
                                            }}
                                        >
                                            <i className="far fa-plus"></i>
                                        </button>
                                    </NextTooltip>
                                </li>
                                <li>
                                    <NextTooltip title={adminLanguageData?.common_finance_module?.modals_decrease_tooltip?.value}>
                                        <button
                                            type="button"
                                            className="sec_btn icon_btn balance_action"
                                            value={amount ?? amount}
                                            onClick={(e) => {
                                                decrementCounter(e);
                                            }}
                                        >
                                            <i className="far fa-minus"></i>
                                        </button>
                                    </NextTooltip>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="add_coin_group">
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    value="100"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    title=""
                                    onClick={(e) => handleSpecific(e)}
                                    data-original-title="increase 100"
                                >
                                    <i className="far fa-plus"></i> 100
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    value="1000"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    title=""
                                    onClick={(e) => handleSpecific(e)}
                                    data-original-title="increase 1,000"
                                >
                                    <i className="far fa-plus"></i> 1,000
                                </button>
                            </li>
                            <li>
                                <button
                                    type="submit"
                                    value="10000"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    title=""
                                    data-original-title="increase  10,000"
                                    onClick={(e) => handleSpecific(e)}
                                >
                                    <i className="far fa-plus"></i> 10,000
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="form_input_group add_player_credits_info">
                        <div className="d-flex form_checkbox_group">
                            <div className="form_checkbox">
                                <input
                                    type="checkbox"
                                    name="register_paid"
                                    value="payout"
                                    className="form-check-input"
                                    id="register_paid"
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            setPaid(event.target.value);
                                        } else {
                                            setPaid("");
                                        }
                                    }}
                                />
                                <label className="form-check-label" htmlFor="register_paid">
                                    {adminLanguageData?.remove_credits_user_modal?.deduct_credits_modal_register_as_paid?.value}
                                </label>
                            </div>
                        </div>
                        <div className="form_right_group">
                            <NextTooltip title={`${adminLanguageData?.add_credits_user_modal?.add_credits_modal_balance_in_finance_tooltip?.value} 0.00`}>
                                <button type="button" className="sec_btn icon_btn">
                                    <i className="fal fa-dollar-sign"></i>
                                </button>
                            </NextTooltip>
                            <textarea
                                name="user_payment_description"
                                cols="40"
                                rows="10"
                                className="form_input"
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder={adminLanguageData?.remove_credits_user_modal?.deduct_credits_modal_description_placeholder?.value}
                            ></textarea>
                        </div>
                        <input type="hidden" name="user_role" value="player" />
                    </div>

                    <div className="modal_footer">
                        <button type="submit" className="sec_btn" onClick={(e) => handleDebit(e)}>
                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                        </button>
                        <span className="load-more" style={{ display: isLoading ? "inline-block" : "none" }}>
                            <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                        </span>
                        <input type="hidden" name="user_id" defaultValue="103" />
                        <input type="hidden" name="balance_action" defaultValue="debit" />
                    </div>
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                </form>
            </FormProvider>
        </AdminModal>
    );
};

export default DecreaseModal;
