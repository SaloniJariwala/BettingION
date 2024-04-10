import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import { Controller } from "react-hook-form";

const SettlementContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <label htmlFor="settlement_type_select">
                {adminLanguageData?.common_add_user_modal_placeholder?.settle_automatically_label?.value}
            </label>
            <div className="form-element text-center">
                <Controller
                    name="settlementType"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <select
                            name="settlement_type"
                            id="settlement_type_select"
                            className="form_input"
                            onChange={onChange}
                            value={value}>
                            <option>
                                {
                                    adminLanguageData?.common_add_user_modal_placeholder
                                        ?.select_settlement_type_option?.value
                                }
                            </option>
                            <option value="month">
                                {adminLanguageData?.common_add_user_modal_placeholder?.monthly_option?.value}
                            </option>
                            <option value="week">
                                {adminLanguageData?.common_add_user_modal_placeholder?.weekly_option?.value}
                            </option>
                        </select>
                    )}
                />
                <i className="far fa-angle-down"></i>
            </div>
        </>
    );
};

export default SettlementContainer;
