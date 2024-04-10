import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

const EndTimeContainer = ({ methods, isBonus }) => {
    const {
        control,
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <label>{adminLanguageData?.common_date_time_label?.end_time_label?.value}</label>
            <div className="position-relative">
                <i className="fal fa-alarm-clock active"></i>
                <Controller
                    name="endTime"
                    control={control}
                    rules={isBonus && { required: adminLanguageData?.common_date_time_label?.end_time_error?.value }}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            selected={value}
                            isClearable={true}
                            onChange={onChange}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                            withPortal
                            className={`form_input ${errors?.endTime ? "input_error" : ""}`}
                        />
                    )}
                />
            </div>
            {errors?.endTime && <p className="player-bet-loss">{errors?.endTime?.message}</p>}
        </>
    );
};

export default EndTimeContainer;
