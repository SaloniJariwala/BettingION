const DepositSecurity = ({ handleUpdate, moduleStatus, languageData }) => {
    return (
        <div className="security_content_step4_box_title">
            {languageData?.security_page?.security_step_4_deposits?.value}
            <div className="input_switch">
                <label className="input_switch_toggle" htmlFor="security_deposits">
                    <input
                        type="checkbox"
                        className="input_toggle_input"
                        id="security_deposits"
                        onChange={(event) => {
                            handleUpdate(event, "deposit");
                        }}
                        defaultChecked={moduleStatus?.deposit}
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

export default DepositSecurity;
