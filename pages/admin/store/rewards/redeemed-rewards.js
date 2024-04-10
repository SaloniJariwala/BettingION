/* react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import Loader from "@/components/admin/UI/Loader";
import Select from "react-select";
import Link from "next/link";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import sha1 from "sha1";
import { getDateAndTime } from "@/utils/getDateAndTime";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import useGetConfig from "@/hooks/use-getConfig";

const RedeemedRewards = (props) => {
    const getConfig = useGetConfig();
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [errorMessage, setErrorMessage] = useState();
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [data, setData] = useState([]);
    const [currency, setCurrency] = useState("");
    const [search, setSearch] = useState("");
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

    const gettingDates = () => {
        let startDate = methods.getValues("startDate");
        let endDate = methods.getValues("endDate");

        if (!startDate) startDate = new Date();
        if (!endDate) endDate = new Date();

        const startDateTime = `${startDate?.getFullYear()}-${startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)
            }-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()}T00:00:00Z`;
        const endDateTime = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)
            }-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()}T23:59:59Z`;

        return {
            startDateTime,
            endDateTime,
        };
    };

    useEffect(() => {
        methods.setValue("startDate", new Date());
        methods.setValue("endDate", new Date());
    }, [methods]);

    const getData = async (currentPage = page, rowsLimit = limit) => {
        const dates = gettingDates();
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/report?action=redeemed-report&token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&page=${currentPage}&limit=${rowsLimit}&remoteId=${JSON.parse(localStorage.getItem("User"))?.userId
                }&start=${dates?.startDateTime}&end=${dates?.endDateTime}${currency && "&currency=" + currency
                }&searchFilter=${search}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setData(response.data?.data?.txns);
                    setTotalRows(response.data?.data?.totalTxn);
                } else {
                    setData([]);
                }
            })
            .catch((error) => {
                setData([]);
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
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_id?.value,
            maxWidth: "140px",
            grow: 1,
            selector: (row) => row.id,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_username?.value,
            grow: 2,
            maxWidth: "300px",
            minWidth: "200px",
            selector: (row) => row.username,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_reward_name?.value,
            grow: 1.2,
            maxWidth: "200px",
            minWidth: "130px",
            selector: (row) => row.rewardName,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_id?.value,
            grow: 1,
            minWidth: "120px",
            selector: (row) => row.currency,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_points?.value,
            grow: 1,
            selector: (row) => row.points,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_amount?.value,
            grow: 1,
            selector: (row) => row.amount,
        },
        {
            name: adminLanguageData?.store_reports_redeemed_rewards_page
                ?.store_reports_redeemed_rewards_list_date?.value,
            grow: 1,
            minWidth: "125px",
            selector: (row) => getDateAndTime(row.createdAt),
        },
    ];

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

    const handleFormSubmit = async (event) => {
        // if (username) {
        //     setLoading(true);
        //     getUserById();
        //     return;
        // }
        // setLoading(true);
        await getData(1);
        setPage(1);
        paginationReset();
        // getData(1);
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
                <div className="rewards_list_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {
                                            adminLanguageData?.store_reports_redeemed_rewards_page
                                                ?.store_reports_redeemed_rewards_page_title?.value
                                        }
                                    </Title>
                                </div>
                            </Col>
                            {isNotAccessible && (
                                <Col lg={6} className="text-lg-end">
                                    <Link href="./create" className="sec_btn sm_btn" type="button">
                                        {
                                            adminLanguageData?.store_reports_redeemed_rewards_page
                                                ?.store_reports_redeemed_rewards_new_button?.value
                                        }
                                        <i className="far fa-plus-circle"></i>
                                    </Link>
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
                            <FormProvider {...methods}>
                                <form
                                    method="POST"
                                    onSubmit={methods.handleSubmit(handleFormSubmit)}
                                    className="use_main_form">
                                    <Row className="align-items-end">
                                        <Col lg={3}>
                                            <div className="form_input_wp">
                                                <label>
                                                    {
                                                        adminLanguageData?.store_reports_redeemed_rewards_page
                                                            ?.store_reports_redeemed_rewards_currency?.value
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
                                                <StartDateContainer methods={methods} />
                                            </div>
                                        </Col>
                                        <Col lg={3}>
                                            <div className="form_input_wp">
                                                <EndDateContainer methods={methods} />
                                            </div>
                                        </Col>
                                        <Col lg={2} style={{ marginLeft: "auto" }}>
                                            <div className="form_input_wp">
                                                <div className="submit_btn text-lg-end">
                                                    <button type="submit" className="sec_btn">
                                                        {
                                                            adminLanguageData?.common_date_time_label
                                                                ?.submit_button_text?.value
                                                        }
                                                    </button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </form>
                            </FormProvider>

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
                                                            placeholder="search..."
                                                            aria-controls="user_data"
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
            title: "Redeemed rewards",
            description: "Redeemed rewards",
        },
    };
}

export default RedeemedRewards;
