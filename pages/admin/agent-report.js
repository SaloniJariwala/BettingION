/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import UserTree from "@/components/admin/UserTree";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import axios from "axios";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import Loader from "@/components/admin/UI/Loader";
import UserTreeModal from "@/components/admin/Modals/UserTreeModal";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AgentReport = (props) => {
    const methods = useForm();
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [loading, setLoading] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [data, setData] = useState([]);
    const [orgData, setOrgData] = useState([]);
    const [currentUserId, setCurrentUserId] = useState();
    const [showUserTreeModal, setUserTreeModal] = useState(false);
    const [final, setFinal] = useState();
    const [sDate, setSDate] = useState();
    const [sTime, setSTime] = useState();
    const [eDate, setEDate] = useState();
    const [eTime, setETime] = useState();
    const [currentUserAccountType, setCurrentUserAccountType] = useState();

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        setSDate(methods.getValues("startDate"));
        setSTime(methods.getValues("startTime"));
        setEDate(methods.getValues("endDate"));
        setETime(methods.getValues("endTime"));
    }, [methods]);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem("User"))?.remoteId;
        const accountType = JSON.parse(localStorage.getItem("User"))?.accountType;
        setCurrentUserId(id);
        setCurrentUserAccountType(accountType);
    }, []);

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

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
            name: adminLanguageData?.agents_report_page?.table_cell_category?.value,
            minWidth: "200px",
            grow: 0.4,
            selector: (row) => {
                if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                    return <b>{row.category}</b>;
                } else {
                    return row.category;
                }
            },
        },
        {
            name: adminLanguageData?.agents_report_page?.table_cell_number_of_bets?.value,
            grow: 0.7,
            selector: (row) => {
                if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                    return <b>{row.betsCount}</b>;
                } else {
                    return row.betsCount;
                }
            },
        },
        {
            name: adminLanguageData?.agents_report_page?.table_cell_total_bet?.value,
            grow: 0.2,
            selector: (row) => {
                if (typeof row.bets === "number") {
                    const res = renderAmountWithCurrency(row.bets.toString(), userDefaultCurrency?.currencyAbrv);
                    if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                        return <b>{res}</b>;
                    } else {
                        return res;
                    }
                }
            },
        },
        {
            name: adminLanguageData?.agents_report_page?.table_cell_win?.value,
            grow: 0.2,
            selector: (row) => {
                if (typeof row.credits === "number") {
                    const res = renderAmountWithCurrency(row.credits.toString(), userDefaultCurrency?.currencyAbrv);
                    if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                        return <b>{res}</b>;
                    } else {
                        return res;
                    }
                }
            },
        },
        {
            name: adminLanguageData?.agents_report_page?.table_cell_commission?.value,
            grow: 0.6,
            minWidth: "150px",
            selector: (row) => {
                let com;
                if (typeof row.commission === "number") {
                    com = renderAmountWithCurrency(row.commission.toString(), userDefaultCurrency?.currencyAbrv);
                } else {
                    com = row.commission;
                }
                if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                    return <b>{com}</b>;
                } else {
                    return com;
                }
            },
        },
        {
            name: adminLanguageData?.agents_report_page?.table_cell_category?.value,
            grow: 0.6,
            selector: (row) => {
                if (typeof row.payAmount === "number") {
                    const res = renderAmountWithCurrency(row.payAmount.toString(), userDefaultCurrency?.currencyAbrv);
                    if (row.category === "casino" || row.category === "sports" || row.category === "poker") {
                        return <b>{res}</b>;
                    } else {
                        return res;
                    }
                }
            },
        },
    ];

    const agentColumns = [...columns];
    agentColumns.pop();

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
        let res;
        const user = JSON.parse(localStorage.getItem("User"));
        const dates = gettingDates();
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/casinos/casino-admin-reports?action=global-agent-report&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&remote_id=${currentUserId || user?.remoteId}&start=${dates?.startDateTime}&end=${dates?.endDateTime}`
            );
            if (response.data?.result) {
                const obj = {
                    bets: "",
                    betsCount: "",
                    category: "",
                    credits: "",
                    netwin: "",
                    commission: <b>{adminLanguageData?.agents_report_page?.row_text_total_payment?.value}</b>,
                    payAmount: response.data?.result?.totalToPay,
                    payToAgents: "",
                };
                setOrgData(response.data?.result?.data);
                const emptyObj = {
                    bets: "",
                    betsCount: "",
                    category: "",
                    credits: "",
                    netwin: "",
                    commission: "",
                    payAmount: "",
                    payToAgents: "",
                };
                const array = [
                    {
                        bets: "",
                        betsCount: "",
                        category: adminLanguageData?.agents_report_page?.row_text_agents_credits?.value,
                        credits: "",
                        netwin: "",
                        commission: Number(response.data?.result?.totalAgentsCredits).toLocaleString("en-US", {
                            style: "currency",
                            currency: userDefaultCurrency?.currencyAbrv,
                            minimumFractionDigits: 2,
                        }),
                        payAmount: "",
                        payToAgents: "",
                    },
                    {
                        bets: "",
                        betsCount: "",
                        category: adminLanguageData?.agents_report_page?.row_text_players_credit?.value,
                        credits: "",
                        netwin: "",
                        commission: Number(response.data?.result?.totalPlayerCredits).toLocaleString("en-US", {
                            style: "currency",
                            currency: userDefaultCurrency?.currencyAbrv,
                            minimumFractionDigits: 2,
                        }),
                        payAmount: "",
                        payToAgents: "",
                    },
                ];
                res = {
                    totalPayments: obj,
                    agentCredit: response.data?.result?.totalAgentsCredits,
                    playerCredit: response.data?.result?.totalPlayerCredits,
                    data: response.data?.result?.data,
                };
                if (currentUserAccountType === "agent") {
                    delete res["totalPayments"];
                }
                setFinal(res);
                let newArr;
                if (currentUserAccountType === "agent") {
                    newArr = [...response.data?.result?.data, emptyObj, ...array];
                } else {
                    newArr = [...response.data?.result?.data, obj, emptyObj, ...array];
                }
                setData(newArr);
            } else {
                res = "No Data";
                setData([]);
            }
        } catch (error) {
            if (error.response?.status === 500) {
                setErrorMessage(500);
            } else {
                setErrorMessage(error.response);
            }
        } finally {
            setLoading(false);
        }
        return res;
    };

    useEffect(() => {
        const gettingData = async () => {
            if (currentUserId) {
                await getData();
            }
        };
        gettingData();
    }, [currentUserId, methods]);

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await getData();
    };

    const handleDetailsClick = async (event) => {
        event.preventDefault();
        let returnedObj = final || [];
        if (data?.length === 0 && orgData?.length === 0) {
            returnedObj = await getData();
        } else if (sDate !== methods.getValues("startDate") || eDate !== methods.getValues("endDate") || sTime !== methods.getValues("startTime") || eTime !== methods.getValues("endTime")) {
            returnedObj = await getData();
        }
        if (returnedObj === "No Data") {
            setData([]);
        } else {
            const lastElem = returnedObj?.totalPayments;
            let outerArr = [];
            returnedObj?.data?.forEach((item) => {
                let innerArr = [];
                item?.providers?.forEach((provider) => {
                    const obj = {
                        bets: provider?.bets,
                        betsCount: provider?.betsCount,
                        category: provider?.name,
                        credits: provider?.credits,
                        netwin: provider?.netwin,
                        commission: provider?.commission,
                        payAmount: provider?.payAmount,
                        payToAgents: provider?.payToAgents,
                    };
                    if (currentUserAccountType === "agent") {
                        delete obj["payAmount"];
                    }
                    innerArr.push(obj);
                });
                outerArr = [...outerArr, item, ...innerArr];
            });
            const emptyObj = {
                bets: "",
                betsCount: "",
                category: "",
                credits: "",
                netwin: "",
                commission: "",
                payAmount: "",
                payToAgents: "",
            };
            if (currentUserAccountType === "agent") {
                delete emptyObj["payAmount"];
            }
            const array = [
                {
                    bets: "",
                    betsCount: "",
                    category: "Agents Credit",
                    credits: "",
                    netwin: "",
                    commission: renderAmountWithCurrency(returnedObj?.agentCredit.toString(), userDefaultCurrency?.currencyAbrv),
                    payAmount: "",
                    payToAgents: "",
                },
                {
                    bets: "",
                    betsCount: "",
                    category: "Players Credit",
                    credits: "",
                    netwin: "",
                    commission: renderAmountWithCurrency(returnedObj?.playerCredit.toString(), userDefaultCurrency?.currencyAbrv),
                    payAmount: "",
                    payToAgents: "",
                },
            ];

            let newArr;
            if (currentUserAccountType === "agent") {
                newArr = [...outerArr, emptyObj, ...array];
            } else {
                newArr = [...outerArr, lastElem, emptyObj, ...array];
            }

            setData(newArr);
        }
    };

    const setDateAndTime = (startDate, startTime, endDate, endTime) => {
        methods.setValue("startDate", startDate);
        methods.setValue("startTime", startTime);
        methods.setValue("endDate", endDate);
        methods.setValue("endTime", endTime);
    };

    const handleChange = async (event) => {
        const value = event.target.value;
        if (value === "today") {
            const startDate = new Date();
            const startTime = new Date(new Date().setHours(0, 0, 0));
            const endDate = new Date();
            const endTime = new Date(new Date().setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            await getData();
            return;
        } else if (value === "yesterday") {
            const startDate = new Date(Date.now() - 86400000);
            const startTime = new Date(new Date(Date.now() - 86400000).setHours(0, 0, 0));
            const endDate = new Date(Date.now() - 86400000);
            const endTime = new Date(new Date(Date.now() - 86400000).setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            await getData();
            return;
        } else if (value === "thisWeek") {
            var curr = new Date();
            const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
            const startDate = new Date(curr.setDate(first + 1));
            const startTime = new Date(new Date(curr.setDate(first + 1)).setHours(0, 0, 0));
            const endDate = new Date(curr.setDate(first + 7));
            const endTime = new Date(new Date(curr.setDate(first + 7)).setHours(23, 59, 59));
            setDateAndTime(startDate, startTime, endDate, endTime);
            await getData();
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
            await getData();
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
            await getData();
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
            await getData();
            return;
        }
    };

    const getTreeUserId = async (id) => {
        setCurrentUserId(id);
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
                                    <Title>{adminLanguageData?.agents_report_page?.agents_report_page_title?.value}</Title>
                                    <button className="sec_btn modal-html-btn agent-tree-modal-btn" onClick={() => setUserTreeModal(true)}>
                                        {adminLanguageData?.agent_tree_user_modal?.agent_tree_modal_title?.value}
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <FormProvider {...methods}>
                        <form method="post" className="vr_add_user_from" onSubmit={methods.handleSubmit((event) => event.preventDefault())}>
                            <div className="user_main_sec_content">
                                <Row>
                                    <Col lg={9}>
                                        <div className="use_main_form">
                                            <div className="finance-report-form">
                                                <Row className="g-10">
                                                    <Col lg={5}>
                                                        <div className="form_input_wp form-element">
                                                            <select onChange={(event) => handleChange(event)}>
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
                                                    <Col lg={7}>
                                                        <div className="button_group finance-button_group">
                                                            <button className="sec_btn details-btn" onClick={(event) => handleDetailsClick(event)}>
                                                                {adminLanguageData?.agents_report_page?.agent_report_details_button?.value}
                                                            </button>
                                                            <button onClick={handleFormSubmit} className="sec_btn">
                                                                {adminLanguageData?.agents_report_page?.agent_report_submit_button?.value}
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

                                            <div className={data?.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                                {loading ? (
                                                    <Loader />
                                                ) : !errorMessage ? (
                                                    <DataTable
                                                        columns={currentUserAccountType === "agent" ? agentColumns : columns}
                                                        data={data}
                                                        theme="solarized"
                                                        noDataComponent={adminLanguageData?.no_records_found?.value}
                                                        paginationComponentOptions={paginationComponentOptions}
                                                    />
                                                ) : errorMessage === 500 ? (
                                                    <>{adminLanguageData?.no_data_found?.value}</>
                                                ) : (
                                                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                                                        {errorMessage}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <UserTree currentId={currentUserId} getTreeUserId={getTreeUserId} />
                                    </Col>
                                </Row>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </AdminLayout>
            <UserTreeModal show={showUserTreeModal} setShow={setUserTreeModal} currentId={currentUserId} getTreeUserId={getTreeUserId} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Agent report",
            description: "Agent report",
        },
    };
}

export default AgentReport;
