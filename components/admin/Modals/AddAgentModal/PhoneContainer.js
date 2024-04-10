import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import { Controller } from "react-hook-form";

const PhoneContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <i className="fal fa-phone-alt"></i>
            <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type="number"
                        className="form_input"
                        onChange={onChange}
                        value={value}
                        placeholder={
                            adminLanguageData?.edit_user_modal?.edit_user_modal_phone_placeholder?.value
                        }
                    />
                )}
            />
        </>
    );
};

export default PhoneContainer;
