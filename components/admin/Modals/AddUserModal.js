import React, { useEffect, useState } from "react";
import AdminModal from "../AdminModal";
import AddAgent from "./AddAgentModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AddUserModal = ({ show, setShow }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [showModal, setShowModal] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [currentUserRole, setCurrentUserRole] = useState("");
    const [title, setTitle] = useState("");

    useEffect(() => {
        const accountType = JSON.parse(localStorage.getItem("User"))?.accountType;
        setCurrentUserRole(accountType);
    }, []);

    const handleClose = () => {
        setShow(false);
    };

    const getUserRole = (role) => {
        if (role === "super-agent") {
            setUserRole(role);
            setTitle(adminLanguageData?.add_super_agent_modal?.add_super_agent_modal_title?.value);
        } else if (role === "agent") {
            setUserRole(role);
            setTitle(adminLanguageData?.add_agent_modal?.add_agent_modal_title?.value);
        } else {
            setUserRole(role);
            setTitle(adminLanguageData?.add_player_modal?.add_player_modal_title?.value);
        }
        handleClose();
        setShowModal(true);
    };

    return (
        <>
            <AdminModal show={show} closeModal={handleClose} size={"lg"}>
                <h3 className="h3-title modal_title">
                    {adminLanguageData?.add_user_modal?.add_user_modal_title?.value}
                </h3>
                {(currentUserRole === "administrator" || currentUserRole === "super-agent") && (
                    <>
                        <button className="sec_btn mb_10" onClick={() => getUserRole("super-agent")}>
                            {adminLanguageData?.add_user_modal?.super_agent_button?.value}{" "}
                            <i className="far fa-plus-circle"></i>
                        </button>
                        <div className="button_group mb_10 ml_10">
                            <button className="sec_btn modal-html-btn" onClick={() => getUserRole("agent")}>
                                {adminLanguageData?.add_user_modal?.agent_button?.value}{" "}
                                <i className="far fa-plus-circle"></i>
                            </button>
                        </div>
                    </>
                )}

                <button className="sec_btn modal-html-btn ml_10" onClick={() => getUserRole("player")}>
                    {adminLanguageData?.add_user_modal?.player_button?.value}{" "}
                    <i className="far fa-plus-circle"></i>
                </button>
            </AdminModal>
            <AddAgent show={showModal} setShow={setShowModal} userRole={userRole} title={title} />
        </>
    );
};

export default AddUserModal;
