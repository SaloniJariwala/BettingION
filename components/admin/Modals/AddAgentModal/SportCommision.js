import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import { Controller } from "react-hook-form";

const SportCommission = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <span>{adminLanguageData?.common_add_user_modal_placeholder?.sports_checkbox?.value}</span>
            <div className="form-element">
                <Controller
                    name="sportsCommission"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <input
                            type="number"
                            name="commission[sports]"
                            className="form_input"
                            step=".01"
                            onChange={onChange}
                            value={value}
                            placeholder=""
                        />
                    )}
                />
                <i className="far fa-percent"></i>
            </div>
        </>
    );
};

export default SportCommission;
