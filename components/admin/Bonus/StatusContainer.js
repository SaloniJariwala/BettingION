import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";

const StatusContainer = ({ methods }) => {
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <div className="form_input_wp form-element">
                <label>
                    {adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_status?.value}
                </label>
                <div className="position-relative">
                    <select
                        name="status"
                        className={`form_input ${errors?.status ? "input_error" : ""}`}
                        {...methods.register("status", {
                            required: "Status is required",
                        })}>
                        <option value={true}>
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_status_option_active?.value
                            }
                        </option>
                        <option value="no">
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_status_option_not_active?.value
                            }
                        </option>
                    </select>
                    <i className="far fa-angle-down"></i>
                    {errors?.status && <p className="player-bet-loss">{errors?.status?.message}</p>}
                </div>
            </div>
        </>
    );
};

export default StatusContainer;
