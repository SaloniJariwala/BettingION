import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import sha1 from "sha1";
import { Col, Container, Row } from "react-bootstrap";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import { BalanceState } from "@/context/BalanceProvider";
import Head from "next/head";
import FrontLayout from "@/components/frontend/FrontLayout";
import Button from "@/components/frontend/UI/Button";
import CodeInput from "@/components/frontend/CodeInput";
import Loader from "@/components/admin/UI/Loader";

const Login = (props) => {
    const router = useRouter();
    const { updateBalance } = BalanceState();
    const { languageData } = LanguageState();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [loginData, setLoginData] = useState();
    const [user, setUser] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("User")) {
            router.push("/");
        } else {
            setUser(true);
        }
    }, []);

    const check2FaAuth = (data) => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${data?.data?.remoteId}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${data?.data?.remoteId}&hide=false&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response?.data?.data?.isEnabled2fa && response?.data?.data?.auth2FAmodule?.login) {
                        setIsEnabled(true);
                    } else if (response.data?.data?.lock) {
                        setErrorMessage(
                            "Your account has been locked. Please contact administrator for the further information."
                        );
                    } else {
                        router.push("/");
                        localStorage.setItem("User", JSON.stringify(data?.data));
                        localStorage.setItem("currency", JSON.stringify(data?.data?.currencyObj));
                        updateBalance();
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        if (!username && !password) {
            setErrorMessage(languageData?.login_page?.username_password_missing?.value);
            return;
        } else if (!username) {
            if (!password) {
                setErrorMessage(languageData?.login_page?.username_password_missing?.value);
            } else {
                setErrorMessage(languageData?.login_page?.username_missing_message?.value);
            }
            return;
        } else if (!password) {
            setErrorMessage(languageData?.login_page?.password_missing_message?.value);
            return;
        }
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}&password=${password}`);
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/login-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
                {
                    username,
                    password,
                }
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.lock) {
                        setErrorMessage(languageData?.login_page?.account_lock_message?.value);
                        return;
                    } else {
                        check2FaAuth(response.data);
                        setLoginData(response.data?.data);
                    }
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
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                {!user ? (
                    <Loader fullscreen />
                ) : (
                    <div className="inner-page-text">
                        <Container>
                            {isEnabled ? (
                                <div className="login_verification">
                                    <CodeInput loginData={loginData} setIsEnabled={setIsEnabled} />
                                </div>
                            ) : (
                                <Row className="m-auto justify-content-center">
                                    <Col lg={12} className="text-center">
                                        <h2
                                            className="h2_title text_center"
                                            dangerouslySetInnerHTML={{
                                                __html: languageData?.login_page?.login?.value,
                                            }}></h2>

                                        <form
                                            method="post"
                                            className="login__form"
                                            onSubmit={handleFormSubmit}>
                                            <div className="form_input_wp">
                                                <label
                                                    htmlFor="user_login"
                                                    dangerouslySetInnerHTML={{
                                                        __html: languageData?.login_page?.username?.value,
                                                    }}></label>
                                                <input
                                                    name="username"
                                                    type="text"
                                                    onChange={(event) => setUsername(event.target.value)}
                                                    value={username ?? ""}
                                                    className="form_input"
                                                />
                                            </div>
                                            <div className="form_input_wp">
                                                <label
                                                    htmlFor="password"
                                                    dangerouslySetInnerHTML={{
                                                        __html: languageData?.login_page?.password?.value,
                                                    }}></label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    onChange={(event) => setPassword(event.target.value)}
                                                    value={password ?? ""}
                                                    className="form_input"
                                                />
                                            </div>
                                            <p
                                                className="error-msg mb_15"
                                                style={{ display: errorMessage ? "block" : "none" }}>
                                                {errorMessage}
                                            </p>
                                            <div className="form_submit pb-3">
                                                <Button type="submit" className="sec_btn">
                                                    {languageData?.login_page?.login?.value}
                                                </Button>
                                                <span
                                                    className="load-more"
                                                    style={{ display: loading ? "inline-block" : "none" }}>
                                                    <i className="fad fa-spinner-third fa-spin"></i>
                                                </span>
                                            </div>
                                            <p className="m-0">
                                                <Link href="/my-account/lost-password">
                                                    {languageData?.login_page?.lost_password_link?.value}
                                                </Link>
                                            </p>
                                            <p
                                                className="register-page-link m-0"
                                                dangerouslySetInnerHTML={{
                                                    __html: HrefLocalReplace(
                                                        languageData?.login_page?.registration_link_title
                                                            ?.value
                                                    ),
                                                }}></p>
                                        </form>
                                    </Col>
                                </Row>
                            )}
                        </Container>
                    </div>
                )}
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Login",
            description: "Login",
        },
    };
}

export default Login;
