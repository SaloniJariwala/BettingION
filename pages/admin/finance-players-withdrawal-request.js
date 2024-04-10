/* react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import WithdrawalRequestModal from "@/components/admin/Modals/WithdrawalRequestModal";
import Loader from "@/components/admin/UI/Loader";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import { FormProvider, useForm } from "react-hook-form";
import sha1 from "sha1";
import useGetConfig from "@/hooks/use-getConfig";

const FinancePlayersWithdrawalRequest = () => {
    const getConfig = useGetConfig();
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const [requestModal, setRequestModal] = useState(false);
    const [requestListData, setRequestListData] = useState([]);
    const [requestData, setRequestData] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [totalRows, setTotalRows] = useState();
    const [limit, setLimit] = useState(10);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);
    const [allCurrencies, setAllCurrencies] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["super-agent", "administrator"].includes(user?.accountType)
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
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" || user?.accountType === "super-agent"
            ? setIsNotAccessible(true)
            : setIsNotAccessible(false);
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

    useEffect(() => {
        methods.setValue("endTime", new Date(new Date().setHours(23, 59, 59)));
        methods.setValue("endDate", new Date());
        methods.setValue("startTime", new Date(new Date().setHours(0, 0, 0)));
        methods.setValue("startDate", new Date());
    }, [methods]);

    const paginationReset = () => {
        setResetPaginationToggle(!resetPaginationToggle);
    };

    const removeHeaderFooter = () => {
        const oldElem = document.getElementById("footer");
        if (oldElem) {
            oldElem.remove();
        }
    };

    const getData = (page) => {
        const dates = gettingDates();
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        removeHeaderFooter();
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/admin-transactions-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&startDate=${dates.startDateTime}&endDate=${dates.endDateTime
                }&page=${page}&limit=${limit}&currency=${selectedCurrency}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setRequestListData(response.data?.data);
                    setTotalRows(response.data?.count);
                    if (response.data?.count > 0) renderTotalWin(response.data?.currentApprovedAmount);
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

    useEffect(() => {
        paginationReset();
        getData(1);
    }, [fetchAgain, selectedCurrency]);

    const handleRequest = async (event, action, row) => {
        const payload = {
            remoteId: row.remoteId,
            transactionId: row.transactionID,
            action: action,
        };
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${row.remoteId}&transactionId=${row.transactionID}&action=${action}`
        );
        setLoading(true);
        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/withdraw-request-admin-action?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`,
                payload
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setFetchAgain(!fetchAgain);
                } else {
                    setErrorMessage(response.data.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const renderActions = (row) => {
        return (
            <div className="table_btn_group">
                <ul>
                    <li>
                        <NextTooltip
                            title={
                                adminLanguageData?.finance_players_withdrawal_request_page
                                    ?.tooltip_information?.value
                            }>
                            <button
                                type="button"
                                className="woo_wallet_withdrawal_action sec_btn icon_btn"
                                onClick={() => {
                                    setRequestData(row);
                                    setRequestModal(true);
                                }}>
                                <i className="fal fa-eye"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    {row.status === "pending" && (
                        <li>
                            <NextTooltip
                                title={
                                    adminLanguageData?.finance_players_withdrawal_request_page?.tooltip_accept
                                        ?.value
                                }>
                                <button
                                    type="button"
                                    className="woo_wallet_withdrawal_action sec_btn icon_btn"
                                    onClick={(event) => handleRequest(event, "approve", row)}>
                                    <i className="fal fa-check"></i>
                                </button>
                            </NextTooltip>
                        </li>
                    )}
                    {row.status === "pending" && (
                        <li>
                            <NextTooltip
                                title={
                                    adminLanguageData?.finance_players_withdrawal_request_page?.tooltip_reject
                                        ?.value
                                }>
                                <button
                                    type="button"
                                    className="woo_wallet_withdrawal_action sec_btn icon_btn"
                                    onClick={(event) => handleRequest(event, "cancel", row)}>
                                    <i className="fal fa-times"></i>
                                </button>
                            </NextTooltip>
                        </li>
                    )}
                </ul>
            </div>
        );
    };

    const handlePageChange = async (page) => {
        setErrorMessage("");
        const dates = gettingDates();
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        removeHeaderFooter();
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/admin-transactions-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&startDate=${dates.startDateTime}&endDate=${dates.endDateTime
                }&page=${page}&limit=${limit}&currency=${selectedCurrency}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setRequestListData(response.data?.data);
                    setTotalRows(response.data?.count);
                    if (response.data?.count > 0) renderTotalWin(response.data?.currentApprovedAmount);
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

    const handlePerRowsChange = async (newPerPage, page) => {
        setErrorMessage("");
        setLimit(newPerPage);
        const dates = gettingDates();
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        removeHeaderFooter();
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/admin-transactions-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&startDate=${dates.startDateTime}&endDate=${dates.endDateTime
                }&page=${page}&limit=${newPerPage}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setRequestListData(response.data?.data);
                    setTotalRows(response.data?.count);
                    if (response.data?.count > 0) renderTotalWin(response.data?.currentApprovedAmount);
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

    const columns = [
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_user?.value,
            grow: 1.6,
            selector: (row) => `${row.username} (${row.email})`,
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_amount?.value,
            grow: 1,
            // maxWidth: "150px",
            selector: (row) => renderAmountWithCurrency(row.amount, row.currency),
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_gateway_charge
                ?.value,
            grow: 1,
            maxWidth: "180px",
            selector: (row) => renderAmountWithCurrency(0, row.currency),
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_status?.value,
            grow: 1,
            maxWidth: "110px",
            selector: (row) => row.status.toString().charAt(0).toUpperCase() + row.status.slice(1),
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_method?.value,
            grow: 1,
            selector: (row) => `${row.withdrawMethod} - ${row.withdrawCoin}`,
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_date?.value,
            grow: 1,
            selector: (row) => getDescriptiveDate(row.createdAt, "showTime"),
        },
        {
            name: adminLanguageData?.finance_players_withdrawal_request_page?.table_cell_action?.value,
            grow: 1,
            minWidth: "250px",
            selector: (row) => renderActions(row),
        },
    ];

    const renderTotalWin = (pendingAmount) => {
        if (selectedCurrency) {
            const html = `
                <div>
                    <span>${adminLanguageData?.finance_players_withdrawal_request_page?.total_withdrawals_approved
                    ?.value
                } : </span><span> ${renderAmountWithCurrency(pendingAmount, selectedCurrency)}</span>
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
        }
    };

    const handleFormSubmit = async () => {
        paginationReset();
        await getData(1);
    };

    const paginationComponentOptions = {
        rowsPerPageText: adminLanguageData?.common_table_text?.row_per_page_label?.value || "Row Per Page",
    };

    return (
        <AdminLayout>
            <section className="user_main_sec">
                <div className="title_bar">
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <div className="title">
                                <h1 className="h1-title">
                                    {
                                        adminLanguageData?.finance_players_withdrawal_request_page
                                            ?.finance_players_withdrawal_request_page_title?.value
                                    }
                                </h1>
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="user_main_sec_content">
                    <Row>
                        <Col lg={12}>
                            <div className="use_main_form">
                                <FormProvider {...methods}>
                                    <form
                                        className="charges-withdrawals-form"
                                        onSubmit={methods.handleSubmit(handleFormSubmit)}>
                                        <Row className="g-10 align-items-end">
                                            <Col lg={12}>
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
                                            </Col>
                                        </Row>

                                        <Row className="g-10">
                                            <Col lg={3} sm={12}>
                                                <div className="form_input_wp form-element">
                                                    <select
                                                        className="form-select casino-provider-select"
                                                        aria-label="Select Providers"
                                                        onChange={(event) =>
                                                            setSelectedCurrency(event.target.value)
                                                        }>
                                                        <option value="">Select Currency</option>
                                                        {getConfig?.optionsData?.paymentCurrenciesOptions?.map((currency) => (
                                                            <option
                                                                value={currency?.value}
                                                                key={currency?.value}>
                                                                {currency?.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <i className="far fa-angle-down"></i>
                                                </div>
                                            </Col>

                                            <Col lg={6} className="for_des"></Col>

                                            <Col lg={3} sm={12}>
                                                <div className="submit_btn mb_20">
                                                    <button type="submit" className="sec_btn">
                                                        {
                                                            adminLanguageData?.common_date_time_label
                                                                ?.submit_button_text?.value
                                                        }
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </FormProvider>
                            </div>
                        </Col>
                        <Col lg={12}>
                            {!isNotAccessible ? (
                                <p className="error-msg" style={{ display: "block" }}>
                                    {
                                        adminLanguageData?.common_restriction_message
                                            ?.page_not_accessible_message?.value
                                    }
                                </p>
                            ) : (
                                <div
                                    className={
                                        requestListData.length > 0
                                            ? "dataTables_wrapper"
                                            : "dataTables_wrapper noData"
                                    }>
                                    {!errorMessage ? (
                                        <DataTable
                                            columns={columns}
                                            data={requestListData}
                                            progressPending={loading}
                                            progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                            theme="solarized"
                                            pagination
                                            paginationServer
                                            paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
                                            paginationTotalRows={totalRows}
                                            paginationResetDefaultPage={resetPaginationToggle}
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
                                            }}>
                                            {errorMessage}
                                        </p>
                                    )}

                                    <WithdrawalRequestModal
                                        show={requestModal}
                                        setShow={setRequestModal}
                                        requestData={requestData}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </div>
            </section>
        </AdminLayout>
    );
};

export default FinancePlayersWithdrawalRequest;
