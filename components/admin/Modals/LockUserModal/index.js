import { useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import AdminModal from "@/components/admin/AdminModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const LockUserModal = ({ show, setShow, userDetails, setFlag }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleClose = () => {
        setShow(false);
        setReason("");
    };

    const handleLockUser = async (event) => {
        event.preventDefault();
        setErrorMessage("");

        const payload = {
            remoteId: userDetails?.remoteId,
            action: "user-lock-action",
            lock: userDetails?.lock === false ? true : false,
            lockReason: reason,
        };

        setLoading(true);

        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userDetails?.remoteId}&action=user-lock-action`
        );

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status) {
                    handleClose();
                    setFlag();
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AdminModal show={show} closeModal={handleClose}>
            <h3 className="h3-title modal_title">
                {adminLanguageData?.lock_user_modal?.lock_modal_title?.value}
            </h3>

            <form className="modal_form user_block_form" onSubmit={handleLockUser}>
                <div className="form_input_wp">
                    <label htmlFor="">
                        {adminLanguageData?.lock_user_modal?.lock_modal_lock_reason_label?.value}
                    </label>
                    <textarea
                        name="user_block_reason"
                        rows="3"
                        placeholder={
                            adminLanguageData?.lock_user_modal?.lock_modal_lock_message_placeholder?.value
                        }
                        className="form_input"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                    />
                </div>
                <div className="modal_footer">
                    <button type="submit" className="sec_btn">
                        {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                    </button>
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third  fa-spin ajax-loader"></i>
                    </span>
                    {errorMessage === 500 ? (
                        <>Something Went Wrong</>
                    ) : (
                        <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                            {errorMessage}
                        </p>
                    )}
                    <input type="hidden" name="user_id" value="116" />
                </div>
            </form>
        </AdminModal>
    );
};

export default LockUserModal;
