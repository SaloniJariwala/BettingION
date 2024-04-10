import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { FormProvider, useForm } from "react-hook-form";
import sha1 from "sha1";
import AdminModal from "../../AdminModal";
import CasinoCommission from "./CasinoCommission";
import DocumentContainer from "./DocumentContainer";
import EmailContainer from "./EmailContainer";
import FullnameContainer from "./FullnameContainer";
import PasswordContainer from "./PasswordContainer";
import PermissionContainer from "./PermissionContainer";
import PhoneContainer from "./PhoneContainer";
import PokerCommission from "./PokerCommission";
import SettlementContainer from "./SettlementContainer";
import SportCommission from "./SportCommision";
import UsernameContainer from "./UsernameContainer";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AddAgent = ({ show, setShow, setFlag, userRole, title }) => {
    const methods = useForm();
    const router = useRouter();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [selectedTab, setSelectedTab] = useState("entry");
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setShow(false);
        methods.setValue("username", "");
        methods.setValue("password", "");
        methods.setValue("fullname", "");
        methods.setValue("document", "");
        methods.setValue("agentEmail", "");
        methods.setValue("phone", "");
        methods.setValue("settlementType", "");
        methods.setValue("sportsCommission", "");
        methods.setValue("pokerCommission", "");
        methods.setValue("casinoCommission", "");
        methods.setValue("permissions", "");
        setError("");
        setSelectedTab("entry");
    };

    const checkNext = (event, name) => {
        event.preventDefault();
        if (name === "entry") {
            if (!methods.getValues("username")) {
                setError(adminLanguageData?.common_add_user_modal_message?.user_name_required_message?.value);
                return;
            }
            if (!methods.getValues("password")) {
                setError(adminLanguageData?.common_add_user_modal_message?.password_required_message?.value);
                return;
            }
            setError("");
            setSelectedTab("personal-information");
        } else if (selectedTab == "personal-information") {
            if (!methods.getValues("agentEmail")) {
                setError(adminLanguageData?.common_add_user_modal_message?.email_required_message?.value);
                return;
            } else {
                const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
                if (!methods.getValues("agentEmail").match(regex)) {
                    setError(adminLanguageData?.common_add_user_modal_message?.valid_email_message?.value);
                    return;
                }
            }
            setError("");
            setSelectedTab("permission");
        } else if (selectedTab == "permission") {
            if (!methods.getValues("permissions")) {
                setError(
                    adminLanguageData?.common_add_user_modal_message?.permission_required_message?.value
                );
                return;
            }
            setError("");
            setSelectedTab("commissions");
        }
    };

    const checkPrevious = (event, name) => {
        event.preventDefault();
        if (name === "personal-information") {
            setSelectedTab("entry");
        } else if (name === "permission") {
            setSelectedTab("personal-information");
        } else if (name === "commissions") {
            setSelectedTab("permission");
        }
    };

    const handleFormData = async (formData) => {
        setError("");
        if (userRole !== "player") {
            if (!methods.getValues("settlementType")) {
                setError(
                    adminLanguageData?.common_add_user_modal_message?.settlement_type_required_message?.value
                );
                return;
            }
            const permissions = methods.getValues("permissions");
            if (permissions.includes("sports")) {
                if (!methods.getValues("sportsCommission")) {
                    setError(
                        adminLanguageData?.common_add_user_modal_message?.sports_comission_required_message
                            ?.value
                    );
                    return;
                }
            }
            if (permissions.includes("casino")) {
                if (!methods.getValues("casinoCommission")) {
                    setError(
                        adminLanguageData?.common_add_user_modal_message?.casino_comission_required_message
                            ?.value
                    );
                    return;
                }
            }
            if (permissions.includes("poker")) {
                if (!methods.getValues("pokerCommission")) {
                    setError(
                        adminLanguageData?.common_add_user_modal_message?.poker_comission_required_message
                            ?.value
                    );
                    return;
                }
            }
        }
        let payload = {
            currency: userDefaultCurrency?.currencyAbrv,
            email: formData?.agentEmail,
            password: formData?.password,
            permission: formData?.permissions,
            username: formData?.username,
            role: userRole,
            fatherId: JSON.parse(localStorage.getItem("User"))?.remoteId,
        };
        if (userRole !== "player") {
            payload = {
                ...payload,
                settlementType: formData?.settlementType,
                commission: {
                    casino: formData?.casinoCommission,
                    sports: formData?.sportsCommission,
                    poker: formData?.pokerCommission,
                },
            };
        }
        setLoading(true);
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `email=${formData?.agentEmail}&username=${formData?.username}`
        );
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/create-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
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
                    setError(response.data?.message);
                    return;
                }
            })
            .catch((err) => {
                if (error?.response?.status === 500) {
                    setError(500);
                } else {
                    setError(err.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">{title}</h3>
            <div className="modal_tablist">
                <ul>
                    <li data-tab="entry" className={selectedTab === "entry" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.entry_tab?.value}
                    </li>
                    <li
                        data-tab="personal-information"
                        className={selectedTab === "personal-information" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.personal_information_tab?.value}
                    </li>

                    <li data-tab="permission" className={selectedTab === "permission" && "active_modal_tab"}>
                        {adminLanguageData?.common_add_user_modal_tab?.permission_tab?.value}
                    </li>
                    {userRole !== "player" && (
                        <li
                            data-tab="commissions"
                            className={selectedTab === "commissions" && "active_modal_tab"}>
                            {adminLanguageData?.common_add_user_modal_tab?.commissions_tab?.value}
                        </li>
                    )}
                </ul>
            </div>

            <FormProvider {...methods}>
                <form
                    method="post"
                    className="vr_add_user_from"
                    onSubmit={methods.handleSubmit(handleFormData)}>
                    <div
                        className="modal-from-section entry-sec"
                        style={{ display: selectedTab === "entry" ? "block" : "none" }}>
                        <div className="modal_form">
                            <div className="form_input_wp">
                                <UsernameContainer methods={methods} />
                            </div>
                            <div className="form_input_wp">
                                <PasswordContainer methods={methods} />
                            </div>
                        </div>
                        <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                            {error}
                        </p>
                        <div className="modal_footer">
                            <button className="sec_btn" onClick={(event) => checkNext(event, "entry")}>
                                {adminLanguageData?.edit_user_modal?.edit_user_modal_next_button?.value}
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-from-section personal-information-sec"
                        style={{
                            display: selectedTab === "personal-information" ? "block" : "none",
                        }}>
                        <div className="modal_form">
                            <div className="form_input_wp">
                                <FullnameContainer methods={methods} />
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
                        <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                            {error}
                        </p>
                        <div className="modal_footer">
                            <button
                                className="sec_btn"
                                onClick={(event) => checkPrevious(event, "personal-information")}>
                                {adminLanguageData?.common_add_user_modal_button?.previous_button?.value}
                            </button>
                            <button
                                className="sec_btn"
                                onClick={(event) => checkNext(event, "personal-information")}>
                                {adminLanguageData?.edit_user_modal?.edit_user_modal_next_button?.value}
                            </button>
                        </div>
                    </div>
                    <div
                        className="modal-from-section permission-sec"
                        style={{ display: selectedTab === "permission" ? "block" : "none" }}>
                        <PermissionContainer methods={methods} />

                        <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                            {error}
                        </p>
                        <div className="modal_footer">
                            <button
                                className="sec_btn"
                                onClick={(event) => checkPrevious(event, "permission")}>
                                {adminLanguageData?.common_add_user_modal_button?.previous_button?.value}
                            </button>
                            {userRole === "player" ? (
                                <button type="submit" className="sec_btn">
                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="sec_btn"
                                        onClick={(event) => checkNext(event, "permission")}>
                                        {
                                            adminLanguageData?.edit_user_modal?.edit_user_modal_next_button
                                                ?.value
                                        }
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {userRole !== "player" && (
                        <div
                            className="modal-from-section commissions-sec"
                            style={{
                                display: selectedTab === "commissions" ? "block" : "none",
                            }}>
                            <div className="commissions_modal_form">
                                <div className="commission-type-div">
                                    <SettlementContainer methods={methods} />
                                </div>
                            </div>
                            <div className="form_checkbox-sec-wp">
                                <div className="form_checkbox-sec form_input-sec">
                                    <div className="form_input-sec_list all-commission-main-box">
                                        <div className="form_checkbox-header">
                                            <SportCommission methods={methods} />
                                        </div>
                                    </div>
                                    <div className="form_input-sec_list all-commission-main-box">
                                        <div className="form_checkbox-header">
                                            <CasinoCommission methods={methods} />
                                        </div>
                                    </div>
                                    <div className="form_input-sec_list all-commission-main-box">
                                        <div className="form_checkbox-header">
                                            <PokerCommission methods={methods} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                                {error === 500 ? "Something went wrong" : error}
                            </p>
                            <div className="modal_footer">
                                <button
                                    className="sec_btn"
                                    onClick={(event) => checkPrevious(event, "commissions")}>
                                    {adminLanguageData?.common_add_user_modal_button?.previous_button?.value}
                                </button>
                                <button type="submit" className="sec_btn">
                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                </button>
                                <span
                                    className="load-more"
                                    style={{ display: loading ? "inline-block" : "none" }}>
                                    <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                                </span>
                            </div>
                        </div>
                    )}
                </form>
            </FormProvider>
        </AdminModal>
    );
};

export default AddAgent;
