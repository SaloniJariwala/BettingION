const SecurityContentStep3 = ({ otp, inputCodeHandler, inputFocus, handlePaste, verifyError, verifySuccess, languageData }) => {
    return (
        <div className="security_content_step3">
            <p className="security_authenticator_title">{languageData?.security_page?.security_step_3_title?.value}</p>
            <p>{languageData?.security_page?.security_step_3_content?.value}</p>

            <form>
                <div className="security_authenticator_otp">
                    <input type="number" name="otp1" value={otp.otp1} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="1" />
                    <input type="number" name="otp2" value={otp.otp2} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="2" />
                    <input type="number" name="otp3" value={otp.otp3} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="3" />
                    <input type="number" name="otp4" value={otp.otp4} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="4" />
                    <input type="number" name="otp5" value={otp.otp5} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="5" />
                    <input type="number" name="otp6" value={otp.otp6} onChange={inputCodeHandler} className="form_input" onKeyUp={(e) => inputFocus(e)} onPaste={handlePaste} tabIndex="6" />
                </div>
            </form>
            <p>{languageData?.security_page?.security_step_3_otp_content?.value}</p>
            <p className="text-center error-msg">{verifyError}</p>
            <p className="text-center success-msg">{verifySuccess}</p>
        </div>
    );
};

export default SecurityContentStep3;
