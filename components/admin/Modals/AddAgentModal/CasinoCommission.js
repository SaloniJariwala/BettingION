import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Controller } from "react-hook-form";

const CasinoCommission = ({ methods }) => {
    const { control } = methods;
    const { adminLanguageData } = AdminLanguageState();

    return (
        <>
            <span>{adminLanguageData?.common_add_user_modal_placeholder?.casino_checkbox?.value}</span>
            <div className="form-element">
                <Controller
                    name="casinoCommission"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <input
                            type="number"
                            name="commission[casino]"
                            className="form_input"
                            step=".01"
                            placeholder=""
                            onChange={onChange}
                            value={value}
                        />
                    )}
                />
                <i className="far fa-percent"></i>
            </div>
        </>
    );
};

export default CasinoCommission;
