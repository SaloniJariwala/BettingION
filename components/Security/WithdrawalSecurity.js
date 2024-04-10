const WithdrawalSecurity = ({ moduleStatus, handleUpdate, languageData }) => {
    return (
        <div className="security_content_step4_box_title">
            {languageData?.security_page?.security_step_4_withdrawal?.value}

            <div className="input_switch">
                <label className="input_switch_toggle" htmlFor="security_withdrawal">
                    <input
                        type="checkbox"
                        className="input_toggle_input"
                        id="security_withdrawal"
                        onChange={(event) => {
                            handleUpdate(event, "withdraw");
                        }}
                        defaultChecked={moduleStatus?.withdraw}
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

export default WithdrawalSecurity;
