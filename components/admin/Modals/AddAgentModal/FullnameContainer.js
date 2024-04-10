import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Controller } from "react-hook-form";

const FullnameContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <i className="fal fa-user"></i>
            <Controller
                name="fullname"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        name="fullname"
                        type="text"
                        className="form_input"
                        onChange={onChange}
                        value={value}
                        placeholder={
                            adminLanguageData?.edit_user_modal?.edit_user_modal_fullname_placeholder?.value
                        }
                        autoComplete="off"
                    />
                )}
            />
        </>
    );
};

export default FullnameContainer;
