import { useState } from "react";
import { Controller } from "react-hook-form";
const PasswordContainer = ({ methods }) => {
    const { control } = methods;

    const [show, setShow] = useState(false);

    return (
        <>
            <i className={show ? "fal fa-eye-slash" : "fal fa-eye"} onClick={() => setShow(!show)}></i>
            <Controller
                name="password"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type={show ? "text" : "password"}
                        value={value}
                        className="form_input"
                        placeholder="Password"
                        onChange={onChange}
                        autoComplete="off"
                    />
                )}
            />
        </>
    );
};

export default PasswordContainer;
