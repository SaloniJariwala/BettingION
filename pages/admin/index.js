/* eslint-disable react-hooks/exhaustive-deps */
import { Container, Row, Col } from "react-bootstrap";
import LongInImage from "@/assets/admin/images/slot-machine.jpg";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "bootstrap/dist/css/bootstrap.min.css";
import sha1 from "sha1";
import Loader from "@/components/admin/UI/Loader";
import { BalanceState } from "@/context/BalanceProvider";
import Head from "next/head";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Login = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const { updateBalance } = BalanceState();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const [login, setLogin] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (user) {
            setLogin(true);
            if (user?.accountType === "player") {
                router.push("/");
            } else {
                router.push("/admin/dashboard");
            }
        } else {
            setLogin(false);
        }
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}&password=${password}`);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/login-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                {
                    username,
                    password,
                }
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.accountType === "player") {
                        setError("Access denied");
                    } else if (response.data?.data?.lock) {
                        setError(
                            "Your account has been locked. Please contact administrator for the further information."
                        );
                    } else {
                        updateBalance();
                        localStorage.setItem("User", JSON.stringify(response.data?.data));
                        router.push("/admin/dashboard");
                    }
                } else {
                    setError(response.data?.message);
                }
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            {login ? (
                <Loader />
            ) : (
                <section className="login__page">
                    <Container fluid>
                        <Row>
                            <Col lg={5}>
                                <div className="sec_wp">
                                    <div className="login__form_wp">
                                        <form
                                            className="login__form"
                                            method="post"
                                            onSubmit={(event) => handleSubmit(event)}>
                                            <h1 className="h1_title">
                                                {adminLanguageData?.login_page?.login_page_title?.value}
                                            </h1>
                                            <p className="error-msg"></p>
                                            <div className="form_input_wp">
                                                <i className="fal fa-user" />
                                                <input
                                                    name="username"
                                                    type="text"
                                                    className="form_input"
                                                    onChange={(event) => setUsername(event.target.value)}
                                                    value={username}
                                                    placeholder={
                                                        adminLanguageData?.login_page?.username_placeholder
                                                            ?.value
                                                    }
                                                />
                                            </div>
                                            <div className="form_input_wp">
                                                <i
                                                    onClick={() => setShow(!show)}
                                                    className={show ? "fal fa-eye-slash" : "fal fa-eye"}
                                                />
                                                <input
                                                    name="password"
                                                    type={show ? "text" : "password"}
                                                    className="form_input"
                                                    onChange={(event) => setPassword(event.target.value)}
                                                    value={password}
                                                    placeholder={
                                                        adminLanguageData?.login_page?.password_placeholder
                                                            ?.value
                                                    }
                                                />
                                            </div>

                                            {error && (
                                                <div
                                                    className="error-msg"
                                                    style={{ display: error && "block" }}>
                                                    {error}
                                                </div>
                                            )}

                                            <div className="form_submit">
                                                <button type="submit" name="login" className="sec_btn sm_btn">
                                                    {adminLanguageData?.login_page?.login_button?.value}
                                                </button>
                                                <span
                                                    className="load-more"
                                                    style={{
                                                        display: isLoading ? "inline-block" : "none",
                                                    }}>
                                                    <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </Col>

                            <Col lg={7}>
                                <div className="login_form_bg back_img">
                                    <Image src={LongInImage} fill objectFit="cover" alt="Login Background" />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            )}
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
