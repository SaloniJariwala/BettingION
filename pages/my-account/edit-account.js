/* react-hooks/exhaustive-deps */
import AccountSetting from "@/components/frontend/account/AccountSetting";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Head from "next/head";
import CodeInput from "@/components/frontend/CodeInput";

const EditAccount = (props) => {
    const [userData, setUserData] = useState();
    const [fullname, setFullname] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [pwdErrorMessage, setPwdErrorMessage] = useState("");
    const [pwdSuccessMessage, setPwdSuccessMessage] = useState("");
    const [pwdLoading, setPwdLoading] = useState(false);
    const { languageData } = LanguageState();
    const [twoFaEnable, setTwoFaEnable] = useState(false);
    const [changePassword, setChangePassword] = useState(false);

    useEffect(() => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setFullname(response.data?.data?.fname);
                    setUserData(response.data?.data);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        const payload = {
            remoteId: userData?.remoteId,
            action: "edit-user",
            fname: fullname,
            phone: userData?.phone,
            document: userData?.document,
            settlementType: userData?.settlementType,
            permission: userData?.permission,
            commission: {
                casino: userData?.commission?.casino,
            },
        };
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&action=edit-user`
        );
        setLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
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

    const handleChangePassword = (event) => {
        event.preventDefault();

        if (password.trim().length === 0 || cpassword.trim().length === 0) {
            setPwdErrorMessage(languageData?.edit_account_page?.new_password_required_message?.value);
            return;
        }

        setPwdErrorMessage("");
        setPwdSuccessMessage("");
        const authkeyDeposit = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&authKey=${authkeyDeposit}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (
                        response?.data?.data?.isEnabled2fa &&
                        response?.data?.data?.auth2FAmodule?.changePassword
                    ) {
                        setTwoFaEnable(true);
                    } else {
                        setChangePassword((prev) => !prev);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (password && cpassword) {
            setPwdErrorMessage("");
            setPwdSuccessMessage("");
            const payload = {
                remoteId: userData?.remoteId,
                action: "change-password",
                password: password,
                confirmPassoword: cpassword,
            };
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                    `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&action=change-password`
            );
            setPwdLoading(true);
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/update-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                    payload
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setPwdSuccessMessage(response.data?.message);
                        setPassword("");
                        setCpassword("");
                    } else {
                        setPwdErrorMessage(response.data?.message);
                    }
                })
                .catch((error) => {
                    setPwdErrorMessage(error.message);
                })
                .finally(() => {
                    setPwdLoading(false);
                });
        }
    }, [changePassword]);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountSetting>
                <form onSubmit={handleSubmit}>
                    <h3
                        className="mb_15"
                        dangerouslySetInnerHTML={{
                            __html: languageData?.edit_account_page?.edit_form_personal_info_title?.value,
                        }}></h3>
                    <Row>
                        <Col lg={4}>
                            <div className="form_input_wp">
                                <label
                                    htmlFor="account_full_name"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.edit_account_page
                                            ?.edit_form_personal_info_name_input?.value,
                                    }}></label>
                                <input
                                    type="text"
                                    className="form_input"
                                    name="account_full_name"
                                    id="account_full_name"
                                    autoComplete="given-name"
                                    onChange={(event) => setFullname(event.target.value)}
                                    value={fullname}
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="form_input_wp">
                                <label
                                    htmlFor="account_display_name"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.edit_account_page
                                            ?.edit_form_personal_info_username_input?.value,
                                    }}></label>

                                <input
                                    type="text"
                                    className="form_input"
                                    id="account_display_name"
                                    defaultValue={userData?.username}
                                    readOnly
                                />
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div className="form_input_wp">
                                <label
                                    htmlFor="account_email"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.edit_account_page
                                            ?.edit_form_personal_info_email_input?.value,
                                    }}></label>

                                <input
                                    type="email"
                                    className="form_input"
                                    name="account_email"
                                    id="account_email"
                                    autoComplete="email"
                                    defaultValue={userData?.email}
                                    readOnly
                                />
                            </div>
                        </Col>
                        <Col lg={12}>
                            <p
                                className="error-msg"
                                style={{
                                    display: errorMessage ? "block" : "none",
                                }}>
                                {errorMessage}
                            </p>
                            <p
                                className="success-msg"
                                style={{
                                    display: successMessage ? "block" : "none",
                                }}>
                                {successMessage}
                            </p>

                            <button
                                type="submit"
                                className="sec_btn"
                                name="save_account_details"
                                defaultValue="Save changes">
                                {languageData?.edit_account_page?.edit_form_personal_info_button?.value}
                            </button>

                            <span
                                className="load-more"
                                style={{
                                    display: loading ? "inline-block" : "none",
                                }}>
                                <i className="fad fa-spinner-third fa-spin"></i>
                            </span>
                        </Col>
                    </Row>
                </form>

                <hr />
                {twoFaEnable ? (
                    <div className="login_verification edit_account_security">
                        <CodeInput setChangePassword={setChangePassword} setTwoFaEnable={setTwoFaEnable} />
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleChangePassword}>
                            <Row>
                                <Col lg={12}>
                                    <div className="edit_account_change_password">
                                        <h3
                                            className="mb_15"
                                            dangerouslySetInnerHTML={{
                                                __html: languageData?.edit_account_page
                                                    ?.edit_form_change_password_title?.value,
                                            }}></h3>
                                        <Row>
                                            <Col lg={6}>
                                                <div className="form_input_wp">
                                                    <label
                                                        htmlFor="password_1"
                                                        dangerouslySetInnerHTML={{
                                                            __html: languageData?.edit_account_page
                                                                ?.edit_form_change_password_new_input?.value,
                                                        }}></label>

                                                    <input
                                                        type="password"
                                                        className="form_input"
                                                        name="password_1"
                                                        id="password_1"
                                                        autoComplete="off"
                                                        onChange={(event) => setPassword(event.target.value)}
                                                        value={password}
                                                    />
                                                </div>
                                            </Col>

                                            <Col lg={6}>
                                                <div className="form_input_wp">
                                                    <label
                                                        htmlFor="password_2"
                                                        dangerouslySetInnerHTML={{
                                                            __html: languageData?.edit_account_page
                                                                ?.edit_form_change_password_confirm_input
                                                                ?.value,
                                                        }}></label>
                                                    <input
                                                        type="password"
                                                        className="form_input"
                                                        name="password_2"
                                                        id="password_2"
                                                        autoComplete="off"
                                                        onChange={(event) => setCpassword(event.target.value)}
                                                        value={cpassword}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>

                                <Col lg={12}>
                                    <p
                                        className="error-msg"
                                        style={{
                                            display: pwdErrorMessage ? "block" : "none",
                                        }}>
                                        {pwdErrorMessage}
                                    </p>
                                    <p
                                        className="success-msg"
                                        style={{
                                            display: pwdSuccessMessage ? "block" : "none",
                                        }}>
                                        {pwdSuccessMessage}
                                    </p>
                                </Col>

                                <Col lg={12}>
                                    <button
                                        type="submit"
                                        className="sec_btn"
                                        name="save_account_details"
                                        defaultValue="Save changes">
                                        {
                                            languageData?.edit_account_page?.edit_form_change_password_button
                                                ?.value
                                        }
                                    </button>
                                    <span
                                        className="load-more"
                                        style={{
                                            display: pwdLoading ? "inline-block" : "none",
                                        }}>
                                        <i className="fad fa-spinner-third fa-spin"></i>
                                    </span>
                                </Col>
                            </Row>
                        </form>
                    </>
                )}
            </AccountSetting>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Edit account",
            description: " Edit account",
        },
    };
}

export default EditAccount;
