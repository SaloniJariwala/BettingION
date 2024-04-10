import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AdminModal from "@/components/admin/AdminModal";
import PlayerUsernameContainer from "./PlayerUsernameContainer";
import PasswordContainer from "./PasswordContainer";
import FullNameContainer from "./FullnameContainer";
import DocumentContainer from "./DocumentContainer";
import EmailContainer from "./EmailContainer";
import PhoneContainer from "./PhoneContainer";
import PermissionContainer from "./PermissionContainer";
import axios from "axios";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AddPlayer = ({ show, setShow, setFlag }) => {
    const methods = useForm();
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const [selectedTab, setSelectedTab] = useState("entry");
    const [errorMessage, setErrorMessage] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
        methods.setValue("username", "");
        methods.setValue("password", "");
        methods.setValue("fullname", "");
        methods.setValue("document", "");
        methods.setValue("email", "");
        methods.setValue("phone", "");
        methods.setValue("permissions", "");
        setErrorMessage("");
        setSelectedTab("entry");
    };

    const handleNext = (e, name) => {
        e.preventDefault();
        if (name === "entry") {
            if (!methods.getValues("username")) {
                setErrorMessage(
                    adminLanguageData?.common_add_user_modal_message?.user_name_required_message?.value
                );
                return;
            }
            if (!methods.getValues("password")) {
                setErrorMessage(
                    adminLanguageData?.common_add_user_modal_message?.password_required_message?.value
                );
                return;
            }
            setSelectedTab("personalInfo");
            setErrorMessage("");
        } else if (name === "personalInfo") {
            if (!methods.getValues("email")) {
                setErrorMessage(
                    adminLanguageData?.common_add_user_modal_message?.email_required_message?.value
                );
                return;
            } else {
                const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!methods.getValues("email").match(regex)) {
                    setErrorMessage(
                        adminLanguageData?.common_add_user_modal_message?.valid_email_message?.value
                    );
                    return;
                }
            }
            setErrorMessage("");
            setSelectedTab("permissionTab");
        }
    };

    const handlePrevious = (e, name) => {
        e.preventDefault();
        if (name === "entry") {
            setSelectedTab("entry");
        }
        if (name === "personalInfo") {
            setSelectedTab("personalInfo");
        }
    };

    const handleFormSubmit = async (formData) => {
        if (!methods.getValues("permissions")) {
            setErrorMessage(
                adminLanguageData?.common_add_user_modal_message?.permission_required_message?.value
            );
            return;
        }
        setErrorMessage("");
        const payload = {
            loggedInUser: JSON.parse(localStorage.getItem("Admin"))?.ID,
            username: formData?.username,
            password: formData?.password,
            fullname: formData?.fullname,
            email: formData?.email,
            userRole: "player",
            permission: formData?.permissions,
            document: formData?.document,
            phone: formData?.user_phone,
        };
        setIsLoading(true);
        await axios
            .post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/register-casino-users.php`, payload, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                if (response.data?.status) {
                    const path = router.pathname.includes("users");
                    if (!path) {
                        router.push("/admin/users");
                    } else {
                        setShow(false);
                        if (setFlag) {
                            setFlag();
                        }
                    }
                } else {
                    setErrorMessage(response.data?.error);
                    return;
                }
            })
            .catch((err) => {
                setErrorMessage(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">Add player</h3>
            <div className="modal_tablist">
                <ul>
                    <li data-tab="entry" className={selectedTab === "entry" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.entry_tab?.value}
                    </li>
                    <li
                        data-tab="personal-information"
                        className={selectedTab === "personalInfo" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.personal_information_tab?.value}
                    </li>
                    <li
                        data-tab="permission"
                        className={selectedTab === "permissionTab" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.permission_tab?.value}
                    </li>
                </ul>
            </div>

            <div>
                <FormProvider {...methods}>
                    <form
                        method="post"
                        className="vr_add_user_from"
                        onSubmit={methods.handleSubmit(handleFormSubmit)}
                        autoComplete="off">
                        <div
                            className="modal-from-section entry-sec"
                            style={{ display: selectedTab === "entry" ? "block" : "none" }}>
                            <div className="modal_form">
                                <div className="form_input_wp">
                                    <PlayerUsernameContainer methods={methods} />
                                </div>
                                <div className="form_input_wp">
                                    <PasswordContainer methods={methods} />
                                </div>
                            </div>
                            <p
                                className="error-msg vr-uname-err"
                                style={{ display: errorMessage ? "block" : "none" }}>
                                {errorMessage}
                            </p>
                            <div className="modal_footer">
                                <button
                                    type="submit"
                                    className="sec_btn"
                                    onClick={(e) => handleNext(e, "entry")}>
                                    {adminLanguageData?.common_add_user_modal_button?.next_button?.value}
                                </button>
                            </div>
                        </div>

                        <div
                            className="modal-from-section personal-information-sec"
                            style={{ display: selectedTab === "personalInfo" ? "block" : "none" }}>
                            <div className="modal_form">
                                <div className="form_input_wp">
                                    <FullNameContainer methods={methods} />
                                </div>
                                <div className="form_input_wp">
                                    <DocumentContainer methods={methods} />
                                </div>
                                <div className="form_input_wp">
                                    <EmailContainer methods={methods} />
                                </div>
                                <div className="form_input_wp">
                                    <PhoneContainer methods={methods} />
                                </div>
                            </div>
                            <p
                                className="error-msg vr-uname-err"
                                style={{ display: errorMessage ? "block" : "none" }}>
                                {errorMessage}
                            </p>
                            <div className="modal_footer">
                                <button
                                    type="submit"
                                    className="sec_btn"
                                    onClick={(e) => handlePrevious(e, "entry")}>
                                    {adminLanguageData?.common_add_user_modal_button?.previous_button?.value}
                                </button>
                                <button
                                    type="submit"
                                    className="sec_btn"
                                    onClick={(e) => handleNext(e, "personalInfo")}>
                                    {adminLanguageData?.common_add_user_modal_button?.next_button?.value}
                                </button>
                            </div>
                        </div>

                        <div
                            className="modal-from-section permission-sec"
                            style={{ display: selectedTab === "permissionTab" ? "block" : "none" }}>
                            <PermissionContainer methods={methods} />
                            <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                {errorMessage === 500 ? "Something went wrong" : errorMessage}
                            </p>
                            <div className="modal_footer">
                                <button
                                    type="submit"
                                    className="sec_btn"
                                    onClick={(e) => handlePrevious(e, "personalInfo")}>
                                    {adminLanguageData?.common_add_user_modal_button?.previous_button?.value}
                                </button>
                                <button type="submit" className="sec_btn">
                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                </button>
                                <span
                                    className="load-more"
                                    style={{ display: isLoading ? "inline-block" : "none" }}>
                                    <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                                </span>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </AdminModal>
    );
};

export default AddPlayer;
