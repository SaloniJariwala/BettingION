import AdminModal from "@/components/admin/AdminModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const UserInfoModal = ({ show, setShow, userDetails, getAgentsAndPlayers, errorMessage }) => {
    const { adminLanguageData } = AdminLanguageState();

    const handleClose = () => {
        setShow(false);
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">{adminLanguageData?.user_information_user_modal?.user_information_modal_title?.value}</h3>

            {errorMessage ? (
                errorMessage === 500 ? (
                    <>Something Went Wrong</>
                ) : (
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                )
            ) : (
                <div className="two_col_row">
                    <div className="two_col">
                        <ul className="user_info_list">
                            <li>
                                <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_id?.value} :</label>
                                <span>{userDetails?.userId}</span>
                            </li>
                            <li>
                                <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_user?.value} :</label>
                                <span>{userDetails?.username}</span>
                            </li>
                            <li>
                                <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_father?.value} :</label>
                                <span>{userDetails?.fatherName}</span>
                            </li>
                            <li>
                                <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_role?.value} :</label>
                                <span>{userDetails?.accountType}</span>
                            </li>
                            {userDetails?.accountType === "agent" && (
                                <>
                                    <li>
                                        <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_agents?.value} :</label>
                                        <span>
                                            <button
                                                data-userrole={userDetails?.accountType}
                                                data-userid={userDetails?.id}
                                                className="user_info_sort"
                                                onClick={() => getAgentsAndPlayers(userDetails?.remoteId, "agent")}
                                            >
                                                {userDetails?.totalAgents}
                                            </button>
                                        </span>
                                    </li>
                                    <li>
                                        <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_players?.value} :</label>
                                        <span>
                                            <button
                                                data-userrole={userDetails?.accountType}
                                                data-userid={userDetails?.id}
                                                className="user_info_sort"
                                                onClick={() => getAgentsAndPlayers(userDetails?.remoteId, "player")}
                                            >
                                                {userDetails?.totalPlayers}
                                            </button>
                                        </span>
                                    </li>
                                </>
                            )}
                            <li>
                                <label>{adminLanguageData?.user_information_user_modal?.user_information_modal_created?.value} :</label>
                                <span>{`${new Date(userDetails?.createdAt).toLocaleDateString()} `}</span>
                            </li>
                        </ul>
                    </div>
                    <div className="two_col">
                        <h6 className="h6-title">{adminLanguageData?.user_information_user_modal?.user_information_modal_structure?.value} :</h6>
                        {/* <ul className="structure_list"> */}
                        {userDetails?.parentTree?.map((item, index) => {
                            return (
                                <ul className="structure_list" key={index}>
                                    <li style={{ "--data-count": index }} key={index}>
                                        <span title={item?.username}>{item?.username}</span>
                                    </li>
                                </ul>
                            );
                        })}
                        {/* </ul> */}
                    </div>
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                </div>
            )}
        </AdminModal>
    );
};

export default UserInfoModal;
