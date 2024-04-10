import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React from "react";
import { Controller } from "react-hook-form";

const UsernameContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <i className="fal fa-user"></i>
            <Controller
                name="username"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type="text"
                        value={value}
                        className="form_input"
                        placeholder={
                            adminLanguageData?.common_add_user_modal_placeholder?.username_placeholder?.value
                        }
                        onChange={onChange}
                        autoComplete="off"
                    />
                )}
            />
        </>
    );
};

export default UsernameContainer;
