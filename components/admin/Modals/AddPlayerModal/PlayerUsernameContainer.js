import React from "react";
import { Controller } from "react-hook-form";

const PlayerUsernameContainer = ({ methods }) => {
    const { control } = methods;

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
                        placeholder="UserName"
                        onChange={onChange}
                        autoComplete="off"
                    />
                )}
            />
        </>
    );
};

export default PlayerUsernameContainer;
