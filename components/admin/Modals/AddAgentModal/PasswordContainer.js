import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useState } from "react";
import { Controller } from "react-hook-form";

const PasswordContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();
    const [show, setShow] = useState(false);

    return (
        <>
            <i className={show ? "fal fa-eye" : "fal fa-eye-slash"} onClick={() => setShow(!show)}></i>
            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        name="password"
                        type={show ? "text" : "password"}
                        className="form_input"
                        placeholder={
                            adminLanguageData?.common_add_user_modal_placeholder?.password_placeholder?.value
                        }
                        onChange={onChange}
                        value={value}
                        autoComplete="off"
                    />
                )}
            />
        </>
    );
};

export default PasswordContainer;
