const TransferFundSecurity = ({ handleUpdate, moduleStatus, languageData }) => {
    return (
        <div className="security_content_step4_box_title">
            {languageData?.security_page?.security_step_4_transfer_funds?.value}

            <div className="input_switch">
                <label className="input_switch_toggle" htmlFor="security_transfer_funds">
                    <input
                        type="checkbox"
                        className="input_toggle_input"
                        id="security_transfer_funds"
                        onChange={(event) => {
                            handleUpdate(event, "transferFund");
                        }}
                        defaultChecked={moduleStatus?.transferFund}
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

export default TransferFundSecurity;
