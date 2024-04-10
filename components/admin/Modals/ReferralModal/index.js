import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminModal from "../../AdminModal";
import NextTooltip from "../../UI/NextTooltip";
import sha1 from "sha1";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const ReferralModal = ({ show, setShow }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [commission, setCommission] = useState("");
    const [link, setLink] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState("");
    const [success, setSuccess] = useState("");
    const [isCopy, setIsCopy] = useState(false);
    const [commissionError, setCommissionError] = useState("");
    const [commissionLimit, setCommissionLimit] = useState(0);
    const [settlementType, setSettlementType] = useState("");

    useEffect(() => {
        if (show) {
            const getCommissionLimit = async () => {
                const authkey = sha1(
                    process.env.NEXT_PUBLIC_AUTH_KEY +
                        `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
                );
                await axios
                    .get(
                        `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${
                            process.env.NEXT_PUBLIC_TOKEN
                        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                            JSON.parse(localStorage.getItem("User"))?.remoteId
                        }&hide=false&accountType=${
                            JSON.parse(localStorage.getItem("User"))?.accountType
                        }&authKey=${authkey}`
                    )
                    .then((response) => {
                        if (response.data?.status === 200) {
                            setCommissionLimit(response.data?.data?.commission?.casino);
                        } else {
                            setCommissionError(response.data?.message);
                        }
                    })
                    .catch((err) => {
                        setCommissionError(err.message);
                    });
            };
            getCommissionLimit();
        }
    }, [show]);

    const handleClose = () => {
        setShow(false);
        setError("");
        setSuccess("");
        setGeneratedLink("");
        setCommission("");
        setLink("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setGeneratedLink("");
        if (!link && !commission && !settlementType) {
            setError(adminLanguageData?.referral_user_modal?.referral_modal_required_data_missing?.value);
            return;
        } else {
            if (!commission) {
                setError(adminLanguageData?.referral_user_modal?.referral_modal_commission_required?.value);
                return;
            }
            if (!link) {
                setError(
                    adminLanguageData?.referral_user_modal?.referral_modal_referral_link_required?.value
                );
                return;
            }
            if (!settlementType || settlementType === "default") {
                setError(
                    adminLanguageData?.referral_user_modal?.referral_modal_settlement_type_required?.value
                );
                return;
            }
        }
        const payload = {
            remoteId: JSON.parse(localStorage.getItem("User"))?.remoteId,
            tag: link,
            settlementType: settlementType,
            commission: {
                casino: commission,
            },
        };
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&tag=${link}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/referral-user/link?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                setError("");
                if (response.data?.status === 200) {
                    setGeneratedLink(
                        `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.NEXT_PUBLIC_REFER_PAGE_LINK}?${response.data?.data}`
                    );
                    setSuccess(response.data?.message);
                } else {
                    setError(response.data?.message);
                }
            })
            .catch((error) => {
                setError(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleCopy = async () => {
        if ("clipboard" in navigator) {
            setIsCopy(true);
            return await navigator.clipboard.writeText(generatedLink);
        } else {
            setIsCopy(false);
            return document.execCommand("copy", true, text);
        }
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="lg">
            <h3 className="h3-title modal_title">
                {adminLanguageData?.referral_user_modal?.referral_modal_title?.value}
            </h3>

            <form
                className="create_referral_link"
                id="create_referral_link"
                method="post"
                onSubmit={(event) => handleSubmit(event)}>
                <div className="modal-from-section entry-sec">
                    <div className="modal_form">
                        <div className="form_input_wp">
                            <i className="fal fa-percent"></i>
                            <input
                                name="referral_commission"
                                type="number"
                                className="form_input"
                                id="referral_commission"
                                autoComplete="off"
                                step=".01"
                                min="0"
                                max="100"
                                value={commission}
                                onChange={(event) => setCommission(event.target.value)}
                                placeholder={
                                    adminLanguageData?.referral_user_modal
                                        ?.referral_modal_referral_commission_placeholder?.value
                                }
                            />
                        </div>
                        <div className="form_input_wp">
                            <i className="fal fa-link"></i>
                            <input
                                name="referral_link"
                                type="text"
                                className="form_input"
                                id="referral_link"
                                autoComplete="off"
                                value={link}
                                onChange={(event) => setLink(event.target.value)}
                                placeholder={
                                    adminLanguageData?.referral_user_modal
                                        ?.referral_modal_referral_link_placeholder?.value
                                }
                            />
                        </div>
                        <div className="form_input_wp form-element">
                            <div className="form-element text-center">
                                <select
                                    name="settlement_type"
                                    id="settlement_type_select"
                                    className="form_input"
                                    onChange={(event) => setSettlementType(event.target.value)}
                                    value={settlementType}>
                                    <option value="default">
                                        {
                                            adminLanguageData?.referral_user_modal
                                                ?.referral_modal_select_settlement_type?.value
                                        }
                                    </option>
                                    <option value="month">
                                        {
                                            adminLanguageData?.referral_user_modal?.referral_modal_select_monthly
                                                ?.value
                                        }
                                    </option>
                                    <option value="week">
                                        {
                                            adminLanguageData?.referral_user_modal?.referral_modal_select_weekly
                                                ?.value
                                        }
                                    </option>
                                </select>
                                <i className="far fa-angle-down"></i>
                            </div>
                        </div>
                        <p className="note">
                            *{" "}
                            {
                                adminLanguageData?.referral_user_modal
                                    ?.referral_modal_referral_commission_message?.value
                            }{" "}
                            {commissionLimit}%
                        </p>
                        {generatedLink && (
                            <div className="form_input_wp generated-referral-link">
                                <a
                                    target="_blank"
                                    href={generatedLink}
                                    className="generated-referral-link-anchor"
                                    rel="noreferrer">
                                    {generatedLink}
                                </a>
                                <NextTooltip title={isCopy ? "Copied!" : "Copy"}>
                                    <button
                                        type="button"
                                        className="generated-referral-link-icon-button sec_btn icon_btn balance_action"
                                        data-button-toggle="tooltip"
                                        onClick={handleCopy}
                                        data-original-title="Copy Link">
                                        <i className="fal fa-copy generated-referral-link-icon"></i>
                                    </button>
                                </NextTooltip>
                            </div>
                        )}
                    </div>
                </div>
                <div className="modal_footer">
                    <button type="submit" className="sec_btn">
                        {
                            adminLanguageData?.referral_user_modal
                                ?.referral_modal_referral_modal_submit_button?.value
                        }
                    </button>
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                    </span>
                </div>
                <p className="error-msg" style={{ display: error ? "block" : "none" }}>
                    {error}
                </p>
                <p className="success-msg" style={{ display: success ? "block" : "none" }}>
                    {success}
                </p>
            </form>
        </AdminModal>
    );
};
export default ReferralModal;
