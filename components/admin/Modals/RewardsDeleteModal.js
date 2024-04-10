import Button from "@/components/frontend/UI/Button";
import AdminModal from "../AdminModal";
import axios from "axios";
import sha1 from "sha1";
import { useState } from "react";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const RewardDeleteModal = ({ show, setShow, rewardId, renderData }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const handleClose = () => {
        clearMessages();
        setShow(false);
    };

    const handleDeleteReward = () => {
        clearMessages();
        setLoading(true);

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `rewardId=${rewardId}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/delete?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&rewardId=${rewardId}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    renderData();
                    setTimeout(() => {
                        handleClose();
                    }, 5000);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
            <div div className="reward_modal">
                <h4 className="h4_title">
                    {adminLanguageData?.store_rewards_delete_modal?.store_rewards_delete_modal_title?.value}
                </h4>
                <p>
                    {adminLanguageData?.store_rewards_delete_modal?.store_rewards_delete_modal_message?.value}
                </p>

                <div className="button_group">
                    <Button type="button" onClick={handleDeleteReward}>
                        {
                            adminLanguageData?.store_rewards_delete_modal
                                ?.store_rewards_delete_modal_confirm_button?.value
                        }
                    </Button>
                </div>

                {loading && (
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third fa-spin"></i>
                    </span>
                )}

                <div className="error-msg player-bet-loss mt_20" style={{ display: errorMessage && "block" }}>
                    {errorMessage}
                </div>
                <div
                    className="error-msg player-bet-won mt_20"
                    style={{ display: successMessage && "block" }}>
                    {successMessage}
                </div>
            </div>
        </AdminModal>
    );
};

export default RewardDeleteModal;
