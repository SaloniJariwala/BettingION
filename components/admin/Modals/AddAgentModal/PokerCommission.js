import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import { Controller } from "react-hook-form";

const PokerCommission = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <span>{adminLanguageData?.common_add_user_modal_placeholder?.poker_checkbox?.value}</span>
            <div className="form-element">
                <Controller
                    name="pokerCommission"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <input
                            type="number"
                            name="commission[poker]"
                            className="form_input"
                            step=".01"
                            placeholder=""
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                <i className="far fa-percent"></i>
            </div>
        </>
    );
};

export default PokerCommission;
