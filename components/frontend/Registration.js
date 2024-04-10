import { useState } from "react";
import Button from "@/components/frontend/UI/Button";
import axios from "axios";
import { useRouter } from "next/router";
import { Col, Container, Row } from "react-bootstrap";
import ReCAPTCHA from "react-google-recaptcha";
import { FormProvider, useForm } from "react-hook-form";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import AsyncSelect from "react-select/async";
import { BalanceState } from "@/context/BalanceProvider";

const referralUserTypes = ["administrator", "super-agent", "agent"];

const Registration = () => {
    const router = useRouter();
    const methods = useForm();
    const {
        formState: { errors },
    } = methods;
    const { languageData } = LanguageState();

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [input, setInput] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);

    const handleInputChange = (newValue) => {
        setInput(newValue);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const onChange = (value) => {
        if (value) {
            setVerified(true);
        }
    };

    const loadOptions = async (input) => {
        let res;
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${input}`);
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${input}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    res = [
                        {
                            label: `${response.data?.data?.username} (${response.data?.data?.email})`,
                            value: response.data?.data?.remoteId,
                            accountType: response.data?.data?.accountType,
                        },
                    ];
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
        return res;
    };

    const handleSubmit = async () => {
        setErrorMessage("");
        setSuccessMessage("");
        if (!verified) {
            alert("Check the captcha box");
            return;
        }
        if (methods.getValues("cpassword") !== methods.getValues("password")) {
            methods.setError("cpassword", {
                type: "custom",
                message: "Password and confirm password must be same",
            });
            return;
        }
        let payload = {
            email: methods.getValues("email"),
            username: methods.getValues("username"),
            password: methods.getValues("password"),
            fatherId: router,
            permission: ["casino"],
            settlementType: "week",
        };
        if (router.query) {
            payload = {
                ...payload,
                fatherId: router.query.user,
                referral: router.query.referral,
            };
        }

        if (
            router.pathname !== "/refer" &&
            referralUserTypes.includes(selectedOption?.accountType) &&
            selectedOption?.value
        ) {
            payload.fatherId = selectedOption?.value;
        }

        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `email=${methods.getValues("email")}&username=${methods.getValues("username")}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/create-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("User registered successfully");
                    if (router.query) {
                        localStorage.removeItem("User");
                        localStorage.removeItem("currency");
                    }
                    setTimeout(() => {
                        router.push("/login");
                    }, 7000);
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
        <section className="register-section">
            <Container>
                <Row className="m-auto justify-content-center">
                    <Col lg={6} className="text-center">
                        <h2
                            className="h2_title text_center"
                            dangerouslySetInnerHTML={{
                                __html: languageData?.register_page?.account_creation?.value,
                            }}></h2>
                        <FormProvider {...methods}>
                            <form
                                method="post"
                                className="login__form"
                                onSubmit={methods.handleSubmit(handleSubmit)}>
                                {successMessage ? (
                                    <p className="succuss-msg">{successMessage}</p>
                                ) : (
                                    <>
                                        <div className="form_input_wp">
                                            <label
                                                htmlFor="Username"
                                                dangerouslySetInnerHTML={{
                                                    __html: languageData?.register_page?.username?.value,
                                                }}></label>
                                            <input
                                                type="text"
                                                name="username"
                                                placeholder={
                                                    languageData?.register_page?.username_placeholder?.value
                                                }
                                                className="form_input"
                                                {...methods.register("username", {
                                                    required:
                                                        languageData?.register_page
                                                            ?.username_placeholder_required?.value,
                                                })}
                                            />
                                            {errors?.username && (
                                                <p className="error-msg">{errors?.username?.message}</p>
                                            )}
                                        </div>
                                        <div className="form_input_wp">
                                            <label
                                                htmlFor="Email"
                                                dangerouslySetInnerHTML={{
                                                    __html: languageData?.register_page?.email?.value,
                                                }}></label>

                                            <input
                                                type="text"
                                                name="email"
                                                placeholder={
                                                    languageData?.register_page?.email_placeholder?.value
                                                }
                                                className="form_input "
                                                {...methods.register("email", {
                                                    required:
                                                        languageData?.register_page
                                                            ?.email_placeholder_required?.value,
                                                })}
                                            />
                                            {errors?.email && (
                                                <p className="error-msg">{errors?.email?.message}</p>
                                            )}
                                        </div>
                                        <div className="form_input_wp">
                                            <label
                                                htmlFor="Password"
                                                dangerouslySetInnerHTML={{
                                                    __html: languageData?.register_page?.password?.value,
                                                }}></label>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder={
                                                    languageData?.register_page?.password_placeholder?.value
                                                }
                                                className="form_input"
                                                {...methods.register("password", {
                                                    required:
                                                        languageData?.register_page
                                                            ?.password_placeholder_required?.value,
                                                    minLength: {
                                                        value: 3,
                                                        message:
                                                            languageData?.register_page?.password_message
                                                                ?.value,
                                                    },
                                                })}
                                            />
                                            {errors?.password && (
                                                <p className="error-msg">{errors?.password?.message}</p>
                                            )}
                                        </div>
                                        <div className="form_input_wp">
                                            <label
                                                htmlFor="Password"
                                                dangerouslySetInnerHTML={{
                                                    __html: languageData?.register_page?.confirm_password
                                                        ?.value,
                                                }}></label>
                                            <input
                                                type="password"
                                                name="password2"
                                                placeholder={
                                                    languageData?.register_page?.confirm_password_placeholder
                                                        ?.value
                                                }
                                                className="form_input"
                                                {...methods.register("cpassword", {
                                                    required:
                                                        languageData?.register_page
                                                            ?.confirm_password_placeholder_message?.value,
                                                })}
                                            />
                                            {errors?.cpassword && (
                                                <p className="error-msg">{errors?.cpassword?.message}</p>
                                            )}
                                        </div>
                                        {router.pathname !== "/refer" && (
                                            <div className="form_input_wp">
                                                <label htmlFor="referral_user">
                                                    {languageData?.register_page?.referral_user?.value}
                                                </label>
                                                <AsyncSelect
                                                    className="select_box"
                                                    classNamePrefix="react-select"
                                                    cacheOptions
                                                    inputValue={input}
                                                    loadOptions={loadOptions}
                                                    onInputChange={handleInputChange}
                                                    isLoading={loading}
                                                    labelKey="label"
                                                    valueKey="value"
                                                    placeholder={
                                                        languageData?.register_page?.search_username?.value ||
                                                        "search username..."
                                                    }
                                                    onChange={handleSelectChange}
                                                    value={selectedOption}
                                                    required
                                                    theme={(theme) => ({
                                                        ...theme,
                                                        colors: {
                                                            ...theme.colors,
                                                            primary: "#e150e7",
                                                            primary25: "#e150e7",
                                                            neutral0: "#161a23",
                                                        },
                                                    })}
                                                />
                                                {selectedOption &&
                                                    !referralUserTypes.includes(
                                                        selectedOption?.accountType
                                                    ) && (
                                                        <p className="error-msg">
                                                            {"Player can not refer users"}
                                                        </p>
                                                    )}
                                            </div>
                                        )}

                                        <div className="form_input_wp">
                                            <div className="register_checkbox">
                                                <div className="form_checkbox">
                                                    <input
                                                        type="checkbox"
                                                        defaultValue="1"
                                                        name="consent"
                                                        id="consent"
                                                        {...methods.register("tc", {
                                                            required:
                                                                languageData?.register_page
                                                                    ?.terms_checkbox_required?.value,
                                                        })}
                                                    />
                                                    <label
                                                        className="mb-0"
                                                        htmlFor="consent"
                                                        dangerouslySetInnerHTML={{
                                                            __html: HrefLocalReplace(
                                                                languageData?.register_page
                                                                    ?.terms_and_conditions?.value
                                                            ),
                                                        }}></label>
                                                </div>
                                            </div>
                                        </div>
                                        {errors?.tc && <p className="error-msg">{errors?.tc?.message}</p>}
                                        <ReCAPTCHA
                                            sitekey={process.env.NEXT_PUBLIC_RECAPTHA_SITE_KEY}
                                            onChange={onChange}
                                            className="mb-3"
                                        />
                                        <p
                                            className="error-msg"
                                            style={{
                                                display: errorMessage ? "block" : "none",
                                            }}>
                                            {errorMessage}
                                        </p>
                                        <div className="login-submit mb-3">
                                            <Button type="submit">
                                                {languageData?.register_page?.sign_up?.value}
                                            </Button>
                                            <span
                                                className="load-more"
                                                style={{
                                                    display: loading ? "inline-block" : "none",
                                                }}>
                                                <i className="fad fa-spinner-third fa-spin"></i>
                                            </span>
                                        </div>

                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: HrefLocalReplace(
                                                    languageData?.register_page?.login_link?.value
                                                ),
                                            }}></p>
                                    </>
                                )}
                            </form>
                        </FormProvider>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Registration;
