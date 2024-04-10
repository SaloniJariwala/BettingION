import React from "react";
import { Controller } from "react-hook-form";

const DocumentContainer = ({ methods }) => {
    const { control } = methods;
    return (
        <>
            <i className="fal fa-id-card"></i>

            <Controller
                name="document"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type="text"
                        value={value}
                        className="form_input"
                        placeholder="Document"
                        onChange={onChange}
                    />
                )}
            />
        </>
    );
};

export default DocumentContainer;
