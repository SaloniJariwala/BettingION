import NextTooltip from "../admin/UI/NextTooltip";

const SecurityContentStep2 = ({ qrcodeUrl, secretKey, isCopy, handleCopy, languageData }) => {
    return (
        <div className="security_content_step2">
            <p className="security_authenticator_title">{languageData?.security_page?.security_step_2_title?.value || "Scan this QR code in the Authenticator app"}</p>

            <div className="security_content_step2_content">
                <div className="security_content_step2_content_right">
                    <div
                        dangerouslySetInnerHTML={{
                            __html: qrcodeUrl,
                        }}
                    ></div>
                </div>
                <div className="security_content_step2_content_left">
                    <p>{languageData?.security_page?.security_step_2_paragraph_one?.value}</p>
                    <p>{languageData?.security_page?.security_step_2_paragraph_two?.value}</p>
                </div>
            </div>

            <div className="secret_key_input">
                <p>{languageData?.security_page?.security_step_2_secret_key_title?.value}</p>

                <div className="ca_details_input">
                    <span>{secretKey}</span>
                    <NextTooltip title={isCopy ? "Copied!" : "Copy"}>
                        <button className="ca_details_input_copy" onClick={handleCopy}>
                            <i className="fas fa-copy"></i>
                        </button>
                    </NextTooltip>
                </div>
            </div>
        </div>
    );
};

export default SecurityContentStep2;
