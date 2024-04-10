import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";

const InternalNameContainer = ({ methods }) => {
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <div className="form_input_wp">
                <label>{adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_internal_name?.value}</label>
                <input
                    name="Internal_name"
                    type="text"
                    className={`form_input ${errors?.internalName ? "input_error" : ""}`}
                    autoComplete="off"
                    {...methods.register("internalName", {
                        required: adminLanguageData?.bonus_campaign_create_page?.bonus_name_error?.value,
                    })}
                />
                {errors?.internalName && <p className="player-bet-loss">{errors?.internalName?.message}</p>}
            </div>
        </>
    );
};

export default InternalNameContainer;
