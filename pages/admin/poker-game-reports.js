/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import UserTree from "@/components/admin/UserTree";
import UserTreeModal from "@/components/admin/Modals/UserTreeModal";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import Loader from "@/components/admin/UI/Loader";
import axios from "axios";
import { getDateAndTime } from "@/utils/getDateAndTime";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import Head from "next/head";
import sha1 from "sha1";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const PokerGameReports = (props) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [showUserTreeModal, setUserTreeModal] = useState(false);
    const [data, setData] = useState([]);
    const [username, setUsername] = useState("");
    const [totalRows, setTotalRows] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();
    const [allUsers, setAllUsers] = useState([]);
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

    // useEffect(() => {
    //     axios
    //         .post(
    //             `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/get-users.php`,
    //             { action: "all", userId: JSON.parse(localStorage.getItem("Admin"))?.ID },
    //             {
    //                 headers: {
    //                     "Access-Control-Allow-Origin": "*",
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             }
    //         )
    //         .then((response) => {
    //             if (response.data?.status) {
    //                 setAllUsers(response.data?.data);
    //             }
    //         })
    //         .catch((error) => {
    //             if (error.response?.status === 500) {
    //                 setErrorMessage(500);
    //             } else {
    //                 setErrorMessage(error.message);
    //             }
    //         });
    // }, []);

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
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${remoteId}&casino=${process.env.NEXT_PUBLIC_CASINO}&start=${dates.startDateTime}&end=${dates.endDateTime}&matchType=poker&limit=${limit}&page=${page}&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
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
                    setErrorMessage(error.message);
                }
            });
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

    useEffect(() => {
        const getInitialData = async () => {
            setLoading(true);
            const remoteId = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
            await getData(1, remoteId);
            setLoading(false);
        };
        getInitialData();
    }, []);

    const columns = [
        {
            name: adminLanguageData?.poker_game_reports_page?.table_cell_date?.value,
            minWidth: "200px",
            grow: 1,
            selector: (row) => getDateAndTime(row.createdAt),
        },
        {
            name: adminLanguageData?.poker_game_reports_page?.table_cell_user?.value,
            grow: 1,
            minWidth: "150px",
            selector: (row) => allUsers.find((item) => item?.id === Number(row.remoteId))?.name || row.remoteId,
        },
        {
            name: adminLanguageData?.poker_game_reports_page?.table_cell_buy_in?.value,
            grow: 1,
            selector: (row) => row.action.toLowerCase() === "debit" && renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.poker_game_reports_page?.table_cell_cashout?.value,
            grow: 1,
            selector: (row) => row.action.toLowerCase() === "credit" && renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.poker_game_reports_page?.table_cell_rake?.value,
            grow: 1,
            selector: (row) => renderAmountWithCurrency(row.rake || 0, userDefaultCurrency?.currencyAbrv),
        },
    ];

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

    const handlePerRowsChange = async (newPerPage, page) => {
        setErrorMessage("");
        setLimit(newPerPage);
        removeHeaderFooter();
        const dates = gettingDates();
        let remoteId;
        if (!username) {
            remoteId = await getChildUsers(JSON.parse(localStorage.getItem("User"))?.remoteId);
        } else {
            remoteId = await getUserDetails(username);
        }
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=casinoAdminPlayer&token=${process.env.NEXT_PUBLIC_TOKEN}&remote_id=${remoteId}&casino=${process.env.NEXT_PUBLIC_CASINO}&start=${dates.startDateTime}&end=${dates.endDateTime}&matchType=poker&limit=${newPerPage}&page=${page}&currentRemoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
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
                    setErrorMessage(error.message);
                }
            });
        setLoading(false);
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
            const remoteId = await getUserDetails(username);
            await getData(page, remoteId);
            setLoading(false);
        }
    };

    const getTreeUserId = async (id) => {
        setCurrentUserId(id);
        setLoading(true);
        const remoteId = await getChildUsers(id);
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
                                    <Title>{adminLanguageData?.poker_game_reports_page?.poker_game_reports_page_title?.value}</Title>

                                    <button className="sec_btn modal-html-btn agent-tree-modal-btn" onClick={() => setUserTreeModal(true)}>
                                        {adminLanguageData?.agent_tree_user_modal?.agent_tree_modal_title?.value}
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
                                        <form className="finance-report-form" onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
                                                        <i className="fal fa-user"></i>
                                                        <input
                                                            name="username_search"
                                                            type="text"
                                                            className="form_input"
                                                            autoComplete="off"
                                                            placeholder={adminLanguageData?.poker_game_reports_page?.user_name_placeholder?.value}
                                                            onChange={(event) => setUsername(event.target.value)}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col lg={3} className="for-des"></Col>
                                                <Col lg={3} className="for-des"></Col>
                                                <Col lg={3} sm={6}>
                                                    <div className="submit_btn">
                                                        <button type="submit" className="sec_btn">
                                                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </form>
                                    </FormProvider>

                                    <div className={data?.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                        {!errorMessage ? (
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                theme="solarized"
                                                progressPending={loading}
                                                progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                                pagination
                                                paginationServer
                                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                paginationTotalRows={totalRows}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
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

                            <Col lg={3}>
                                <UserTree getTreeUserId={getTreeUserId} currentId={currentUserId} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </AdminLayout>

            <UserTreeModal show={showUserTreeModal} setShow={setUserTreeModal} currentId={currentUserId} getTreeUserId={getTreeUserId} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Poker game report",
            description: "Poker game report",
        },
    };
}

export default PokerGameReports;
