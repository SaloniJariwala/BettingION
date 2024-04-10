/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import UserTree from "@/components/admin/UserTree";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import EventReportModal from "@/components/admin/Modals/EventReportModal";
import UserTreeModal from "@/components/admin/Modals/UserTreeModal";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import Loader from "@/components/admin/UI/Loader";
import axios from "axios";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { getDateAndTime } from "@/utils/getDateAndTime";
import Head from "next/head";
import sha1 from "sha1";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const SportsGameReports = (props) => {
    const methods = useForm();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [eventModal, setShowEventModal] = useState(false);
    const [eventData, setEventData] = useState();
    const [showUserTreeModal, setUserTreeModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [data, setData] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [totalRows, setTotalRows] = useState();
    const [betId, setBetId] = useState("");
    const [username, setUsername] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [limit, setLimit] = useState(10);
    const [currentUserId, setCurrentUserId] = useState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" || user?.accountType === "super-agent" ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"))?.remoteId;
        setCurrentUserId(user);
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

    const playerBetLoss = (data) => {
        return <div className="player-bet-loss">{data}</div>;
    };

    const playerBetWon = (data) => {
        return <div className="player-bet-won">{data}</div>;
    };

    const playerEventButton = (data) => {
        setEventData(data);
        return (
            <>
                <span className="sport-bet-events" style={{ color: "#bd57fb", cursor: "pointer" }} onClick={() => setShowEventModal(true)}>
                    Show Events
                </span>
            </>
        );
    };

    const renderTotalWin = (amount) => {
        const css = amount > 0 ? "player-bet-won" : "player-bet-loss";
        const html = `<span>Total Win : &nbsp;&nbsp; </span><span className=${css}> &nbsp;&nbsp; ${renderAmountWithCurrency(amount, userDefaultCurrency?.currencyAbrv)}</span>`;
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

    const columns = [
        {
            name: "Bet ID",
            grow: 0,
            minWidth: "160px",
            selector: (row) => (row.status.toLowerCase().includes("won") ? playerBetLoss(row.transactionID) : playerBetWon(row.transactionID)),
        },
        {
            name: "Date",
            grow: 0,
            minWidth: "200px",
            selector: (row) => (row.status.toLowerCase().includes("won") ? playerBetLoss(getDateAndTime(row.createdAt)) : playerBetWon(getDateAndTime(row.createdAt))),
        },
        {
            name: "User",
            grow: 0,
            minWidth: "150px",
            selector: (row) =>
                row.status.toLowerCase().includes("won")
                    ? playerBetLoss(allUsers.find((item) => item?.id === Number(row.remoteId))?.name) || row.remoteId
                    : playerBetWon(allUsers.find((item) => item?.id === Number(row.remoteId))?.name) || row.remoteId,
        },
        {
            name: "Operation",
            grow: 0,
            minWidth: "160px",
            selector: (row) => (row.status.toLowerCase().includes("won") ? playerBetLoss(row.status) : playerBetWon(row.status)),
        },
        {
            name: "Bet Amount",
            grow: 0,
            minWidth: "130px",
            selector: (row) =>
                row.status.toLowerCase().includes("won")
                    ? playerBetLoss(renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv))
                    : playerBetWon(renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv)),
        },

        {
            name: "Result",
            grow: 0,
            minWidth: "100px",
            selector: (row) =>
                row.status.toLowerCase().includes("won")
                    ? playerBetLoss(renderAmountWithCurrency(row.resultAmount, userDefaultCurrency?.currencyAbrv))
                    : playerBetWon(renderAmountWithCurrency(row.resultAmount, userDefaultCurrency?.currencyAbrv)),
        },

        {
            name: "Possible Win",
            grow: 0,
            minWidth: "150px",
            selector: (row) =>
                row.status.toLowerCase().includes("won")
                    ? playerBetLoss(renderAmountWithCurrency(row.possibleWin, userDefaultCurrency?.currencyAbrv))
                    : playerBetWon(renderAmountWithCurrency(row.possibleWin, userDefaultCurrency?.currencyAbrv)),
        },

        {
            name: "Net Result",
            grow: 0,
            minWidth: "130px",
            selector: (row) =>
                row.status.toLowerCase().includes("won")
                    ? playerBetLoss(renderAmountWithCurrency(row.netResult, userDefaultCurrency?.currencyAbrv))
                    : playerBetWon(renderAmountWithCurrency(row.netResult, userDefaultCurrency?.currencyAbrv)),
        },
    ];

    const mainExpandRow = ({ data }) => {
        const innerColumns = [
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_Internal_id?.value,
                grow: 0,
                minWidth: "150px",
                selector: (row) => row.details.basic.internalId,
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_date?.value,
                grow: 0,
                minWidth: "200px",
                selector: (row) => getDateAndTime(row.details.basic.date),
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_player?.value,
                grow: 0,
                minWidth: "150px",
                selector: (row) => row.details.basic.player,
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_type?.value,
                grow: 0,
                minWidth: "80px",
                selector: (row) => row.actionType,
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_bet?.value,
                grow: 0,
                minWidth: "100px",
                selector: (row) => renderAmountWithCurrency(row.details.basic.bet, userDefaultCurrency?.currencyAbrv),
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_result?.value,
                grow: 0,
                minWidth: "100px",
                selector: (row) => renderAmountWithCurrency(row.resultAmount, userDefaultCurrency?.currencyAbrv),
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_possible_win?.value,
                grow: 0,
                minWidth: "140px",
                selector: (row) => renderAmountWithCurrency(row.details.basic.possibleGain, userDefaultCurrency?.currencyAbrv),
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_status?.value,
                grow: 0,
                minWidth: "100px",
                selector: (row) => (row.details.basic.condition?.toLowerCase().includes("lost") ? "Lost" : "Won"),
            },
            {
                name: adminLanguageData?.sports_game_reports_page?.table_cell_event?.value,
                cell: (row) => playerEventButton(row),
            },
        ];

        return <DataTable columns={innerColumns} data={[data]} theme="solarized" />;
    };

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
        return remoteId?.toString();
    };

    const getUserDetails = async (username) => {
        let remoteId;
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    remoteId = response.data.data.remoteId;
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
        return remoteId;
    };

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
        const startDateTime = `${startDate?.getFullYear()}-${startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)}-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()
            }T${startTime?.getHours() > 9 ? startTime?.getHours() : "0" + startTime?.getHours()}:${startTime?.getMinutes() > 9 ? startTime?.getMinutes() : "0" + startTime?.getMinutes()}:${startTime?.getSeconds() > 9 ? startTime?.getSeconds() : "0" + startTime?.getSeconds()
            }Z`;
        const endDateTime = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)}-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()
            }T${endTime?.getHours() > 9 ? endTime?.getHours() : "0" + endTime?.getHours()}:${endTime?.getMinutes() > 9 ? endTime?.getMinutes() : "0" + endTime?.getMinutes()}:${endTime?.getSeconds() > 9 ? endTime?.getSeconds() : "0" + endTime?.getSeconds()
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
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${remoteId}&casino=${process.env.NEXT_PUBLIC_CASINO
                }&start=${dates.startDateTime}&end=${dates.endDateTime}&matchType=sports&limit=${limit}&page=${page}&txnType=${isPending ? "pending" : ""}&transactionId=${betId}&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            )
            .then((response) => {
                setData(response.data?.response?.txns);
                setTotalRows(response.data?.response?.count);
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
    };

    const handlePageChange = async (page) => {
        setErrorMessage("");
        if (!username) {
            setLoading(true);
            const remoteId = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
            await getData(page, remoteId);
            setLoading(false);
        } else {
            setLoading(true);
            remoteId = await getUserDetails(username);
            await getData(1, remoteId);
            setLoading(false);
        }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        removeHeaderFooter();
        setLimit(newPerPage);
        setErrorMessage("");
        const dates = gettingDates();
        let remoteId;
        setLoading(true);
        if (!username) {
            remoteId = await getChildUsers(JSON.parse(localStorage.getItem("Admin"))?.ID);
        } else {
            remoteId = await getUserDetails(username);
        }
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${remoteId}&casino=${process.env.NEXT_PUBLIC_CASINO
                }&start=${dates.startDateTime}&end=${dates.endDateTime}&matchType=sports&limit=${newPerPage}&page=${page}&txnType=${isPending ? "pending" : ""}&transactionId=${betId}&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
            )
            .then((response) => {
                setData(response.data?.response?.txns);
                setTotalRows(response.data?.response?.count);
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
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        const getInitialData = async () => {
            setLoading(true);
            const remoteId = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
            await getData(1, remoteId);
            setLoading(false);
        };
        getInitialData();
    }, []);

    const getTreeUserId = async (id) => {
        setCurrentUserId(id);
        setLoading(true);
        const remoteId = await getChildUsers(id);
        await getData(1, remoteId);
        setLoading(false);
    };

    const handleFormSubmit = async () => {
        setErrorMessage("");
        setLoading(true);
        let remoteId;
        if (!username) {
            remoteId = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
        } else {
            remoteId = await getUserDetails(username);
        }
        await getData(1, remoteId);
        setLoading(false);
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
                                    <Title>{adminLanguageData?.sports_game_reports_page?.sports_game_reports_page_title?.value}</Title>

                                    <button className="sec_btn modal-html-btn agent-tree-modal-btn" onClick={() => setUserTreeModal(true)}>
                                        Agent Tree
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <Row>
                            <Col lg={9}>
                                <div className="use_main_form">
                                    <FormProvider {...methods}>
                                        <form className="game-reports-form" onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
                                                            className="form_input"
                                                            autoComplete="off"
                                                            placeholder={adminLanguageData?.sports_game_reports_page?.user_name_placeholder?.value}
                                                            onChange={(event) => setUsername(event.target.value)}
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
                                                            placeholder={adminLanguageData?.sports_game_reports_page?.bet_id_placeholder?.value}
                                                            disabled={isPending}
                                                            value={betId}
                                                            onChange={(event) => setBetId(event.target.value)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={3} sm={6} className="form_checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name="poker-only-pending"
                                                        value="pending"
                                                        className="form-check-input"
                                                        id="poker-only-pending"
                                                        disabled={betId}
                                                        onChange={(event) => setIsPending(!isPending)}
                                                    />
                                                    <label className="form-check-label" htmlFor="poker-only-pending">
                                                        {adminLanguageData?.sports_game_reports_page?.pending_checkbox?.value}
                                                    </label>
                                                </Col>
                                                <Col lg={3} sm={6}>
                                                    <div className="submit_btn">
                                                        <button type="submit" className="sec_btn">
                                                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                        </button>
                                                        <input type="hidden" name="matchType" value="casino" />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className={data.length > 0 ? "dataTables_wrapper sport_report_table" : "dataTables_wrapper sport_report_table noData"}>
                                                {!errorMessage ? (
                                                    <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        theme="solarized"
                                                        pagination
                                                        paginationServer
                                                        progressPending={loading}
                                                        progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                                        paginationTotalRows={totalRows}
                                                        onChangeRowsPerPage={handlePerRowsChange}
                                                        onChangePage={handlePageChange}
                                                        noDataComponent={adminLanguageData?.no_records_found?.value}
                                                        expandableRows
                                                        expandOnRowClicked
                                                        expandableRowsComponent={mainExpandRow}
                                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
                                        </form>
                                    </FormProvider>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <UserTree getTreeUserId={getTreeUserId} currentId={currentUserId} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </AdminLayout>

            <EventReportModal show={eventModal} setShow={setShowEventModal} data={eventData} />
            <UserTreeModal show={showUserTreeModal} setShow={setUserTreeModal} getTreeUserId={getTreeUserId} currentId={currentUserId} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Sports game report",
            description: "Sports game report",
        },
    };
}

export default SportsGameReports;
