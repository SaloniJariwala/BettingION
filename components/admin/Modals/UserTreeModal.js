import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import AdminModal from "../AdminModal";
import UserTree from "../UserTree";

const UserTreeModal = ({ show, setShow, getTreeUserId, currentId }) => {
    const { adminLanguageData } = AdminLanguageState();

    const handleClose = () => {
        setShow(false);
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
            <h3 className="h3-title modal_title">
                {adminLanguageData?.agent_tree_user_modal?.agent_tree_user_modal?.value}
            </h3>
            <UserTree getTreeUserId={getTreeUserId} currentId={currentId} setShow={setShow} />
        </AdminModal>
    );
};

export default UserTreeModal;
