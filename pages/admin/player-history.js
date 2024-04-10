/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";
import DataTable, { createTheme } from "react-data-table-component";
import { FormProvider, useForm } from "react-hook-form";
import Title from "@/components/admin/UI/Title";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import Loader from "@/components/admin/UI/Loader";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { getDateAndTime } from "@/utils/getDateAndTime";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const PlayerHistory = (props) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState();
    const [username, setUsername] = useState("");
    const [error, setError] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" || user?.accountType === "super-agent"
            ? setIsNotAccessible(true)
            : setIsNotAccessible(false);
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

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    const columns = [
        {
            name: adminLanguageData?.player_history_page?.table_cell_date?.value,
            grow: 1,
            minWidth: "190px",
            selector: (row) => getDateAndTime(row.createdAt).split("+")[0],
        },
        {
            name: adminLanguageData?.player_history_page?.table_cell_provider?.value,
            grow: 1,
            selector: (row) => row.providerName,
        },
        {
            name: adminLanguageData?.player_history_page?.table_cell_operation?.value,
            grow: 1,
            selector: (row) => row.actionType,
        },
        {
            name: adminLanguageData?.player_history_page?.table_cell_amount?.value,
            grow: 1,
            selector: (row) => renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.player_history_page?.table_cell_balance_before?.value,
            grow: 1,
            selector: (row) => renderAmountWithCurrency(row.beforeBalance, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.player_history_page?.table_cell_balance_after?.value,
            grow: 1,
            selector: (row) => renderAmountWithCurrency(row.afterBalance, userDefaultCurrency?.currencyAbrv),
        },
    ];

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
        const startDateTime = `${startDate?.getFullYear()}-${
            startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)
        }-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()}T${
            startTime?.getHours() > 9 ? startTime?.getHours() : "0" + startTime?.getHours()
        }:${startTime?.getMinutes() > 9 ? startTime?.getMinutes() : "0" + startTime?.getMinutes()}:${
            startTime?.getSeconds() > 9 ? startTime?.getSeconds() : "0" + startTime?.getSeconds()
        }Z`;
        const endDateTime = `${endDate?.getFullYear()}-${
            endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)
        }-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()}T${
            endTime?.getHours() > 9 ? endTime?.getHours() : "0" + endTime?.getHours()
        }:${endTime?.getMinutes() > 9 ? endTime?.getMinutes() : "0" + endTime?.getMinutes()}:${
            endTime?.getSeconds() > 9 ? endTime?.getSeconds() : "0" + endTime?.getSeconds()
        }Z`;
        return {
            startDateTime,
            endDateTime,
        };
    };

    const getData = async (page) => {
        const dates = gettingDates();
        setErrorMessage("");
        await axios
            .get(
                `
            ${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=player&token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${userId}&casino=${process.env.NEXT_PUBLIC_CASINO}&start=${dates?.startDateTime}&end=${dates?.endDateTime}&limit=${limit}&page=${page}`
            )
            .then((response) => {
                if (response.data?.response) {
                    setData(response.data?.response[0]?.transactions);
                    setTotal(response.data?.response[0]?.totalTxns);
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

    const getUserById = () => {
        setUserLoading(true);
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        axios
            .get(
                `
            ${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}
            `
            )
            .then((response) => {
                if (username) {
                    if (response.data.status === 200) {
                        setUserId(response.data?.data?.remoteId);
                    } else {
                        setErrorMessage(response?.data?.message);
                    }
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setUserLoading(false);
            });
        setUserId("");
    };

    useEffect(() => {
        if (userId !== "") {
            getData(currentPage);
        }
    }, [userId, limit, currentPage]);

    const handleSubmitData = async () => {
        setErrorMessage("");
        setError(false);
        if (username) {
            setLoading(true);
            getUserById();
        } else {
            setError(true);
            return;
        }
    };

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        setLoading(true);
        setUserId(userId);
    };

    const handleRowsPerPageChange = async (newPerPage, page) => {
        setCurrentPage(page);
        setLimit(newPerPage);
        setLoading(true);
        setUserId(userId);
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
                <div className="user_main_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {
                                            adminLanguageData?.player_history_page?.player_history_page_title
                                                ?.value
                                        }
                                    </Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <Row>
                            <Col lg={12}>
                                <div className="use_main_form">
                                    {!isNotAccessible ? (
                                        <p className="error-msg" style={{ display: "block" }}>
                                            {
                                                adminLanguageData?.common_restriction_message
                                                    ?.page_not_accessible_message?.value
                                            }
                                        </p>
                                    ) : (
                                        <>
                                            <FormProvider {...methods}>
                                                <form
                                                    className="charges-withdrawals-form"
                                                    method="post"
                                                    onSubmit={methods.handleSubmit(handleSubmitData)}>
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

                                                    <Row className="g-10">
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <i className="fal fa-user active"></i>
                                                                <input
                                                                    name="username_search"
                                                                    type="text"
                                                                    className={`form_input ${
                                                                        error ? "input_error" : ""
                                                                    }`}
                                                                    autoComplete="off"
                                                                    placeholder={
                                                                        adminLanguageData?.player_history_page
                                                                            ?.username_placeholder?.value
                                                                    }
                                                                    value={username}
                                                                    onChange={(event) =>
                                                                        setUsername(event.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg={6} className="for_des"></Col>

                                                        <Col lg={3} sm={6}>
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn">
                                                                    {
                                                                        adminLanguageData?.agents_report_page
                                                                            ?.agent_report_submit_button
                                                                            ?.value
                                                                    }
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </form>
                                            </FormProvider>

                                            <div
                                                className={
                                                    data?.length > 0
                                                        ? "dataTables_wrapper"
                                                        : "dataTables_wrapper noData"
                                                }>
                                                {!errorMessage ? (
                                                    <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        theme="solarized"
                                                        pagination
                                                        paginationServer
                                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                        progressPending={loading || userLoading}
                                                        progressComponent={
                                                            <Loader style={{ minHeight: "62px" }} />
                                                        }
                                                        paginationTotalRows={total}
                                                        onChangeRowsPerPage={handleRowsPerPageChange}
                                                        onChangePage={handlePageChange}
                                                        noDataComponent={
                                                            adminLanguageData?.no_records_found?.value
                                                        }
                                                        paginationComponentOptions={
                                                            paginationComponentOptions
                                                        }
                                                    />
                                                ) : errorMessage === 500 ? (
                                                    <>{adminLanguageData?.no_data_found?.value}</>
                                                ) : (
                                                    <p
                                                        className="error-msg"
                                                        style={{
                                                            display: errorMessage ? "block" : "none",
                                                        }}>
                                                        {errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Player history",
            description: "Player history",
        },
    };
}

export default PlayerHistory;
