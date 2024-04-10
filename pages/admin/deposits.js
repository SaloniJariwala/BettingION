/* react-hooks/exhaustive-deps */
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import Loader from "@/components/admin/UI/Loader";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { FormProvider, useForm } from "react-hook-form";
import { getDateAndTime } from "@/utils/getDateAndTime";
import sha1 from "sha1";
import axios from "axios";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const paymentLabels = {
    crypto: "Crypto",
    bankTransfer: "Bank Transfer",
    paypal: "Paypal",
    stripe: "Stripe",
};

const Deposits = (props) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage, setLimitPerPage] = useState(10);
    const [depositStatus, setDepositStatus] = useState("");
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" ? setIsNotAccessible(true) : setIsNotAccessible(false);

        if (user?.username === "casinoterra.io") {
            setIsNotAccessible(false);
        }
    }, []);

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    // dates
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

    const depositStatuses = ["cancelled", "pending", "approved"];
    const statusColorObject = {
        cancelled: {
            class: "error-msg",
            css: {
                display: "block",
                background: "transparent",
                borderColor: "transparent",
                padding: "0",
            },
        },
        pending: {
            class: "info_msg",
            css: {
                display: "block",
            },
        },
        approved: {
            class: "approved_msg",
            css: {
                display: "block",
            },
        },
    };

    const statusWiseHtml = (status) => {
        // status = status === 'cancel' ? 'cancelled' : status;
        if (depositStatuses.includes(status.toLowerCase())) {
            return (
                <span
                    className={statusColorObject[status.toLowerCase()].class}
                    style={statusColorObject[status.toLowerCase()].css}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            );
        } else {
            return status;
        }
    };

    const removeHeaderFooter = () => {
        const oldElem = document.getElementById("footer");
        if (oldElem) {
            oldElem.remove();
        }
    };

    const getData = () => {
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );

        const dates = gettingDates();
        setLoading(true);
        removeHeaderFooter();

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/admin-deposit-txns-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&startDate=${dates.startDateTime}&endDate=${dates.endDateTime
                }&page=${currentPage}&limit=${limitPerPage}&status=${depositStatus}&username=${username}&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setErrorMessage("");
                    if (response.data?.data?.length > 0) {
                        setData([...response.data?.data]);
                        renderTotalWin(
                            response.data?.currentPendingAmount,
                            response.data?.currentApprovedAmount
                        );
                    } else {
                        setData(response.data?.data);
                    }
                } else {
                    setErrorMessage(response.data?.message);
                }
                setTotalRows(response.data?.count);
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
        getData();
    }, [currentPage, limitPerPage]);

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

    const depositActionHandler = (event, action, data) => {
        let status;
        if (action === "approved") status = confirm("This transaction will be approved");

        if ((status && action === "approved") || action === "cancelled") {
            const authKey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`
            );
            axios
                .post(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/admin-action-deposit?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&txnId=${data.transactionID}&action=${action}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        getData();
                    }
                });
        }
    };

    const renderActions = (row) => {
        return (
            <div className="table_btn_group">
                <ul>
                    {row.status === "pending" && (
                        <>
                            <li>
                                <NextTooltip title="Accept">
                                    <button
                                        type="button"
                                        className="woo_wallet_withdrawal_action sec_btn icon_btn"
                                        onClick={(event) => depositActionHandler(event, "approved", row)}>
                                        <i className="fal fa-check"></i>
                                    </button>
                                </NextTooltip>
                            </li>
                            <li>
                                <NextTooltip title="Reject">
                                    <button
                                        type="button"
                                        className="woo_wallet_withdrawal_action sec_btn icon_btn"
                                        onClick={(event) => depositActionHandler(event, "cancelled", row)}>
                                        <i className="fal fa-times"></i>
                                    </button>
                                </NextTooltip>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        );
    };

    const columns = [
        {
            name: "Transaction ID",
            grow: 1.5,
            selector: (row) => row?.transactionID,
        },
        {
            name: adminLanguageData?.deposits_page?.table_cell_order?.value,
            grow: 1.5,
            selector: (row) =>
                row.id && (
                    <span
                        style={
                            row?.accountType === "player" ? { color: "#d083ff" } : {}
                        }>{`${row?.username}`}</span>
                ),
        },
        {
            name: adminLanguageData?.deposits_page?.table_cell_date?.value,
            grow: 1,
            minWidth: "190px",
            selector: (row) => getDateAndTime(row.createdAt),
        },
        {
            name: adminLanguageData?.deposits_page?.table_cell_amount?.value,
            grow: 1,
            minWidth: "150px",
            selector: (row) => renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: "Payment Method",
            grow: 1,
            minWidth: "150px",
            selector: (row) => `${paymentLabels[row.withdrawMethod] || row.withdrawMethod} - ${row.withdrawCoin}`,
        },
        {
            name: adminLanguageData?.deposits_page?.table_cell_status?.value,
            grow: 1,
            minWidth: "100px",
            selector: (row) => statusWiseHtml(row.status),
        },
        {
            name: "Actions",
            grow: 1,
            minWidth: "100px",
            selector: (row) => renderActions(row),
        },
    ];

    const renderTotalWin = (pendingAmount, approvedAmount) => {
        const html = `
                <div>
                    <span>${adminLanguageData?.deposits_page?.footer_pending_amount?.value
            } : </span><span> ${renderAmountWithCurrency(
                pendingAmount,
                userDefaultCurrency?.currencyAbrv
            )}</span>
                </div>
                <div>
                    <span>${adminLanguageData?.deposits_page?.footer_approved_amount?.value
            } : </span><span> ${renderAmountWithCurrency(
                approvedAmount,
                userDefaultCurrency?.currencyAbrv
            )}</span>
                </div>
                `;
        const oldElem = document.getElementById("footer");
        if (oldElem === null) {
            var newEle = document.createElement("div");
            newEle.id = "footer";
            newEle.style.fontWeight = "bold";
            newEle.innerHTML = html;
            const elem = document.getElementsByClassName("rdt_Table");
            const final = elem[0];
            final?.after(newEle);
        } else {
            document.getElementById("footer").innerHTML = html;
        }
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setCurrentPage(page);
        setLimitPerPage(newPerPage);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleFormSubmit = async () => {
        getData();
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
                                        {adminLanguageData?.deposits_page?.deposits_page_title?.value}
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
                                        <React.Fragment>
                                            <FormProvider {...methods}>
                                                <form
                                                    className="charges-withdrawals-form"
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
                                                                    name="operation"
                                                                    className="form_input"
                                                                    placeholder="operation"
                                                                    onChange={(event) =>
                                                                        setDepositStatus(event.target.value)
                                                                    }>
                                                                    <option value="">
                                                                        {
                                                                            adminLanguageData?.deposits_page
                                                                                ?.all_option?.value
                                                                        }
                                                                    </option>
                                                                    <option value="pending">
                                                                        {
                                                                            adminLanguageData?.deposits_page
                                                                                ?.pending_option?.value
                                                                        }
                                                                    </option>
                                                                    <option value="cancelled">
                                                                        {
                                                                            adminLanguageData?.deposits_page
                                                                                ?.cancelled_option?.value
                                                                        }
                                                                    </option>
                                                                    <option value="approved">
                                                                        {
                                                                            adminLanguageData?.deposits_page
                                                                                ?.approved_option?.value
                                                                        }
                                                                    </option>
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
                                                                        adminLanguageData?.deposits_page
                                                                            ?.username_placeholder?.value
                                                                    }
                                                                    onChange={(event) =>
                                                                        setUsername(event.target.value)
                                                                    }
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg={2} sm={6} style={{ marginLeft: "auto" }}>
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn">
                                                                    {
                                                                        adminLanguageData
                                                                            ?.common_date_time_label
                                                                            ?.submit_button_text?.value
                                                                    }
                                                                </button>
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
                                                        theme="solarized"
                                                        pagination
                                                        paginationServer
                                                        paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                        progressPending={loading || usernameLoading}
                                                        paginationTotalRows={totalRows}
                                                        onChangeRowsPerPage={handlePerRowsChange}
                                                        onChangePage={handlePageChange}
                                                        progressComponent={
                                                            <Loader style={{ minHeight: "62px" }} />
                                                        }
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
                                        </React.Fragment>
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
            title: "Deposits",
            description: "Deposits",
        },
    };
}

export default Deposits;
