import DepositSecurity from "./DepositsSecurity";
import LoginSecurity from "./LoginSecurity";
import PasswordSecurity from "./PasswordSecurity";
import TransferFundSecurity from "./TransferFundSecurity";
import WithdrawalSecurity from "./WithdrawalSecurity";
import { LanguageState } from "@/context/FrontLanguageProvider";

const SecurityContentStep4 = ({ handleUpdate, moduleStatus, updateError }) => {
    const { languageData } = LanguageState();

    return (
        <div className="security_content_step4">
            <p className="security_authenticator_title text_center">{languageData?.security_page?.security_step_4_title?.value || "Select options to check the Authentication"}</p>

            <p className="text_center error-msg">{updateError}</p>

            <div className="security_content_step4_box_wp">
                <LoginSecurity handleUpdate={handleUpdate} moduleStatus={moduleStatus} languageData={languageData} />

                <div className="security_content_step4_box">
                    <PasswordSecurity handleUpdate={handleUpdate} moduleStatus={moduleStatus} languageData={languageData} />
                </div>

                <div className="security_content_step4_box">
                    <WithdrawalSecurity handleUpdate={handleUpdate} moduleStatus={moduleStatus} languageData={languageData} />
                </div>

                <div className="security_content_step4_box">
                    <DepositSecurity handleUpdate={handleUpdate} moduleStatus={moduleStatus} languageData={languageData} />
                </div>

                <div className="security_content_step4_box">
                    <TransferFundSecurity handleUpdate={handleUpdate} moduleStatus={moduleStatus} languageData={languageData} />
                </div>
            </div>
        </div>
    );
};

export default SecurityContentStep4;
