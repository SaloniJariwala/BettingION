import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";

const IncludeExcludePaymentMethods = ({ label, name, handleChange, currency, value }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [include, setInclude] = useState("");
    const [exclude, setExclude] = useState("");

    useEffect(() => {
        if (value) {
            if (name === "include") {
                setInclude(value[0]);
            } else {
                setExclude(value[0]);
            }
        }
    }, [value]);

    return (
        <>
            <div className="form_input_wp form-element select_box_wrapper">
                <label>{label}</label>
                <div className="position-relative">
                    <select
                        name={name}
                        id={name}
                        value={name === "include" ? include : exclude}
                        onChange={(event) =>
                            handleChange(
                                currency,
                                name === "include" ? "includePaymentMethods" : "excludePaymentMethods",
                                [event.target.value]
                            )
                        }>
                        <option value="select">Select...</option>
                        <option value="crypto">
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_payment_method_option_crypto?.value
                            }
                        </option>
                        <option value="bankTransfer">
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_payment_method_option_bank_transfer?.value
                            }
                        </option>
                        <option value="paypal">
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_payment_method_option_paypal?.value
                            }
                        </option>
                        <option value="stripe">
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_payment_method_option_stripe?.value
                            }
                        </option>
                    </select>
                    <i className="far fa-angle-down"></i>
                </div>
            </div>
        </>
    );
};

export default IncludeExcludePaymentMethods;
