import Button from "@/components/frontend/UI/Button";
import { LanguageState } from "@/context/FrontLanguageProvider";
import axios from "axios";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import sha1 from "sha1";

/**
 * Create Campaign Modal
 *
 * @param {*} props
 * @returns
 */
const CreateCampaigns = ({ show, setShow, refreshData }) => {
    const { languageData } = LanguageState();
    const [campaignName, setCampaignName] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [createStatus, setCreateStatus] = useState(false);

    const clearResponseMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleClose = () => {
        if (createStatus) {
            setCreateStatus(false);
            refreshData();
        }
        setShow(false);
        setCampaignName("");
        clearResponseMessages();
    };

    const createCampaignHandler = (event) => {
        event.preventDefault();
        clearResponseMessages();

        if (campaignName?.trim()?.length === 0) {
            setErrorMessage(languageData?.affiliate_page?.campaign_name_required?.value);
            return;
        }

        const payload = {
            remoteId: JSON.parse(localStorage.getItem("User"))?.remoteId,
            tag: campaignName,
        };

        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&tag=${campaignName}`
        );

        setLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/link?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    setCreateStatus(true);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Modal show={show}>
                <div className="close_modal_overlay" onClick={handleClose}></div>
                <Modal.Body>
                    <div className="transfer_modal_box">
                        <button type="button" className="close" onClick={handleClose}>
                            <i className="fal fa-times"></i>
                        </button>

                        <h4 className="modal-title">
                            {languageData?.affiliate_page?.create_campaign_modal_title?.value}
                        </h4>

                        <div className="create_campaign_modal">
                            <form method="POST" onSubmit={createCampaignHandler}>
                                <div className="form_input_wp text_center m-0">
                                    <input
                                        type="text"
                                        className="form_input mb_20"
                                        placeholder={
                                            languageData?.affiliate_page?.campaign_name_placeholder?.value
                                        }
                                        value={campaignName}
                                        onChange={(event) => setCampaignName(event.target.value)}
                                    />
                                    <Button type="submit" size="sm">
                                        {languageData?.affiliate_page?.campaign_modal_create_button?.value}
                                    </Button>
                                </div>

                                {loading ? (
                                    <span
                                        className="load-more mt_20"
                                        style={{ display: loading ? "inline-block" : "none" }}>
                                        <i className="fad fa-spinner-third fa-spin"></i>
                                    </span>
                                ) : (
                                    <>
                                        <p
                                            className="success-msg mt_20"
                                            style={{ display: successMessage ? "block" : "none" }}>
                                            {successMessage}
                                        </p>
                                        <p
                                            className="error-msg mt_20"
                                            style={{ display: errorMessage ? "block" : "none" }}>
                                            {errorMessage}
                                        </p>
                                    </>
                                )}
                            </form>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateCampaigns;
