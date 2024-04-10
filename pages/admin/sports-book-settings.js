import { useEffect, useState } from "react";
import Head from "next/head";
import axios from "axios";
import sha1 from "sha1";
import Title from "@/components/admin/UI/Title";
import AdminLayout from "@/components/admin/AdminLayout";
import { Col, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const SportBookSettings = ({ props }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [filterType, setFilterType] = useState("");
    const [sucessMessage, setSucessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [layoutType, setLayOutType] = useState("");
    const [sportData, setSportsData] = useState([]);
    const [sportsBookData, setSportsBookData] = useState([]);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSucessMessage("");

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setUpdateLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/sports-layout-update?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&option=${filterType}&layoutValue=${layoutType}`
            )
            .then((response) => {
                if (response.data.status === 200) {
                    setSucessMessage(adminLanguageData?.sports_book_settings_page?.sports_book_settings_success?.value);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.data?.message);
            })
            .finally(() => {
                setUpdateLoading(false);
            });
    };

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/sports-layout?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`)
            .then((response) => {
                if (response?.data?.status === 200) {
                    const data = response.data.data;
                    const OddTypeArray = Object.entries(data?.oddsType).map(([key, value]) => ({
                        key,
                        value,
                    }));
                    const layOutArray = Object.entries(data?.sportsBookLayout).map(([key, value]) => ({
                        key,
                        value,
                    }));
                    setSportsData(OddTypeArray);
                    setSportsBookData(layOutArray);
                } else {
                    setErrorMessage(response?.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.data?.message);
            })
            .finally();
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props?.title} />
                <meta name="description" content={props?.description} />
            </Head>
            <AdminLayout>
                <div className="user_main_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>{adminLanguageData?.sports_book_settings_page?.sports_book_settings_page_title?.value}</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="sport_report_table_wrapper">
                            <h1 className="form-check-label">{adminLanguageData?.sports_book_settings_page?.odds_type_label?.value}</h1>
                            <div className="form_checkbox_wp">
                                {sportData?.map((data) => {
                                    if (filterType === "" && data.value) setFilterType(data.key);
                                    return (
                                        <>
                                            <div className="form_checkbox">
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="odds_type_radio"
                                                        value={data.key}
                                                        className="form-check-input"
                                                        id={data.key}
                                                        checked={filterType ? data.key === filterType : data.value}
                                                        onChange={(event) => setFilterType(event.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor={data.key}>
                                                        {data.key}
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>

                            <hr />

                            <h1 className="form-check-label">{adminLanguageData?.sports_book_settings_page?.sports_book_layout_label?.value}</h1>
                            <div className="form_checkbox_wp">
                                {sportsBookData?.map((data) => {
                                    if (layoutType === "" && data.value) setLayOutType(data.key);
                                    return (
                                        <>
                                            <div className="form_checkbox">
                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="sports_book_layout_radio"
                                                        value={data.key}
                                                        className="form-check-input"
                                                        id={data.key}
                                                        checked={layoutType ? data.key === layoutType : data.value}
                                                        onChange={(event) => setLayOutType(event.target.value)}
                                                    />
                                                    <label className="form-check-label" htmlFor={data.key}>
                                                        {data.key}
                                                    </label>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                            </div>
                        </div>

                        {updateLoading ? (
                            <>
                                <span
                                    className="load-more mt_20"
                                    style={{
                                        display: updateLoading ? "block" : "none",
                                        margin: 0,
                                        fontSize: "25px",
                                    }}
                                >
                                    <i className="fad fa-spinner-third fa-spin"></i>
                                </span>
                            </>
                        ) : (
                            <>
                                <p className="error-msg mt_20" style={{ display: errorMessage && "block" }}>
                                    {errorMessage}
                                </p>
                                <p className="success-msg mt_20" style={{ display: sucessMessage && "block" }}>
                                    {sucessMessage}
                                </p>
                            </>
                        )}

                        <div className="submit_btn" style={{ marginTop: "25px" }}>
                            <button type="submit" className="sec_btn">
                                {adminLanguageData?.sports_book_settings_page?.update_button?.value}
                            </button>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Sport Book Settings",
            description: "Sport Book Settings",
        },
    };
}
export default SportBookSettings;
