import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Controller } from "react-hook-form";

const DocumentContainer = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <i className="fal fa-id-card"></i>
            <Controller
                name="document"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <input
                        name="document"
                        type="text"
                        className="form_input"
                        onChange={onChange}
                        value={value}
                        placeholder={
                            adminLanguageData?.edit_user_modal?.edit_user_modal_document_placeholder?.value
                        }
                    />
                )}
            />
        </>
    );
};

export default DocumentContainer;
