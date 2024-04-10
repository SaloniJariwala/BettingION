import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import axios from "axios";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Head from "next/head";
import { useRouter } from "next/router";

const moduleFor = (module) => {
    return module==="admin"?"admin-":""
}

const TranslateSite = (props) => {
    const { updateLanguage } = LanguageState();
    const [pageMenu, setPageMenu] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [pageKeys, setPageKeys] = useState();
    const [page, setPage] = useState("");
    const [language, setLanguage] = useState("en");
    const [newText, setNewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);
    const [module, setModule] = useState("front");

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    useEffect(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/${moduleFor(module)}translation?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&languageCode=en&pageKey=`
            )
            .then((response) => {
                setPageMenu(Object.keys(response.data?.data?.text));
                setPage(Object.keys(response.data?.data?.text)[0]);
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, [module]);

    useEffect(() => {
        if (page) {
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/${moduleFor(module)}translation?token=${
                        process.env.NEXT_PUBLIC_TOKEN
                    }&casino=${process.env.NEXT_PUBLIC_CASINO}&languageCode=${
                        language === "" ? "en" : language
                    }&pageKey=${page === "" ? "footer" : page}`
                )
                .then((response) => {
                    setPageKeys(response.data?.data);
                    setNewText(response.data?.data);
                })
                .catch((error) => {
                    setErrorMessage(error.message);
                });
        }
    }, [page, language]);

    const renderMenuText = (str) => {
        const newStr = str?.replaceAll("_", " ");
        const res = newStr.charAt(0).toUpperCase() + newStr.slice(1);
        return res;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/${moduleFor(module)}update-translation?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&languageCode=${language}&pageKey=${page}`,
                { content: newText }
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Translation updated successfully");
                    updateLanguage();
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
            <AdminLayout>
                <section className="translate_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={12}>
                                <div className="title">
                                    <Title>Translations</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="use_main_form">
                        {!isNotAccessible ? (
                            <Col lg={12}>
                                <div className="use_main_form">
                                    <p className="error-msg" style={{ display: "block" }}>
                                        {
                                            adminLanguageData?.common_restriction_message
                                                ?.page_not_accessible_message?.value
                                        }
                                    </p>
                                </div>
                            </Col>
                        ) : (
                            <>
                                <form className="lang_translate_form" onSubmit={handleFormSubmit}>
                                        <Row>
                                      
                                        <Col lg={8} className="m-auto">
                                                <Row>
                                                <Col lg={4}>
                                            <div className="form_input_wp form-element">
                                                <label>Select Translations For</label>
                                                <div className="position-relative">
                                                    <div className="position-relative">
                                                        <select
                                                            name="userrole"
                                                            className="form_input"
                                                            defaultValue={"front"}
                                                            onChange={(event) =>
                                                                setModule(event.target.value)
                                                            }>
                                                            <option value="admin">Admin</option>
                                                            <option value="front">Front</option>
                                                        </select>
                                                        <i className="far fa-angle-down"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                                <Col lg={4}>
                                                    <div className="form_input_wp form-element">
                                                        <label>Select Page</label>
                                                        <div className="position-relative">
                                                            <i className="far fa-file"></i>
                                                            <div className="position-relative">
                                                                <select
                                                                    name="userrole"
                                                                    className="form_input"
                                                                    onChange={(event) =>
                                                                        setPage(event.target.value)
                                                                    }>
                                                                    {pageMenu?.map((page, index) => (
                                                                        <option value={page} key={index}>
                                                                            {renderMenuText(page)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <i className="far fa-angle-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>

                                                <Col lg={4}>
                                                    <div className="form_input_wp form-element">
                                                        <label>Select Language</label>
                                                        <div className="position-relative">
                                                            <i className="fal fa-language"></i>
                                                            <div className="position-relative">
                                                                <select
                                                                    name="userrole"
                                                                    className="form_input"
                                                                    defaultValue={"English"}
                                                                    onChange={(event) =>
                                                                        setLanguage(event.target.value)
                                                                    }>
                                                                    <option value="en">English</option>
                                                                    <option value="es">Spanish</option>
                                                                </select>
                                                                <i className="far fa-angle-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>

                                    {pageKeys ? (
                                        <>
                                            <div className="lang_translate_form_field">
                                                <Row>
                                                    <Col lg={12}>
                                                        {Object.keys(pageKeys).map((key) => {
                                                            const value = newText[key]?.value;
                                                            let name;
                                                            Object.entries(newText).forEach((item) => {
                                                                if (item[1]?.label === pageKeys[key]?.label) {
                                                                    name = item[0];
                                                                    return;
                                                                }
                                                            });
                                                            return (
                                                                <div
                                                                    className="form_input_wp side_input"
                                                                    key={key}>
                                                                    <label htmlFor={pageKeys[key]?.label}>
                                                                        {pageKeys[key]?.label}
                                                                    </label>
                                                                    <textarea
                                                                        name={name}
                                                                        id=""
                                                                        cols="30"
                                                                        rows="5"
                                                                        value={value}
                                                                        onChange={(event) => {
                                                                            const old = {
                                                                                ...newText,
                                                                                [name]: {
                                                                                    label: pageKeys[key]
                                                                                        ?.label,
                                                                                    value: event.target.value,
                                                                                },
                                                                            };
                                                                            setNewText(old);
                                                                        }}
                                                                        className="form_input"></textarea>
                                                                </div>
                                                            );
                                                        })}
                                                    </Col>
                                                </Row>
                                            </div>

                                            <Row>
                                                <Col lg={10}>
                                                    {successMessage && (
                                                        <p
                                                            className="success-msg"
                                                            style={{
                                                                display: successMessage ? "block" : "none",
                                                            }}>
                                                            {successMessage}
                                                        </p>
                                                    )}
                                                </Col>
                                                <Col lg={2}>
                                                    <div className="submit_btn">
                                                        <span
                                                            className="load-more"
                                                            style={{
                                                                display: loading ? "inline-block" : "none",
                                                            }}>
                                                            <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                        </span>
                                                        <button
                                                            type="submit"
                                                            className="sec_btn"
                                                            style={{ width: "auto" }}>
                                                            Update
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    ) : (
                                        errorMessage && (
                                            <p
                                                className="error-msg"
                                                style={{
                                                    display: errorMessage ? "block" : "none",
                                                }}>
                                                {errorMessage}
                                            </p>
                                        )
                                    )}
                                </form>
                            </>
                        )}
                    </div>
                </section>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Translate site",
            description: "Translate site",
        },
    };
}

export default TranslateSite;
