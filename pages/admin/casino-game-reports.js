/* react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import React, { useState, useEffect, useLayoutEffect } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import Title from "@/components/admin/UI/Title";
import axios from "axios";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import { Col, Row } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import Loader from "@/components/admin/UI/Loader";
import UserTree from "@/components/admin/UserTree";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { getDateAndTime } from "@/utils/getDateAndTime";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { LanguageState } from "@/context/FrontLanguageProvider";

const CasinoGameReport = (props) => {
    const methods = useForm();
    const router = useRouter();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const { languageData } = LanguageState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [totalRows, setTotalRows] = useState(0);
    const [providerData, setProviderData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [provider, setProvider] = useState("all");
    const [betId, setBetId] = useState("");
    const [username, setUsername] = useState("");
    const [limit, setLimit] = useState(10);
    const [currentUserId, setCurrentUserId] = useState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);
    const [childRemoteIds, setChildRemoteIds] = useState();

    // set current userId
    useLayoutEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        } else {
            setCurrentUserId(JSON.parse(localStorage.getItem("User"))?.remoteId);
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

    const renderTotalWin = (amount) => {
        const css = amount > 0 ? "player-bet-won" : "player-bet-loss";
        const html = `<span>${adminLanguageData?.casino_game_reports_page?.row_text_total_win?.value
            } : &nbsp;&nbsp; </span><span className=${css}> &nbsp;&nbsp; ${renderAmountWithCurrency(
                amount,
                userDefaultCurrency?.currencyAbrv
            )}</span>`;
        const oldElem = document.getElementById("footer");
        if (oldElem === null) {
            var newEle = document.createElement("div");
            newEle.id = "footer";
            newEle.style.fontWeight = "bold";
            newEle.innerHTML = html;
            const elem = document.getElementsByClassName("rdt_Table");
            const final = elem[0];
            final?.after(newEle);
        }
        const oldHeader = document.getElementById("header");
        if (oldHeader === null) {
            var newEle = document.createElement("div");
            newEle.id = "header";
            newEle.style.fontWeight = "bold";
            newEle.innerHTML = html;
            const elem = document.getElementsByClassName("rdt_Table");
            const final = elem[0];
            final?.before(newEle);
        }
    };

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    const playerBetLoss = (data) => {
        return <div className="player-bet-loss">{data}</div>;
    };

    const playerBetWon = (data) => {
        return <div className="player-bet-won">{data}</div>;
    };

    const columns = [
        {
            name: adminLanguageData?.casino_game_reports_page?.table_cell_bet_id?.value,
            grow: 0,
            minWidth: "150px",
            selector: (row) =>
                row.status.toLowerCase().includes("casino win")
                    ? playerBetLoss(row.transactionID)
                    : playerBetWon(row.transactionID),
        },
        {
            name: adminLanguageData?.casino_game_reports_page?.table_cell_date?.value,
            grow: 0,
            minWidth: "210px",
            selector: (row) =>
                row.status.toLowerCase().includes("casino win")
                    ? playerBetLoss(getDateAndTime(row.createdAt).split("+")[0])
                    : playerBetWon(getDateAndTime(row.createdAt).split("+")[0]),
        },
        {
            name: adminLanguageData?.casino_game_reports_page?.table_cell_user?.value,
            grow: 0,
            minWidth: "200px",
            selector: (row) =>
                row.status.toLowerCase().includes("casino win")
                    ? playerBetLoss(row.username)
                    : playerBetWon(row.username),
        },
        {
            name: adminLanguageData?.casino_game_reports_page?.table_cell_operation?.value,
            grow: 2,
            maxWidth: "520px",
            selector: (row) =>
                row.status.toLowerCase().includes("casino win")
                    ? playerBetLoss(row.status)
                    : playerBetWon(row.status),
        },
        {
            name: adminLanguageData?.casino_game_reports_page?.table_cell_amount?.value,
            grow: 0,
            minWidth: "100px",
            selector: (row) =>
                row.status.toLowerCase().includes("casino win")
                    ? playerBetLoss(renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv))
                    : playerBetWon(renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv)),
        },
    ];

    const getChildUsers = async (parentId) => {
        let remoteId = [];
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${parentId}`);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${parentId}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.data?.child) {
                    remoteId = response.data?.data?.child?.map((item) => item?.id);
                    remoteId.push(response.data?.data?.remoteId);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.response);
                }
            });
        return remoteId;
    };

    useEffect(() => {
        const getInitialData = async () => {
            setLoading(true);
            const remoteIds = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
            setChildRemoteIds(remoteIds)
            await getData(1, remoteIds);
            setLoading(false);
        };
        getInitialData();
    }, []);

    // list of provider
    useEffect(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/casino-admin-reports?action=get-all-providers&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}`
            )
            .then((response) => {
                if (response.data?.providers) {
                    setProviderData(response.data?.providers);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.response);
                }
            });
    }, []);

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
        const startDateTime = `${startDate?.getFullYear()}-${startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)
            }-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()}T${startTime?.getHours() > 9 ? startTime?.getHours() : "0" + startTime?.getHours()
            }:${startTime?.getMinutes() > 9 ? startTime?.getMinutes() : "0" + startTime?.getMinutes()}:${startTime?.getSeconds() > 9 ? startTime?.getSeconds() : "0" + startTime?.getSeconds()
            }Z`;
        const endDateTime = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)
            }-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()}T${endTime?.getHours() > 9 ? endTime?.getHours() : "0" + endTime?.getHours()
            }:${endTime?.getMinutes() > 9 ? endTime?.getMinutes() : "0" + endTime?.getMinutes()}:${endTime?.getSeconds() > 9 ? endTime?.getSeconds() : "0" + endTime?.getSeconds()
            }Z`;
        return {
            startDateTime,
            endDateTime,
        };
    };

    const removeHeaderFooter = () => {
        const oldElem = document.getElementById("footer");
        if (oldElem) {
            oldElem.remove();
        }
        const oldHeader = document.getElementById("header");
        if (oldHeader) {
            oldHeader.remove();
        }
    };

    const getData = async (page, remoteId) => {
        removeHeaderFooter();
        const dates = gettingDates();
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN
                }&remote_id=${remoteId || childRemoteIds}&casino=${process.env.NEXT_PUBLIC_CASINO}&start=${dates.startDateTime
                }&end=${dates.endDateTime
                }&matchType=casino&transactionId=${betId}&limit=${limit}&page=${page}&providerName=${provider === "all" ? "" : provider
                }&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.response?.txns.length > 0) {
                        setData(response.data?.response?.txns);
                        setTotalRows(response.data.response.count);
                        renderTotalWin(response.data?.response?.totalWinAmount);
                    } else {
                        setData([]);
                    }
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.response);
                }
            });
    };

    const handlePageChange = async (page) => {
        const oldElem = document.getElementById("footer");
        if (oldElem) {
            oldElem.remove();
        }
        setErrorMessage("");
        if (!username) {
            setLoading(true);
            const remoteId = await JSON.parse(localStorage.getItem("User"))?.remoteId;
            await getData(page, remoteId);
            setLoading(false);
        } else {
            if (!username) {
                setErrorMessage("User Not Found");
            } else {
                setLoading(true);
                getData(page, allUsers);
                setLoading(false);
            }
        }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLimit(newPerPage);
        setErrorMessage("");
        const dates = gettingDates();
        let remoteId;
        if (!username) {
            remoteId = await localStorage.getItem("User")?.remoteId;
        } else {
            if (!username) {
                setErrorMessage("User Not Found");
            } else {
                setLoading(true);
                getData(page, allUsers);
                setLoading(false);
            }
        }
        setLoading(true);
        removeHeaderFooter();
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN
                }&remote_id=${remoteId || childRemoteIds}&casino=${process.env.NEXT_PUBLIC_CASINO}&start=${dates.startDateTime
                }&end=${dates.endDateTime
                }&matchType=casino&transactionId=${betId}&limit=${newPerPage}&page=${page}&providerName=${provider === "all" ? "" : provider
                }&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            )
            .then((response) => {
                setData(response.data?.response?.txns);
                setTotalRows(response.data.response.count);
                if (response.data?.response?.txns.length > 0) {
                    renderTotalWin(response.data?.response?.totalWinAmount);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.response);
                }
            });
        setLoading(false);
    };

    const getTreeUserId = async (id) => {
        setCurrentUserId(id);
        setLoading(true);
        const remoteId = await getChildUsers(id);
        await getData(1, remoteId);
        setLoading(false);
    };

    const handleFormSubmit = async () => {
        removeHeaderFooter();
        setErrorMessage("");
        if (!username) {
            const remoteId = await localStorage.getItem("User")?.remoteId;
            setLoading(true);
            await getData(1, remoteId);
            setLoading(false);
        } else {
            const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
            try {
                setLoading(true);
                await axios
                    .get(
                        `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}`
                    )
                    .then((response) => {
                        if (response.data?.status === 200) {
                            getData(1, response.data.data.remoteId);
                            setLoading(false);
                            setErrorMessage("");
                        } else {
                            setErrorMessage(response?.data?.message);
                        }
                    })
                    .catch((error) => {
                        if (error.response?.status === 500) {
                            setDataNotFound(true);
                        }
                        setErrorMessage(error.message);
                    });
            } catch (error) {
                setErrorMessage(error);
            }
        }
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
                                            adminLanguageData?.casino_game_reports_page
                                                ?.casino_game_reports_page_title?.value
                                        }
                                    </Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <Row>
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
                                    <Col lg={9}>
                                        <div className="use_main_form">
                                            <FormProvider {...methods}>
                                                <form
                                                    className="game-reports-form"
                                                    onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
                                                            <div className="form_input_wp form-element">
                                                                <select
                                                                    className="form-select casino-provider-select"
                                                                    aria-label="Select Providers"
                                                                    onChange={(event) =>
                                                                        setProvider(event.target.value)
                                                                    }>
                                                                    <option value="all">
                                                                        {languageData?.provider_sidebar
                                                                            ?.all_providers_label?.value ||
                                                                            "All Providers"}
                                                                    </option>
                                                                    {providerData?.map((provider) => (
                                                                        <option
                                                                            value={provider?.name}
                                                                            key={provider?.providerId}>
                                                                            {provider?.name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <i className="far fa-angle-down"></i>
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <i className="fal fa-user active"></i>
                                                                <input
                                                                    name="username_search"
                                                                    type="text"
                                                                    className="form_input"
                                                                    autoComplete="off"
                                                                    placeholder={
                                                                        adminLanguageData
                                                                            ?.casino_game_reports_page
                                                                            ?.username_placeholder?.value
                                                                    }
                                                                    onChange={(event) =>
                                                                        setUsername(event.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="form_input_wp">
                                                                <i className="fal fa-user active"></i>
                                                                <input
                                                                    name="bet_id"
                                                                    type="number"
                                                                    className="form_input"
                                                                    autoComplete="off"
                                                                    placeholder={
                                                                        adminLanguageData
                                                                            ?.casino_game_reports_page
                                                                            ?.bet_id_placeholder?.value
                                                                    }
                                                                    onChange={(event) =>
                                                                        setBetId(event.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col lg={3} sm={6}>
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn">
                                                                    {
                                                                        adminLanguageData
                                                                            ?.common_date_time_label
                                                                            ?.submit_button_text?.value
                                                                    }
                                                                </button>
                                                                <input
                                                                    type="hidden"
                                                                    name="matchType"
                                                                    value="casino"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </form>
                                            </FormProvider>
                                            <div
                                                className={
                                                    data.length > 0
                                                        ? "dataTables_wrapper"
                                                        : "dataTables_wrapper noData"
                                                }>
                                                {!errorMessage ? (
                                                    <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        pagination
                                                        paginationServer
                                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                        progressPending={loading}
                                                        progressComponent={
                                                            <Loader style={{ minHeight: "62px" }} />
                                                        }
                                                        paginationTotalRows={totalRows}
                                                        onChangeRowsPerPage={handlePerRowsChange}
                                                        onChangePage={handlePageChange}
                                                        noDataComponent={
                                                            adminLanguageData?.no_records_found?.value
                                                        }
                                                        theme="solarized"
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
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <UserTree getTreeUserId={getTreeUserId} currentId={currentUserId} />
                                    </Col>
                                </>
                            )}
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
            title: "Casino game report",
            description: "Casino game report",
        },
    };
}

export default CasinoGameReport;
