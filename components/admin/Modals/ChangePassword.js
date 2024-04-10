import axios from "axios";
import sha1 from "sha1";
import React, { useState } from "react";
import AdminModal from "../AdminModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const ChangePassword = ({ show, setShow, userId }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [pwd, setPwd] = useState();
    const [conPwd, setConPwd] = useState();
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConPassword, setShowConPassword] = useState(false);

    const handleChangePassword = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        const payload = {
            remoteId: userId,
            action: "change-password",
            password: pwd,
            confirmPassoword: conPwd,
        };
        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "multipart/form-data",
        };

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userId}&action=change-password`);
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${userId})}&authKey=${authkey}
                `,
                payload,
                {
                    headers,
                }
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccess(response.data?.message);
                } else {
                    setError(response.data?.message);
                }
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleClose = () => {
        setShow(false);
        setPwd("");
        setConPwd("");
        setError("");
        setSuccess("");
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
            <h3 className="h3-title modal_title">
                {adminLanguageData?.header?.header_change_password_modal_title?.value}
            </h3>
            <form
                className="modal_form user_change_pwd_form"
                method="post"
                onSubmit={(event) => handleChangePassword(event)}>
                <div className="form_input_wp">
                    <i
                        className={!showPassword ? "fal fa-eye-slash" : "fal fa-eye"}
                        onClick={() => setShowPassword(!showPassword)}></i>
                    <input
                        name="new_password"
                        type={!showPassword ? "password" : "text"}
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        className="form_input"
                        placeholder={
                            adminLanguageData?.header?.change_password_modal_new_password_placeholder?.value
                        }
                    />
                </div>
                <div className="form_input_wp">
                    <i
                        className={!showConPassword ? "fal fa-eye-slash" : "fal fa-eye"}
                        onClick={() => setShowConPassword(!showConPassword)}></i>
                    <input
                        name="confirm_password"
                        type={!showConPassword ? "password" : "text"}
                        value={conPwd}
                        onChange={(e) => setConPwd(e.target.value)}
                        className="form_input"
                        placeholder={
                            adminLanguageData?.header?.change_password_modal_confirm_password_placeholder
                                ?.value
                        }
                    />
                </div>

                <div className="modal_footer">
                    <button type="submit" className="sec_btn">
                        {adminLanguageData?.header?.change_password_modal_submit_button?.value}
                    </button>
                    <input type="hidden" value="103" name="user_id" />
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                    </span>
                </div>
                <p className="error-msg" style={{ display: error && "block" }}>
                    {error}
                </p>
                <p className="success-msg" style={{ display: success && "block" }}>
                    {success}
                </p>
            </form>
        </AdminModal>
    );
};

export default ChangePassword;
