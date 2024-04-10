import Button from "@/components/frontend/UI/Button";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { LanguageState } from "@/context/FrontLanguageProvider";

const ClaimRewardModal = ({ show, setShow, reward }) => {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { languageData } = LanguageState();

    const clearMessages = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };

    const closeHandle = () => {
        clearMessages();
        setShow(false);
    };

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("User")));
    }, []);

    const claimHandler = async () => {
        clearMessages();
        setLoading(true);

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}&id=${reward?.id}&remoteId=${user?.userId}`);

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/readme-reward?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${user?.userId}&id=${reward?.id}&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
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
        <>
            <Modal show={show}>
                <div className="close_modal_overlay" onClick={closeHandle}></div>
                <Modal.Body>
                    <div className="transfer_modal_box reward_modal">
                        <button type="button" className="close" onClick={closeHandle}>
                            ×
                        </button>

                        <h4 className="modal-title">{reward?.name}</h4>
                        <p>{reward?.description}</p>
                        <span>({reward?.amount} PTS)</span>

                        <Button type="button" onClick={claimHandler}>
                            {languageData?.store_page?.store_box_button?.value || "Claim Now"}
                        </Button>

                        {loading ? (
                            <>
                                <p>
                                    <span
                                        className="load-more mt_10"
                                        style={{
                                            display: loading ? "block" : "none",
                                            textAlign: "center",
                                            margin: 0,
                                            fontSize: "25px",
                                        }}
                                    >
                                        <i className="fad fa-spinner-third fa-spin"></i>
                                    </span>
                                </p>
                            </>
                        ) : (
                            <>
                                {errorMessage && (
                                    <div className="error-msg mt_20 mb-0" style={{ display: errorMessage && "block" }}>
                                        {errorMessage}
                                    </div>
                                )}

                                {successMessage && (
                                    <div className="success-msg mt_20 mb-0" style={{ display: successMessage && "block" }}>
                                        {successMessage}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ClaimRewardModal;
