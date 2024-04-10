import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import NextTooltip from "../UI/NextTooltip";

const CreditAction = ({
    row,
    setShowIncreaseModal,
    setShowPlayerIncreaseModal,
    setUserDetails,
    setShowPlayerDecreaseModal,
    setShowDecreaseModal,
}) => {
    const { adminLanguageData } = AdminLanguageState();

    return (
        <div className="table_btn_group form_right_group">
            <ul>
                <li>
                    <NextTooltip title={adminLanguageData?.users_page?.action_add_credit_tooltip?.value}>
                        <button
                            type="button"
                            className="sec_btn icon_btn balance_action"
                            onClick={() => {
                                setUserDetails({
                                    remoteId: row.remoteId,
                                    username: row.username,
                                    userBalance: row.balance,
                                });
                                if (row.accountType === "player") {
                                    setShowPlayerIncreaseModal(true);
                                } else {
                                    setShowIncreaseModal(true);
                                }
                            }}>
                            <i className="far fa-plus"></i>
                        </button>
                    </NextTooltip>
                </li>
                <li>
                    <NextTooltip title={adminLanguageData?.users_page?.action_remove_credit_tooltip?.value}>
                        <button
                            type="button"
                            className="sec_btn icon_btn balance_action"
                            onClick={() => {
                                setUserDetails({
                                    remoteId: row.remoteId,
                                    username: row.username,
                                    userBalance: row.balance,
                                });
                                if (row.accountType === "player") {
                                    setShowPlayerDecreaseModal(true);
                                } else {
                                    setShowDecreaseModal(true);
                                }
                            }}>
                            <i className="far fa-minus"></i>
                        </button>
                    </NextTooltip>
                </li>
            </ul>
        </div>
    );
};
export default CreditAction;
