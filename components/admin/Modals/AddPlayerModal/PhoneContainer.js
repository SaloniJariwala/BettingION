import { Controller } from "react-hook-form";

const PhoneContainer = ({ methods }) => {
    const { control } = methods;
    return (
        <>
            <i className="fal fa-phone-alt"></i>
            <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type="number"
                        value={value}
                        className="form_input"
                        placeholder="Phone"
                        onChange={onChange}
                    />
                )}
            />
        </>
    );
};

export default PhoneContainer;
