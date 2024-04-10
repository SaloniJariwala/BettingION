/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import UserTree from "@/components/admin/UserTree";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { FormProvider, useForm } from "react-hook-form";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import axios from "axios";
import Loader from "@/components/admin/UI/Loader";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import UserTreeModal from "@/components/admin/Modals/UserTreeModal";
import { getDateAndTime } from "@/utils/getDateAndTime";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const ChargesAndWithdrawals = (props) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [type, setType] = useState("player");
    const [currentUserId, setCurrentUserId] = useState();
    const [filterType, setFilterType] = useState("all");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [data, setData] = useState([]);
    const [username, setUsername] = useState("");
    const [showUserTreeModal, setUserTreeModal] = useState(false);
    const [directCheckbox, setDirectCheckbox] = useState(false);
    const [higherCheckbox, setHigherCheckbox] = useState(false);
    const [receivedCheckbox, setReceivedCheckbox] = useState(false);
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [userId, setUserId] = useState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        setUserId(JSON.parse(localStorage.getItem("User"))?.remoteId);
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" || user?.accountType === "super-agent" ? setIsNotAccessible(true) : setIsNotAccessible(false);

        if (user?.username === "casinoterra.io") {
            setIsNotAccessible(false);
        }
    }, []);

    const getTreeUserId = async (id) => {
        setLoading(true);
        setUserId(id);
        setCurrentUserId(id);
        if (username) {
            getUserById();
        }
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

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    useEffect(() => {
        if (userId) {
            setLoading(true);
            getData(currentPage);
        }
    }, [userId, methods]);

    useEffect(() => {
        const id = JSON.parse(localStorage.getItem("User"))?.remoteId;
        setCurrentUserId(id);
    }, []);

    const handlePageChange = async (page) => {
        setCurrentPage(page);
        setLoading(true);
        getData(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLimit(newPerPage);
        const user = JSON.parse(localStorage.getItem("User"));
        const dates = gettingDates();
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/casino-admin-reports?action=credit-agent-report&type=${type}&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO
            }&remote_id=${userId || user?.remoteId}&start=${dates.startDateTime}&end=${dates.endDateTime}&filterType=${getFilterType()}&auth_id=${currentUserId}&limit=${newPerPage}&page=${page}`;
        await axios
            .get(url)
            .then((response) => {
                if (response.data?.txns) {
                    setData(response.data?.txns);
                    setTotalRows(response.data?.total);
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
            name: adminLanguageData?.charges_and_withdrawals_page?.table_cell_date?.value,
            grow: 0.8,
            minWidth: "190px",
            selector: (row) => getDateAndTime(row.createdAt),
        },
        {
            name: adminLanguageData?.charges_and_withdrawals_page?.table_cell_source?.value,
            grow: 1,
            selector: (row) => row.senderInfo.split(" ")[0],
        },
        {
            name: adminLanguageData?.charges_and_withdrawals_page?.table_cell_destination?.value,
            grow: 1.2,
            minWidth: "190px",
            selector: (row) => {
                return <span style={{ color: row.receiverAccountType === "player" ? "#d083ff" : "" }}>{(row?.receiverInfo).split(" ")[0]}</span>;
            },
        },
        {
            name: adminLanguageData?.charges_and_withdrawals_page?.table_cell_amount?.value,
            grow: 1,
            selector: (row) => renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv),
        },
    ];

    const getFilterType = () => {
        let res;
        if (type === "player") {
            if (!directCheckbox && !higherCheckbox) {
                res = "all";
            } else {
                res = filterType;
            }
        } else {
            if (!directCheckbox && !receivedCheckbox) {
                res = "all";
            } else {
                res = filterType;
            }
        }
        return res;
    };

    const getData = async (page) => {
        const dates = gettingDates();
        const user = JSON.parse(localStorage.getItem("User"));
        // setLoading(true);
        const url = `
        ${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/casino-admin-reports?action=credit-agent-report&type=${type}&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO
            }&remote_id=${userId || user?.remoteId}&start=${dates.startDateTime}&end=${dates.endDateTime}&filterType=${getFilterType()}&auth_id=${currentUserId}&limit=${limit}&page=${page}`;
        await axios
            .get(url)
            .then((response) => {
                if (response.data?.txns) {
                    setData(response.data?.txns);
                    setTotalRows(response.data?.total);
                    setUserId("");
                }
            })
            .catch((error) => {
                if (error.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
                setUserId("");
            })
            .finally(() => {
                setLoading(false);
            });
        setErrorMessage("");
    };

    const getUserById = () => {
        setUserLoading(true);
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        setErrorMessage("");
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}
                `
            )
            .then((response) => {
                if (username) {
                    if (response.data?.status === 200) {
                        setUserId(response.data?.data?.remoteId);
                    } else {
                        setErrorMessage(response.data?.message);
                    }
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setUserLoading(false);
            });
        // setUserId("");
        // setErrorMessage("");
    };

    const handleFormSubmit = async () => {
        if (username) {
            setLoading(true);
            getUserById();
            return;
        }
        setLoading(true);
        await getData(1);
    };

    const handleChange = (event, name) => {
        if (name === "direct") {
            setFilterType(event.target.value);
            setDirectCheckbox(true);
            setHigherCheckbox(false);
            setReceivedCheckbox(false);

            if (directCheckbox === true) {
                setDirectCheckbox(false);
            }
        } else if (name === "higher") {
            setFilterType(event.target.value);
            setDirectCheckbox(false);
            setHigherCheckbox(true);
            setReceivedCheckbox(false);

            if (higherCheckbox === true) {
                setHigherCheckbox(false);
            }
        } else if (name === "received") {
            setFilterType(event.target.value);
            setDirectCheckbox(false);
            setHigherCheckbox(false);
            setReceivedCheckbox(true);

            if (receivedCheckbox === true) {
                setReceivedCheckbox(false);
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
                                    <Title>{adminLanguageData?.charges_and_withdrawals_page?.charges_and_withdrawals_page_title?.value}</Title>

                                    {isNotAccessible && (
                                        <button className="sec_btn modal-html-btn agent-tree-modal-btn" onClick={() => setUserTreeModal(true)}>
                                            Agent Tree
                                        </button>
                                    )}
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
                                            {adminLanguageData?.common_restriction_message?.page_not_accessible_message?.value}
                                        </p>
                                    </div>
                                </Col>
                            ) : (
                                <>
                                    <Col lg={9}>
                                        <div className="use_main_form">
                                            <FormProvider {...methods}>
                                                <form className="charges-withdrawals-form" onSubmit={methods.handleSubmit(handleFormSubmit)}>
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
                                                        <Col lg={2} sm={6}>
                                                            <div className="form_input_wp form-element">
                                                                <select
                                                                    name="userrole"
                                                                    className="form_input"
                                                                    onChange={(event) => {
                                                                        setType(event.target.value);
                                                                        setFilterType("all");
                                                                    }}
                                                                >
                                                                    <option defaultValue="player" value="player">{adminLanguageData?.charges_and_withdrawals_page?.options_players?.value}</option>
                                                                    <option value="agent">{adminLanguageData?.charges_and_withdrawals_page?.options_agents?.value}</option>
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
                                                                    placeholder={adminLanguageData?.charges_and_withdrawals_page?.username_placeholder?.value}
                                                                    onChange={(event) => setUsername(event.target.value)}
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg={5} sm={6}>
                                                            <div className="form_checkbox_wp checkbox_filter checkbox_agent">
                                                                <div className="form_checkbox">
                                                                    <NextTooltip title={adminLanguageData?.charges_and_withdrawals_page?.only_direct_tooltip?.value}>
                                                                        <div>
                                                                            <input
                                                                                type="checkbox"
                                                                                name="transaction_checkbox"
                                                                                value="direct"
                                                                                className="form-check-input"
                                                                                id="direct"
                                                                                checked={directCheckbox}
                                                                                onChange={(event) => handleChange(event, "direct")}
                                                                            />
                                                                            <label className="form-check-label" htmlFor="direct">
                                                                                {adminLanguageData?.charges_and_withdrawals_page?.only_direct?.value}
                                                                                <i className="fas fa-info"></i>
                                                                            </label>
                                                                        </div>
                                                                    </NextTooltip>
                                                                </div>
                                                                {type === "player" ? (
                                                                    <div className="form_checkbox">
                                                                        <NextTooltip title={adminLanguageData?.charges_and_withdrawals_page?.higher_user_tooltip?.value}>
                                                                            <div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="transaction_checkbox"
                                                                                    value="higher"
                                                                                    className="form-check-input"
                                                                                    id="higher"
                                                                                    checked={higherCheckbox}
                                                                                    onChange={(event) => handleChange(event, "higher")}
                                                                                />
                                                                                <label className="form-check-label" htmlFor="higher">
                                                                                    {adminLanguageData?.charges_and_withdrawals_page?.higher_user?.value}
                                                                                    <i className="fas fa-info"></i>
                                                                                </label>
                                                                            </div>
                                                                        </NextTooltip>
                                                                    </div>
                                                                ) : (
                                                                    <div className="form_checkbox">
                                                                        <NextTooltip title={adminLanguageData?.charges_and_withdrawals_page?.received_tooltip?.value}>
                                                                            <div>
                                                                                <input
                                                                                    type="checkbox"
                                                                                    name="transaction_checkbox"
                                                                                    value="received"
                                                                                    className="form-check-input"
                                                                                    id="received"
                                                                                    checked={receivedCheckbox}
                                                                                    onChange={(event) => handleChange(event, "received")}
                                                                                />
                                                                                <label className="form-check-label" htmlFor="received">
                                                                                    {adminLanguageData?.charges_and_withdrawals_page?.received?.value}
                                                                                    <i className="fas fa-info"></i>
                                                                                </label>
                                                                            </div>
                                                                        </NextTooltip>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Col>

                                                        <Col lg={2} sm={6}>
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn">
                                                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </form>
                                            </FormProvider>

                                            <div className={data.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                                {!errorMessage ? (
                                                    <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        theme="solarized"
                                                        progressPending={loading || userLoading}
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
                                        <UserTree currentId={currentUserId} getTreeUserId={getTreeUserId} />
                                    </Col>
                                </>
                            )}
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
            title: "Charges and withdrawals",
            description: "Charges and withdrawals",
        },
    };
}

export default ChargesAndWithdrawals;
