import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Controller } from "react-hook-form";

const EmailContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <i className="fal fa-envelope"></i>
            <Controller
                name="agentEmail"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        type="email"
                        className="form_input"
                        onChange={onChange}
                        value={value}
                        placeholder={
                            adminLanguageData?.edit_user_modal?.edit_user_modal_email_placeholder?.value
                        }
                    />
                )}
            />
        </>
    );
};

export default EmailContainer;
