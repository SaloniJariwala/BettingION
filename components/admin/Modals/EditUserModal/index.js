import AdminModal from "@/components/admin/AdminModal";
import axios from "axios";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Loader from "../../UI/Loader";
import CasinoCommission from "../AddAgentModal/CasinoCommission";
import DocumentContainer from "../AddAgentModal/DocumentContainer";
import EmailContainer from "../AddAgentModal/EmailContainer";
import FullnameContainer from "../AddAgentModal/FullnameContainer";
import PhoneContainer from "../AddAgentModal/PhoneContainer";
import SettlementContainer from "../AddAgentModal/SettlementContainer";
import sha1 from "sha1";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import AsyncSelect from "react-select/async";

const accountTypes = ["administrator", "super-agent", "agent"];

const EditUser = ({ show, setShow, userInfoId }) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const [selectedTab, setSelectedTab] = useState("personal-information");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitLoader, setSubmitLoader] = useState(false);
    const [userDetails, setUserDetails] = useState();

    const [defaultParent, setDefaultParent] = useState(false);
    const [input, setInput] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectLoading, setSelectLoading] = useState(false);

    useEffect(() => {
        if (show) {
            const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userInfoId}`);
            setLoading(true);
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${userInfoId}`
                )
                .then((response) => {
                    if (response.status === 200) {
                        const userData = response.data?.data;
                        setUserDetails(response.data?.data);
                        methods.setValue("fullname", userData?.fname);
                        methods.setValue("document", userData?.document);
                        methods.setValue("agentEmail", userData?.email);
                        methods.setValue("phone", userData?.phone);
                        methods.setValue("settlementType", userData?.settlementType);
                        methods.setValue("casinoCommission", userData?.commission?.casino);

                        // Parent User
                        setDefaultParent(response.data?.data?.fatherId);

                        // Default selected initial
                        if (response.data?.data?.fatherId) {
                            setSelectedOption({
                                accountType: 'agent',
                                label: response.data?.data?.fatherName,
                                value: response.data?.data?.fatherId
                            });
                        }
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 500) {
                        setError(500);
                    } else {
                        setError(error.message);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [show]);

    useEffect(() => {
        if (!defaultParent) return;

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${defaultParent}`);

        setSelectLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${defaultParent}&hide=false&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    const userInfo = [
                        {
                            label: `${response.data?.data?.username} (${response.data?.data?.email
                                } ~ ${response.data?.data?.accountType.toUpperCase()})`,
                            value: response.data?.data?.remoteId,
                            accountType: response.data?.data?.accountType,
                        },
                    ];
                    setSelectedOption(userInfo[0]);
                }
            })
            .catch((error) => {
                // setErrorMessage(error.message);
            })
            .finally(() => {
                setSelectLoading(false);
            });
    }, [defaultParent]);

    const loadOptions = async (input) => {
        let res;
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setSelectLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/dashboard-users-by-remoteid?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&username=${input}&limit=25&filterType=everyone&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.currentUser !== 0) {
                        res = response.data?.allUsers?.map((user) => {
                            return {
                                label: `${user?.username} (${user?.emailId
                                    } ~ ${user?.accountType.toUpperCase()})`,
                                value: user?.remoteId,
                                accountType: user?.accountType,
                            };
                        });
                    }
                }
            })
            .catch((error) => {
                // setErrorMessage(error.message);
            })
            .finally(() => {
                setSelectLoading(false);
            });
        return res;
    };

    const handleInputChange = (newValue) => {
        setInput(newValue);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const handleClose = () => {
        setShow(false);
        setDefaultParent(null);
        setSelectedOption(null);

        methods.setValue("fullname", "");
        methods.setValue("document", "");
        methods.setValue("agentEmail", "");
        methods.setValue("phone", "");
        methods.setValue("settlementType", "");
        methods.setValue("casinoCommission", "");
        setError("");
        setSelectedTab("personal-information");
    };

    const checkNext = (event) => {
        event.preventDefault();
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
        setSelectedTab("commissions");
    };

    const handleEdit = async (formData) => {
        setError("");
        if (userDetails?.accountType === "agent") {
            if (methods.getValues("settlementType") === "Select Settlement Type") {
                setError(
                    adminLanguageData?.common_add_user_modal_message?.settlement_type_required_message?.value
                );
                return;
            }
            if (!methods.getValues("casinoCommission")) {
                setError(
                    adminLanguageData?.common_add_user_modal_message?.casino_comission_required_message?.value
                );
                return;
            }
        } else if (userDetails?.accountType === "player") {
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
        }
        let payload = {
            remoteId: userDetails?.remoteId,
            action: "edit-user",
            fname: formData?.fullname,
            phone: formData?.phone,
            document: formData?.document,
            fatherId: selectedOption?.value,
            auth_id: JSON.parse(localStorage.getItem("User"))?.remoteId
        };
        if (userDetails?.accountType === "agent") {
            payload = {
                ...payload,
                settlementType: formData?.settlementType,
                commission: {
                    casino: Number(formData?.casinoCommission),
                },
            };
        }
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userDetails?.remoteId}&action=edit-user`
        );
        setSubmitLoader(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload,
                {}
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    handleClose();
                } else {
                    setError(response?.data?.message);
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
                setSubmitLoader(false);
            });
    };

    const checkPrevious = (event) => {
        event.preventDefault();
        setSelectedTab("personal-information");
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">
                {adminLanguageData?.edit_user_modal?.edit_user_modal_title?.value}
            </h3>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="modal_tablist">
                        <ul>
                            <li
                                data-tab="personal-information"
                                className={selectedTab === "personal-information" && "active_modal_tab"}>
                                {
                                    adminLanguageData?.edit_user_modal
                                        ?.edit_user_modal_tab_personal_information?.value
                                }
                            </li>
                            {userDetails?.accountType === "agent" && (
                                <li
                                    data-tab="commissions"
                                    className={selectedTab === "commissions" && "active_modal_tab"}>
                                    {
                                        adminLanguageData?.edit_user_modal?.edit_user_modal_tab_commissions
                                            ?.value
                                    }
                                </li>
                            )}
                        </ul>
                    </div>

                    <FormProvider {...methods}>
                        <form
                            className="vr_add_user_from"
                            method="post"
                            onSubmit={methods.handleSubmit(handleEdit)}
                            autoComplete="off">
                            {/* Personal Information Tab */}
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
                                    <div className="form_input_wp">
                                        <label htmlFor="">Parent User</label>
                                        <AsyncSelect
                                            className={`select_box form_input ${selectedOption && !accountTypes.includes(selectedOption?.accountType)
                                                ? "input_error"
                                                : ""
                                                }`}
                                            classNamePrefix="react-select"
                                            cacheOptions
                                            inputValue={input}
                                            loadOptions={loadOptions}
                                            onInputChange={handleInputChange}
                                            isLoading={selectLoading}
                                            labelKey="label"
                                            valueKey="value"
                                            placeholder={"search user.."}
                                            onChange={handleSelectChange}
                                            value={selectedOption}
                                            required
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: "#fff",
                                                    primary25: "#bd57fb",
                                                    neutral0: "#161a23",
                                                },
                                            })}
                                        />
                                    </div>
                                </div>
                                <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                                    {error}
                                </p>
                                <div className="modal_footer">
                                    {userDetails?.accountType === "agent" ? (
                                        <button className="sec_btn" onClick={checkNext}>
                                            {
                                                adminLanguageData?.edit_user_modal
                                                    ?.edit_user_modal_next_button?.value
                                            }
                                        </button>
                                    ) : (
                                        <div className="modal_footer">
                                            <button type="submit" className="sec_btn">
                                                {
                                                    adminLanguageData?.common_date_time_label
                                                        ?.submit_button_text?.value
                                                }
                                            </button>
                                            <span
                                                className="load-more"
                                                style={{ display: submitLoader ? "block" : "none" }}>
                                                <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Commission Tab */}
                            <div
                                className="modal-from-section commissions-sec"
                                style={{ display: selectedTab === "commissions" ? "block" : "none" }}>
                                <div className="commissions_modal_form">
                                    <div className="commission-type-div">
                                        <SettlementContainer methods={methods} />
                                    </div>
                                </div>
                                <div className="form_checkbox-sec-wp">
                                    <div className="form_checkbox-sec form_input-sec">
                                        <div className="form_input-sec_list all-commission-main-box">
                                            <div className="form_checkbox-header">
                                                <CasinoCommission methods={methods} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                                    {error === 500 ? "Something went wrong" : error}
                                </p>
                                <div className="modal_footer">
                                    <button className="sec_btn" onClick={checkPrevious}>
                                        {
                                            adminLanguageData?.edit_user_modal
                                                ?.edit_user_modal_previous_button?.value
                                        }
                                    </button>
                                    <button type="submit" className="sec_btn">
                                        {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                    </button>
                                    <span
                                        className="load-more"
                                        style={{ display: submitLoader ? "block" : "none" }}>
                                        <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                                    </span>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                </>
            )}
        </AdminModal>
    );
};

export default EditUser;
