/* react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import Loader from "@/components/admin/UI/Loader";
import Select from "react-select";
import DatePicker from "react-datepicker";
import Link from "next/link";
import axios from "axios";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import useGetConfig from "@/hooks/use-getConfig";

const StoreBalances = (props) => {
    const getConfig = useGetConfig();
    const { adminLanguageData } = AdminLanguageState();
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [errorMessage, setErrorMessage] = useState();
    const [data, setData] = useState();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [search, setSearch] = useState("");
    const [currency, setCurrency] = useState("");
    const [totalBalances, setTotalBalances] = useState(0);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    const getData = async (currentPage = page, rowsLimit = limit) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/report?action=balances-report&token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&page=${currentPage}&limit=${rowsLimit}&username=${search}${currency && "&currency=" + currency
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setData(response.data?.data?.pointsReport);
                    setTotalRows(response.data?.data?.totalPlayers);
                    setTotalBalances(response.data?.data?.totalPoints);
                } else {
                    setData(response.data?.message);
                    setTotalBalances(0);
                }
            })
            .catch((error) => {
                setTotalBalances(0);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setPage(1);
        paginationReset();
        getData(1);
    }, [search]);

    const paginationReset = () => {
        setResetPaginationToggle(!resetPaginationToggle);
    };

    const handlePageChange = async (page) => {
        setPage(page);
        getData(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLimit(newPerPage);
        setPage(page);
        getData(page, newPerPage);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setPage(page);
        paginationReset();
        getData(1, limit);
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
            name: adminLanguageData?.store_reports_store_balances_page?.store_reports_store_balances_list_id
                ?.value,
            minWidth: "200px",
            selector: (row) => row.id,
        },
        {
            name: adminLanguageData?.store_reports_store_balances_page
                ?.store_reports_store_balances_list_username?.value,
            minWidth: "200px",
            selector: (row) => row.username,
        },
        {
            name: adminLanguageData?.store_reports_store_balances_page
                ?.store_reports_store_balances_list_balance?.value,
            maxWidth: "300px",
            selector: (row) => row.points,
        },
    ];

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
                <div className="rewards_list_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {
                                            adminLanguageData?.store_reports_store_balances_page
                                                ?.store_reports_store_balances_page_title?.value
                                        }
                                    </Title>
                                </div>
                            </Col>
                            {isNotAccessible && (
                                <Col lg={6} className="text-lg-end">
                                    <div className="my-summary-payment">
                                        <p>
                                            {
                                                adminLanguageData?.store_reports_store_balances_page
                                                    ?.store_reports_store_balances_total_balances?.value
                                            }
                                            :{" "}
                                            {!loading ? (
                                                <span>{`${totalBalances} PTS`}</span>
                                            ) : (
                                                <span className="load-more" style={{ display: "inline" }}>
                                                    <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </Col>
                            )}
                        </Row>
                    </div>

                    {!isNotAccessible ? (
                        <Col lg={12}>
                            <div className="use_main_form">
                                <p className="error-msg" style={{ display: "block" }}>
                                    You don&apos;t have permissions to access this page
                                </p>
                            </div>
                        </Col>
                    ) : (
                        <>
                            <form method="POST" onSubmit={handleSubmit}>
                                <Row className="align-items-end">
                                    <Col xl={3} lg={5}>
                                        <div className="form_input_wp">
                                            <label>
                                                {
                                                    adminLanguageData?.store_reports_store_balances_page
                                                        ?.store_reports_store_balances_currency?.value
                                                }
                                            </label>
                                            <Select
                                                name="currency"
                                                className="select_box form_input"
                                                classNamePrefix="react-select"
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary: "#fff",
                                                        primary25: "#bd57fb",
                                                        neutral0: "black",
                                                    },
                                                })}
                                                onChange={(currency) => {
                                                    setCurrency(currency?.value);
                                                }}
                                                options={getConfig?.optionsData?.paymentCurrenciesOptions}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="form_input_wp">
                                            <div className="submit_btn">
                                                <button type="submit" className="sec_btn">
                                                    {
                                                        adminLanguageData?.common_date_time_label?.submit_button_text
                                                            ?.value
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </form>

                            <div className={data?.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                {!errorMessage ? (
                                    <>
                                        {(search !== "" || data?.length > 0) && (
                                            <Row className="align-items-center">
                                                <Col xl={3} md={6} style={{ marginLeft: "auto" }}>
                                                    <div className="form_input_wp">
                                                        <i className="fal fa-search"></i>
                                                        <input
                                                            type="search"
                                                            className="form_input"
                                                            placeholder={
                                                                adminLanguageData?.store_reports_store_balances_page
                                                                    ?.store_reports_store_balances_search_placeholder
                                                                    ?.value
                                                            }
                                                            aria-controls="user_data"
                                                            value={search}
                                                            onChange={(event) => setSearch(event.target.value)}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                        )}
                                        <DataTable
                                            columns={columns}
                                            data={data}
                                            pagination
                                            paginationServer
                                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                            paginationResetDefaultPage={resetPaginationToggle}
                                            progressPending={loading}
                                            progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                            paginationTotalRows={totalRows}
                                            onChangeRowsPerPage={handlePerRowsChange}
                                            onChangePage={handlePageChange}
                                            noDataComponent={adminLanguageData?.no_records_found?.value}
                                            theme="solarized"
                                            paginationComponentOptions={paginationComponentOptions}
                                        />
                                    </>
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
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Store balances",
            description: "Store balances",
        },
    };
}

export default StoreBalances;
