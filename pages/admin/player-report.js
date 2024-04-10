/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import axios from "axios";
import Loader from "@/components/admin/UI/Loader";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { getDateAndTime } from "@/utils/getDateAndTime";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const PlayerReport = (props) => {
    const methods = useForm();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [loading, setLoading] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [error, setError] = useState(false);
    const [username, setUsername] = useState();
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState();

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    createTheme(
        "solarized",
        {
            text: {
                primary: "#ffffff",
                secondary: "#ffffff",
            },
            background: {
                default: "#0B0C27",
            },
            context: {
                background: "#bd57fb",
                text: "#FFFFFF",
            },
            divider: {
                default: "transparent",
            },
        },
        "dark"
    );

    const columns = [
        {
            name: adminLanguageData?.player_report_page?.table_cell_category?.value,
            minWidth: "200px",
            grow: 1,
            selector: (row) => row.category,
        },
        {
            name: adminLanguageData?.player_report_page?.table_cell_bets?.value,
            grow: 1,
            selector: (row) => {
                if (typeof row.bets === "number") {
                    return renderAmountWithCurrency(row.bets, userDefaultCurrency?.currencyAbrv);
                }
            },
        },
        {
            name: adminLanguageData?.player_report_page?.table_cell_win?.value,
            grow: 1,
            selector: (row) => {
                if (typeof row.credits === "number") {
                    return renderAmountWithCurrency(row.credits, userDefaultCurrency?.currencyAbrv);
                }
            },
        },
        {
            name: adminLanguageData?.player_report_page?.table_cell_netwin?.value,
            grow: 1,
            minWidth: "150px",
            selector: (row) => {
                if (typeof row.ggr === "number") {
                    return renderAmountWithCurrency(row.ggr, userDefaultCurrency?.currencyAbrv);
                }
            },
        },
        {
            name: adminLanguageData?.player_report_page?.table_cell_rakes?.value,
            grow: 1,
            selector: (row) => {
                if (typeof row.rakes === "number") {
                    return renderAmountWithCurrency(row.rakes, userDefaultCurrency?.currencyAbrv);
                }
            },
        },
    ];

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    const gettingDates = () => {
        let startDate = methods.getValues("startDate");
        let startTime = methods.getValues("startTime");
        let endDate = methods.getValues("endDate");
        let endTime = methods.getValues("endTime");
        if (!startDate) {
            startDate = new Date();
        }
        if (!startTime) {
            startTime = new Date(new Date().setHours(0, 0, 0));
        }
        if (!endDate) {
            endDate = new Date();
        }
        if (!endTime) {
            endTime = new Date(new Date().setHours(11, 59, 59));
        }
        const startDateTime = `${startDate?.getFullYear()}-${startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)}-${
            startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()
        }T${startTime?.getHours() > 9 ? startTime?.getHours() : "0" + startTime?.getHours()}:${startTime?.getMinutes() > 9 ? startTime?.getMinutes() : "0" + startTime?.getMinutes()}:${
            startTime?.getSeconds() > 9 ? startTime?.getSeconds() : "0" + startTime?.getSeconds()
        }Z`;
        const endDateTime = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)}-${
            endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()
        }T${endTime?.getHours() > 9 ? endTime?.getHours() : "0" + endTime?.getHours()}:${endTime?.getMinutes() > 9 ? endTime?.getMinutes() : "0" + endTime?.getMinutes()}:${
            endTime?.getSeconds() > 9 ? endTime?.getSeconds() : "0" + endTime?.getSeconds()
        }Z`;
        return {
            startDateTime,
            endDateTime,
        };
    };

    const getData = async () => {
        const dates = gettingDates();
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/casino-admin-reports?action=global-player-report&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&remote_id=${userId || ""}&start=${dates.startDateTime}&end=${dates.endDateTime}`
            )
            .then((response) => {
                if (response.data?.data) {
                    const emptyObj = {
                        category: "",
                        bets: "",
                        credits: "",
                        ggr: "",
                        rakes: "",
                    };
                    const newArr = [
                        {
                            category: "Loads and Withdrawals",
                            bets: response.data?.loadsAndWithdraw?.bets,
                            credits: response.data?.loadsAndWithdraw?.credits,
                            ggr: response.data?.loadsAndWithdraw?.ggr,
                            rakes: "",
                        },
                        {
                            category: "Player Account Balance",
                            bets: "",
                            credits: "",
                            ggr: response.data?.balance,
                            rakes: "",
                        },
                        {
                            category: <span className="player-data-last-update">Last update : {getDateAndTime(response.data?.updatedTime.slice(0, -5))}</span>,
                        },
                    ];

                    const arr = [...response.data?.data, emptyObj, ...newArr];

                    setData(arr);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.response);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (userId) {
            getData();
        }
    }, [userId]);

    const setDateAndTime = (startDate, startTime, endDate, endTime) => {
        methods.setValue("startDate", startDate);
        methods.setValue("startTime", startTime);
        methods.setValue("endDate", endDate);
        methods.setValue("endTime", endTime);
    };

    const filterOnchange = async (value, remoteId) => {
        if (value === "today") {
            const startDate = new Date();
            const startTime = new Date(new Date().setHours(0, 0, 0));
            const endDate = new Date();
            const endTime = new Date(new Date().setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
        } else if (value === "yesterday") {
            const startDate = new Date(Date.now() - 86400000);
            const startTime = new Date(new Date(Date.now() - 86400000).setHours(0, 0, 0));
            const endDate = new Date(Date.now() - 86400000);
            const endTime = new Date(new Date(Date.now() - 86400000).setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
            return;
        } else if (value === "thisWeek") {
            var curr = new Date();
            const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            const startDate = new Date(curr.setDate(first + 1));
            const startTime = new Date(new Date(curr.setDate(first + 1)).setHours(0, 0, 0));
            const endDate = new Date(curr.setDate(first + 7));
            const endTime = new Date(new Date(curr.setDate(first + 7)).setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            setUserId(remoteId);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
            return;
        } else if (value === "lastWeek") {
            const d = new Date();
            const end = d.setTime(d.getTime() - (d.getDay() ? d.getDay() : 7) * 24 * 60 * 60 * 1000);
            const start = d.setTime(d.getTime() - 6 * 24 * 60 * 60 * 1000);
            const startDate = new Date(start);
            const startTime = new Date(new Date(start).setHours(0, 0, 0));
            const endDate = new Date(end);
            const endTime = new Date(new Date(end).setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
            return;
        } else if (value === "thisMonth") {
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const startDate = firstDay;
            const startTime = new Date(firstDay.setHours(0, 0, 0));
            const endDate = lastDay;
            const endTime = new Date(lastDay.setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
            return;
        } else {
            const date = new Date();
            const firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            const lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
            const startDate = firstDay;
            const startTime = new Date(firstDay.setHours(0, 0, 0));
            const endDate = lastDay;
            const endTime = new Date(lastDay.setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            if (userId !== remoteId) {
                setUserId(remoteId);
            } else {
                await getData();
            }
            return;
        }
    };

    const handleChange = async (event) => {
        setErrorMessage("");
        setError(false);
        if (!username) {
            setError(true);
            return;
        }
        setLoading(true);
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        const value = event.target.value;
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}
                `
            )
            .then(async (response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.remoteId) {
                        filterOnchange(value, response.data?.data?.remoteId);
                    } else {
                        filterOnchange(value);
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

    const handleDataSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setErrorMessage("");
        if (!username) {
            setError(true);
            return;
        }
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}
                `
            )
            .then(async (response) => {
                if (username) {
                    if (response.data?.status === 200) {
                        if (response.data?.data?.remoteId === userId) {
                            await getData();
                        } else {
                            setUserId(response.data?.data?.remoteId);
                        }
                    } else {
                        setErrorMessage(response.data?.message);
                    }
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const paginationComponentOptions = {
        rowsPerPageText: adminLanguageData?.common_table_text?.row_per_page_label?.value || "Row Per Page",
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <FormProvider {...methods}>
                    <form method="post" onSubmit={methods.handleSubmit(handleDataSubmit)}>
                        <div className="user_main_sec">
                            <div className="title_bar">
                                <Row className="align-items-center">
                                    <Col lg={6}>
                                        <div className="title">
                                            <Title>{adminLanguageData?.player_report_page?.player_report_page_title?.value}</Title>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div>
                                <div className="user_main_sec_content">
                                    <Row>
                                        <Col lg={12}>
                                            <div className="use_main_form">
                                                <div className="finance-report-form">
                                                    <Row className="g-10">
                                                        <Col lg={4} sm={6}>
                                                            <div className="form_input_wp form-element">
                                                                <select onChange={handleChange}>
                                                                    <option defaultValue="today" value="today">
                                                                        {adminLanguageData?.common_date_dropdown_options?.today?.value}
                                                                    </option>
                                                                    <option value="yesterday">{adminLanguageData?.common_date_dropdown_options?.Yesterday?.value}</option>
                                                                    <option value="thisWeek">{adminLanguageData?.common_date_dropdown_options?.current_week?.value}</option>
                                                                    <option value="lastWeek">{adminLanguageData?.common_date_dropdown_options?.previous_week?.value}</option>
                                                                    <option value="thisMonth">{adminLanguageData?.common_date_dropdown_options?.current_month?.value}</option>
                                                                    <option value="lastMonth">{adminLanguageData?.common_date_dropdown_options?.previous_month?.value}</option>
                                                                </select>

                                                                <i className="far fa-angle-down"></i>
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <i className="fal fa-user"></i>
                                                                <input
                                                                    name="username_search"
                                                                    type="text"
                                                                    className={`form_input ${error ? "input_error" : ""}`}
                                                                    autoComplete="off"
                                                                    onChange={(event) => setUsername(event.target.value)}
                                                                    placeholder={adminLanguageData?.player_report_page?.username_placeholder?.value}
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg={2}></Col>

                                                        <Col lg={3}>
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn" onClick={(event) => handleDataSubmit(event)}>
                                                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>

                                                    <Row className="g-10">
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <StartDateContainer methods={methods} />
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <StartTimeContainer methods={methods} />
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <EndDateContainer methods={methods} />
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <EndTimeContainer methods={methods} />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                <div className={data.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                                    {loading ? (
                                                        <Loader />
                                                    ) : !errorMessage ? (
                                                        <DataTable
                                                            columns={columns}
                                                            data={data}
                                                            theme="solarized"
                                                            noDataComponent={adminLanguageData?.no_records_found?.value}
                                                            paginationComponentOptions={paginationComponentOptions}
                                                        />
                                                    ) : errorMessage === 500 ? (
                                                        <>{adminLanguageData?.no_data_found?.value}</>
                                                    ) : (
                                                        <p
                                                            className="error-msg"
                                                            style={{
                                                                display: errorMessage ? "block" : "none",
                                                            }}
                                                        >
                                                            {errorMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Player report",
            description: "Player report",
        },
    };
}

export default PlayerReport;
