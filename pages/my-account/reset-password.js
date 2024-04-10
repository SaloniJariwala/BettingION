import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import sha1 from "sha1";
import FrontLayout from "@/components/frontend/FrontLayout";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Loader from "@/components/admin/UI/Loader";
import { Col, Container, Row } from "react-bootstrap";

const ResetPassword = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const { languageData } = LanguageState();
    const [loggedInUser, setLoggedInUser] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("User")) {
            setLoggedInUser(true);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        const payload = {
            token: router.query.token,
            password: password,
            confirmPassword: cpassword,
        };
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `token=${router.query.token}&password=${password}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/reset-password?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
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

    return (
        <FrontLayout>
            <div className="inner-page-text">
                <section className="login_verification">
                    {loggedInUser && <Loader fullScreen />}
                    <Container>
                        <Row className="m-auto justify-content-center">
                            <Col lg={12} className="text-center">
                                <h2 className="h2_title text_center">
                                    {languageData?.reset_password_page?.reset_password_page_title?.value}
                                </h2>

                                <form method="post" className="login__form" onSubmit={handleSubmit}>
                                    <div className="form_input_wp">
                                        <label htmlFor="user_login">
                                            {
                                                languageData?.reset_password_page
                                                    ?.reset_password_form_new_password_input?.value
                                            }
                                        </label>
                                        <input
                                            className="form_input"
                                            type="password"
                                            name="new_password"
                                            id="new_password"
                                            onChange={(event) => setPassword(event.target.value)}
                                            value={password}
                                        />
                                    </div>
                                    <div className="form_input_wp">
                                        <label htmlFor="user_login">
                                            {
                                                languageData?.reset_password_page
                                                    ?.reset_password_form_confirm_password_input?.value
                                            }
                                        </label>
                                        <input
                                            className="form_input"
                                            type="password"
                                            name="confirm_password"
                                            id="confirm_password"
                                            onChange={(event) => setCpassword(event.target.value)}
                                            value={cpassword}
                                        />
                                    </div>
                                    <p
                                        className="error-msg"
                                        style={{ display: errorMessage ? "block" : "none" }}>
                                        {errorMessage}
                                    </p>
                                    <p
                                        className="success-msg"
                                        style={{ display: successMessage ? "block" : "none" }}>
                                        {successMessage}
                                    </p>
                                    <button type="submit" className="sec_btn mb-3">
                                        {
                                            languageData?.reset_password_page
                                                ?.reset_password_form_button_title?.value
                                        }
                                    </button>
                                    <span
                                        className="load-more"
                                        style={{ display: loading ? "inline-block" : "none" }}>
                                        <i className="fad fa-spinner-third fa-spin"></i>
                                    </span>
                                    <p>
                                        <Link href="/login">
                                            {
                                                languageData?.reset_password_page?.reset_password_login_link
                                                    ?.value
                                            }
                                        </Link>
                                    </p>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </div>
        </FrontLayout>
    );
};

export default ResetPassword;
