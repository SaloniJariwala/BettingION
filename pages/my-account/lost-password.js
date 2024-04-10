import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import FrontLayout from "@/components/frontend/FrontLayout";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import Loader from "@/components/admin/UI/Loader";
import { Col, Container, Row } from "react-bootstrap";

const LostPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loggedInUser, setLoggedInUser] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        setLoggedInUser(true);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!email) {
            setErrorMessage(adminLanguageData?.common_add_user_modal_message?.email_required_message?.value);
            return;
        }
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `email=${email}&resetPasswordPageURL=${process.env.NEXT_PUBLIC_SITE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD_PAGE_LINK}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/forgot-password?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
                {
                    email,
                    resetPasswordPageURL: `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.NEXT_PUBLIC_RESET_PASSWORD_PAGE_LINK}`,
                }
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
        <>
            <FrontLayout>
                <div className="inner-page-text">
                    {!loggedInUser && <Loader fullScreen />}
                    <Container>
                        <Row className="m-auto justify-content-center">
                            <Col lg={12} className="text-center">
                                <h2
                                    className="h2_title text_center"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.my_account_page_title?.value,
                                    }}></h2>

                                <form method="post" className="login__form" onSubmit={handleSubmit}>
                                    <p
                                        className="mb_10"
                                        dangerouslySetInnerHTML={{
                                            __html: HrefLocalReplace(
                                                languageData?.lost_password_page?.lost_password_page_content
                                                    ?.value
                                            ),
                                        }}></p>
                                    <div className="form_input_wp">
                                        <label
                                            htmlFor="email"
                                            dangerouslySetInnerHTML={{
                                                __html: languageData?.lost_password_page
                                                    ?.lost_password_page_input_label?.value,
                                            }}></label>

                                        <input
                                            className="form_input"
                                            type="text"
                                            name="text"
                                            id="email"
                                            autoComplete="off"
                                            onChange={(event) => setEmail(event.target.value)}
                                            value={email ?? ""}
                                        />
                                    </div>
                                    <p
                                        className="error-msg mb-3"
                                        style={{ display: errorMessage ? "block" : "none" }}>
                                        {errorMessage}
                                    </p>
                                    <p
                                        className="success-msg"
                                        style={{ display: successMessage ? "block" : "none" }}>
                                        {successMessage}
                                    </p>
                                    <button type="submit" className="sec_btn" value="Reset password">
                                        {languageData?.lost_password_page?.lost_password_page_button?.value}
                                    </button>
                                    <span
                                        className="load-more"
                                        style={{ display: loading ? "inline-block" : "none" }}>
                                        <i className="fad fa-spinner-third fa-spin"></i>
                                    </span>
                                </form>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </FrontLayout>
        </>
    );
};

export default LostPassword;
