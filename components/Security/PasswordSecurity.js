const PasswordSecurity = ({ moduleStatus, handleUpdate, languageData }) => {
    return (
        <div className="security_content_step4_box_title">
            {languageData?.security_page?.security_step_4_password_change?.value}
            <div className="input_switch">
                <label className="input_switch_toggle" htmlFor="security_password_change">
                    <input
                        type="checkbox"
                        className="input_toggle_input"
                        id="security_password_change"
                        onChange={(event) => {
                            handleUpdate(event, "changePassword");
                        }}
                        defaultChecked={moduleStatus?.changePassword}
                        hidden
                    />
                    <span className="input_switch_track">
                        <span className="input_switch_indicator"></span>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default PasswordSecurity;
