import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";

const EndDateContainer = ({ methods, isBonus }) => {
    const {
        control,
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();

    const range = (start, end) => {
        return new Array(end - start).fill().map((d, i) => i + start);
    };
    const years = range(1990, new Date().getFullYear() + 1, 1);
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
            <label>{adminLanguageData?.common_date_time_label?.end_date_label?.value}</label>
            <div className="position-relative">
                <i className="fal fa-calendar"></i>
                <Controller
                    name="endDate"
                    control={control}
                    rules={isBonus && { required: adminLanguageData?.common_date_time_label?.end_date_error?.value }}
                    render={({ field: { onChange, value } }) => (
                        <DatePicker
                            renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
                                <div
                                    style={{
                                        margin: "10px 0",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <button className="datepicker_button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                        <i className="far fa-angle-left"></i>
                                    </button>
                                    <select value={new Date(date).getFullYear() ?? ""} onChange={({ target: { value } }) => changeYear(value)}>
                                        {years.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <select value={months[new Date(date).getMonth()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
                                        {months.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>

                                    <button className="datepicker_button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                        <i className="far fa-angle-right"></i>
                                    </button>
                                </div>
                            )}
                            selected={value}
                            onChange={onChange}
                            isClearable={true}
                            withPortal
                            className={`form_input ${errors.endDate ? "input_error" : ""}`}
                        />
                    )}
                />
            </div>
            {errors?.endDate && <p className="player-bet-loss">{errors?.endDate?.message}</p>}
        </>
    );
};

export default EndDateContainer;
