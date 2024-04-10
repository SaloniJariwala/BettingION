const LoginSecurity = ({ handleUpdate, moduleStatus, languageData }) => {
    return (
        <div className="security_content_step4_box">
            <div className="security_content_step4_box_title">
                {languageData?.security_page?.security_step_4_login_verification?.value}
                <div className="input_switch">
                    <label className="input_switch_toggle" htmlFor="login_verification_change">
                        <input
                            type="checkbox"
                            className="input_toggle_input"
                            id="login_verification_change"
                            onChange={(event) => {
                                handleUpdate(event, "login");
                            }}
                            defaultChecked={moduleStatus?.login}
                            hidden
                        />
                        <span className="input_switch_track">
                            <span className="input_switch_indicator"></span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default LoginSecurity;
