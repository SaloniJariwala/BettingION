import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import NextTooltip from "../UI/NextTooltip";

const CreditDebitRollover = ({
    row,
    setAddRolloverModal,
    setUserDetails,
    setDeductRolloverModal,
}) => {
    const { adminLanguageData } = AdminLanguageState();

    return (
        <div className="table_btn_group form_right_group">
            <ul>
                <li>
                    <NextTooltip title={'Credit Rollover'}>
                        <button
                            type="button"
                            className="sec_btn icon_btn balance_action"
                            onClick={() => {
                                setUserDetails({
                                    userId: row.userId,
                                    remoteId: row.remoteId,
                                    username: row.username,
                                    userRollover: row.rolloverAmount,
                                    userBalance: row.balance,
                                });
                                setAddRolloverModal(true);
                            }}>
                            <i className="far fa-plus"></i>
                        </button>
                    </NextTooltip>
                </li>
                <li>
                    <NextTooltip title={'Debit Rollover'}>
                        <button
                            type="button"
                            className="sec_btn icon_btn balance_action"
                            onClick={() => {
                                setUserDetails({
                                    userId: row.userId,
                                    remoteId: row.remoteId,
                                    username: row.username,
                                    userRollover: row.rolloverAmount,
                                    userBalance: row.balance,
                                });
                                setDeductRolloverModal(true)
                            }}>
                            <i className="far fa-minus"></i>
                        </button>
                    </NextTooltip>
                </li>
            </ul>
        </div>
    );
};
export default CreditDebitRollover;
