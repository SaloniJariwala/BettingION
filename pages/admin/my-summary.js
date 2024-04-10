import AdminLayout from "@/components/admin/AdminLayout";
import Loader from "@/components/admin/UI/Loader";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { BalanceState } from "@/context/BalanceProvider";
import { getDateAndTime } from "@/utils/getDateAndTime";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";

const MySummary = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [errorMessage, setErrorMessage] = useState();
    const [summaryData, setSummaryData] = useState([]);
    const [currentBalance, setCurrentBalance] = useState();
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(10);

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

    const displayData = (data) => {
        if (data === "payout") {
            return "finance_status_payout";
        } else if (data === "collect") {
            return "finance_status_collect";
        } else if (data === "surcharge") {
            return "finance_status_surcharge";
        } else {
            return;
        }
    };

    const columns = [
        {
            name: adminLanguageData?.my_summary_page?.table_cell_date?.value,
            grow: 1,
            minWidth: "200px",
            selector: (row) => <span className={displayData(row?.operation)}>{getDateAndTime(row?.createdAt)}</span>,
        },
        {
            name: adminLanguageData?.my_summary_page?.table_cell_operation?.value,
            grow: 1,
            minWidth: "220px",
            selector: (row) => <span className={displayData(row?.operation)}>{row?.operation}</span>,
        },
        {
            name: adminLanguageData?.my_summary_page?.table_cell_amount?.value,
            grow: 1,
            selector: (row) => <span className={displayData(row?.operation)}>{renderAmountWithCurrency(row?.amount, userDefaultCurrency?.currencyAbrv)}</span>,
        },

        {
            name: adminLanguageData?.my_summary_page?.table_cell_balance?.value,
            grow: 1,
            selector: (row) => <span className={displayData(row?.operation)}>{renderAmountWithCurrency(row?.amount, userDefaultCurrency?.currencyAbrv)}</span>,
        },
    ];
    const getSummaryData = (page) => {
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/casino-admin-reports?action=my-summary&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&page=${page}&limit=${limit}`
            )
            .then((response) => {
                if (response.data.status === 200) {
                    setSummaryData(response.data.data.txns);
                    setCurrentBalance(response.data.data?.currentBalance);
                    setTotalRows(response.data?.data?.totalCount);
                    setLoading(false);
                } else {
                    setErrorMessage(response?.data?.message);
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
        getSummaryData(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePerRowsChange = async (limit, page) => {
        setLimit(limit);
        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/casino-admin-reports?action=my-summary&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&page=${page}&limit=${limit}`
            )
            .then((response) => {
                if (response.data.status === 200) {
                    setSummaryData(response.data.data.txns);
                    setCurrentBalance(response.data.data?.currentBalance);
                    setTotalRows(response.data?.data?.totalCount);
                } else {
                    setErrorMessage(response?.data?.message);
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

    const handlePageChange = (page) => {
        getSummaryData(page);
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
                <section className="user_main_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={5}>
                                <div className="title">
                                    <h1 className="h1-title">{adminLanguageData?.my_summary_page?.my_summary_page_title?.value}</h1>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <Row>
                            <Col lg={12}>
                                <div className="my-summary-payment">
                                    <p>
                                        {adminLanguageData?.my_summary_page?.payment?.value}: <span>{renderAmountWithCurrency(currentBalance, userDefaultCurrency?.currencyAbrv)}</span>
                                    </p>
                                </div>
                                <div className={summaryData.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                    {!errorMessage ? (
                                        <DataTable
                                            columns={columns}
                                            data={summaryData}
                                            paginationTotalRows={totalRows}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            onChangePage={handlePageChange}
                                            progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                            progressPending={loading}
                                            theme="solarized"
                                            pagination
                                            paginationServer
                                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
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
                            </Col>
                        </Row>
                    </div>
                </section>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "My-summary",
            description: "My-summary",
        },
    };
}

export default MySummary;
