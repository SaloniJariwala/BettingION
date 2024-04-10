import AdminModal from "@/components/admin/AdminModal";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import NextTooltip from "../../UI/NextTooltip";
import sha1 from "sha1";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AddBonusModal = ({ show, setShow, userDetails, setFlag }) => {
    const methods = useForm();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);

    const handleClose = () => {
        setShow(false);
        setAmount(0);
        setErrorMessage("");
    };

    const incrementCounter = (e) => {
        e.preventDefault();
        setAmount((Number(amount) + 50).toFixed(2));
    };

    const decrementCounter = (e) => {
        e.preventDefault();
        if (amount > 50) {
            setAmount(Number(amount) - 50);
        }
    };

    const handleSpecific = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
    };

    const handleBonusCredit = async () => {
        setErrorMessage("");
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `action=credit&remote_id=${process.env.NEXT_PUBLIC_REMOTE_ID}/_${userDetails?.userId}&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&currency=${userDefaultCurrency?.currencyAbrv}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&amount=${Number(amount)}&sender_id=https://demo.urgentgames.com/_${
                    JSON.parse(localStorage.getItem("User"))?.id
                }`
        );
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos-admin/api?action=credit&remote_id=${
                    process.env.NEXT_PUBLIC_REMOTE_ID
                }/_${userDetails?.userId}&token=${process.env.NEXT_PUBLIC_TOKEN}&currency=${
                    userDefaultCurrency?.currencyAbrv
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&amount=${Number(amount)}&sender_id=${
                    process.env.NEXT_PUBLIC_URGENT_GAMES_API_DOMAIN
                }/_${
                    JSON.parse(localStorage.getItem("Admin"))?.ID
                }&authKey=${authKey}&status=&txnAction=bonusCreditDebit`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    handleClose();
                    setFlag();
                } else {
                    setErrorMessage(response.data?.response);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AdminModal show={show} closeModal={handleClose}>
            <h3 className="h3-title modal_title">Add Bonus</h3>

            <FormProvider {...methods}>
                <form
                    action=""
                    className="add_credit_form"
                    onSubmit={methods.handleSubmit(handleBonusCredit)}>
                    <div className="form_input_group">
                        <div className="input-group-prepend">
                            <span className="input-group-text input-modal-addon">
                                <i className="fas fa-user" aria-hidden="true"></i>
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form_input"
                            name="user_name"
                            readOnly={userDetails?.username}
                            defaultValue={userDetails?.username}
                        />
                        <input
                            type="text"
                            className="form_input"
                            name="user_current_balance"
                            readOnly={renderAmountWithCurrency(
                                userDetails?.userBonus,
                                userDefaultCurrency?.currencyAbrv
                            )}
                            defaultValue={renderAmountWithCurrency(
                                userDetails?.userBonus,
                                userDefaultCurrency?.currencyAbrv
                            )}
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
                                step=".01"
                                placeholder="0.00"
                                value={amount ?? amount}
                                onInput={(e) => {
                                    if (e.target.value.indexOf(".") !== -1) {
                                        const decimals = e.target.value.length - e.target.value.indexOf(".");
                                        if (decimals > 3)
                                            e.target.value = e.target.value.slice(
                                                0,
                                                e.target.value.indexOf(".") + 3
                                            );
                                    }
                                }}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div className="table_btn_group form_right_group">
                            <ul>
                                <li>
                                    <NextTooltip title="increase Bonus">
                                        <button
                                            type="button"
                                            className="sec_btn icon_btn balance_action"
                                            value={amount ?? amount}
                                            onClick={(e) => {
                                                incrementCounter(e);
                                            }}>
                                            <i className="far fa-plus"></i>
                                        </button>
                                    </NextTooltip>
                                </li>
                                <li>
                                    <NextTooltip title="decrease Bonus">
                                        <button
                                            type="button"
                                            className="sec_btn icon_btn balance_action"
                                            value={amount ?? amount}
                                            onClick={(e) => {
                                                decrementCounter(e);
                                            }}>
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
                                    data-value="100"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    value={100}
                                    data-original-title="increase 100"
                                    onClick={(event) => handleSpecific(event)}>
                                    <i className="far fa-plus"></i> 100
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    data-value="1000"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    value={1000}
                                    data-original-title="increase 1,000"
                                    onClick={(event) => handleSpecific(event)}>
                                    <i className="far fa-plus"></i> 1,000
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    data-value="10000"
                                    className="sec_btn sm_btn"
                                    data-button-toggle="tooltip"
                                    value={10000}
                                    data-original-title="increase  10,000"
                                    onClick={(event) => handleSpecific(event)}>
                                    <i className="far fa-plus"></i> 10,000
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="form_input_group add_player_credits_info">
                        <input type="hidden" name="user_role" defaultValue="agent" />
                    </div>

                    <div className="modal_footer">
                        <button type="submit" className="sec_btn">
                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                        </button>
                        <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                            <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                        </span>
                        <input type="hidden" name="user_id" defaultValue="103" />
                        <input type="hidden" name="balance_action" defaultValue="credit" />
                    </div>
                    {errorMessage === 500 ? (
                        <>Something went wrong</>
                    ) : (
                        <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                            {errorMessage}
                        </p>
                    )}
                </form>
            </FormProvider>
        </AdminModal>
    );
};

export default AddBonusModal;
