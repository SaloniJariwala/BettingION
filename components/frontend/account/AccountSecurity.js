import Image from "next/image";
import googleIcon from "@/frontend/images/google_logo.svg";
import Button from "@/components/frontend/UI/Button";
import { LanguageState } from "@/context/FrontLanguageProvider";

const AccountSecurity = ({
    children,
    finalStep,
    stepNum,
    setStep,
    setFinalStep,
    verifiedStatus = false,
    verifiedHandle,
}) => {
    const { languageData } = LanguageState();

    if (stepNum === 4 && !verifiedStatus) {
        setStep(3);
        verifiedHandle();
    }

    return (
        <div className="account_security">
            {!finalStep && (
                <>
                    <div className="account_security_head">
                        <div className="account_security_title">
                            <Image
                                src={googleIcon}
                                priority={true}
                                alt="Google Authenticator"
                                width={20}
                                height={20}
                            />{" "}
                            {languageData?.security_page?.google_authenticator?.value ||
                                "Google Authenticator"}
                        </div>
                        <p>
                            {" "}
                            {languageData?.security_page?.google_authenticator_text?.value ||
                                "Protect your account and transactions."}{" "}
                        </p>
                    </div>
                    <div className="account_security_steps">
                        <div className="account_security_step active_security_step">
                            <span className="step_num">1</span>
                        </div>
                        <div
                            className={`account_security_step ${stepNum >= 2 ? "active_security_step" : ""}`}>
                            <span></span>
                            <span className="step_num">2</span>
                        </div>
                        <div
                            className={`account_security_step ${stepNum >= 3 ? "active_security_step" : ""}`}>
                            <span></span>
                            <span className="step_num">3</span>
                        </div>
                        <div
                            className={`account_security_step ${stepNum >= 4 ? "active_security_step" : ""}`}>
                            <span></span>
                            <span className="step_num">4</span>
                        </div>
                        <div
                            className={`account_security_step ${
                                stepNum === 5 ? "active_security_step" : ""
                            }`}>
                            <span></span>
                            <span className="step_num">5</span>
                        </div>
                    </div>
                </>
            )}

            <div className="account_security_main">{children}</div>

            {!finalStep && <hr />}

            <div className="button_group justify-content-center">
                {stepNum === 1 && (
                    <Button type="Button" onClick={() => setStep(2)}>
                        {languageData?.security_page?.security_step_next_button?.value || "Next"}
                    </Button>
                )}

                {stepNum === 2 && (
                    <>
                        <Button type="Button" variant="transparent" onClick={() => setStep(1)}>
                            {languageData?.security_page?.security_step_pervious_button?.value || "Previous"}
                        </Button>

                        <Button type="Button" onClick={() => setStep(3)}>
                            {languageData?.security_page?.security_step_next_button?.value || "Next"}
                        </Button>
                    </>
                )}

                {stepNum === 3 && (
                    <>
                        <Button type="Button" variant="transparent" onClick={() => setStep(2)}>
                            {languageData?.security_page?.security_step_pervious_button?.value || "Previous"}
                        </Button>

                        <Button type="Button" onClick={() => setStep(4)}>
                            {languageData?.security_page?.security_step_next_button?.value || "Next"}
                        </Button>
                    </>
                )}

                {stepNum === 4 && (
                    <>
                        <Button type="Button" variant="transparent" onClick={() => setStep(3)}>
                            {languageData?.security_page?.security_step_pervious_button?.value || "Previous"}
                        </Button>

                        <Button type="Button" onClick={() => setStep(5)}>
                            {languageData?.security_page?.security_step_next_button?.value || "Next"}
                        </Button>
                    </>
                )}

                {stepNum === 5 && (
                    <Button type="Button" onClick={() => setFinalStep(true)}>
                        {languageData?.security_page?.security_step_done_button?.value || "Done"}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default AccountSecurity;
