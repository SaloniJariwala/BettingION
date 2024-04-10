/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import { FormProvider, useForm } from "react-hook-form";
import StartTimeContainer from "@/components/admin/FormField/StartTimeContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import EndTimeContainer from "@/components/admin/FormField/EndTimeContainer";
import axios from "axios";
import Loader from "@/components/admin/UI/Loader";
import { getDateAndTime } from "@/utils/getDateAndTime";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import AdminModal from "@/components/admin/AdminModal";
import Image from "next/image";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const FinanceAgentBalances = (props) => {
    const methods = useForm();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [childAgents, setChildAgents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [data, setData] = useState([]);
    const [userId, setUserId] = useState("all");
    const [operationType, setOperationType] = useState("all");
    const [open, setOpen] = useState(false);
    const [modalImage, setModalImage] = useState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["super-agent", "administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
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

    /**
     * Agents dropdown
     */
    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&accountType=agent&isFlat=true&authKey=${authkey}`
            )
            .then(async (response) => {
                if (response.data?.status) {
                    setChildAgents(response.data?.data?.child?.filter((item) => item.accountType === "agent"));
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
    useEffect(() => {
        getData();
    }, []);

    const getClassName = (operation) => {
        const operationsList = ["collect", "discount", "payout", "surcharge", "Add Credit", "Remove Credit"];
        return operationsList.includes(operation) ? `finance_status_${operation.toLowerCase().replace(" ", "_")}` : "";
    };

    const renderAction = (row) => {
        return (
            <>
                {(row.image || row.comment) && (
                    <div className="table_attachment_row">
                        <button type="button" className="sec_btn icon_btn">
                            <i className="fas fa-paperclip"></i>
                        </button>
                        <div className="table_attachment_hover">
                            {row.comment && (
                                <NextTooltip html={row.comment}>
                                    <button type="button" className="sec_btn icon_btn">
                                        <i className="far fa-comment"></i>
                                    </button>
                                </NextTooltip>
                            )}

                            {row.image && (
                                <NextTooltip html={`<img src=${row.image}>`}>
                                    <button
                                        className="sec_btn icon_btn"
                                        onClick={() => {
                                            setOpen(true);
                                            setModalImage(row.image);
                                        }}
                                    >
                                        <i className="far fa-image"></i>
                                    </button>
                                </NextTooltip>
                            )}
                        </div>
                    </div>
                )}
            </>
        );
    };

    const columns = [
        {
            name: adminLanguageData?.finance_agent_balances_page?.table_cell_date?.value,
            grow: 1,
            minWidth: "190px",
            selector: (row) => <span className={getClassName(row.operation)}>{getDateAndTime(row.createdAt)}</span>,
        },
        {
            name: adminLanguageData?.finance_agent_balances_page?.table_cell_user?.value,
            grow: 1,
            selector: (row) => <span className={getClassName(row.operation)}>{row.username}</span>,
        },
        {
            name: adminLanguageData?.finance_agent_balances_page?.table_cell_operation?.value,
            grow: 1,
            minWidth: "100px",
            maxWidth: "400px",
            selector: (row) => (
                <span
                    className={getClassName(row.operation)}
                    style={{
                        fontWeight: row.id === "footer" && "bold",
                        color: row.id === "footer" && "white",
                    }}
                >
                    {row.operation}
                </span>
            ),
        },
        {
            name: adminLanguageData?.finance_agent_balances_page?.table_cell_amount?.value,
            grow: 1,
            maxWidth: "200px",
            selector: (row) => (
                <span
                    className={getClassName(row.operation)}
                    style={{
                        fontWeight: row.id === "footer" && "bold",
                        color: row.id === "footer" && "white",
                    }}
                >
                    {renderAmountWithCurrency(row.amount, userDefaultCurrency?.currencyAbrv)}
                </span>
            ),
        },
        {
            name: "",
            grow: 0,
            maxWidth: "80px",
            selector: (row) => renderAction(row),
        },
    ];

    const getData = async () => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&action=finance-user-txns`);

        const dates = gettingDates();
        setLoading(true);

        await axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/finance-user/actions?action=finance-user-txns&type=agent-txns&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&user_search=${userId}&auth_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&operation_type=${operationType}&startDate=${dates.startDateTime}&endDate=${
                    dates.endDateTime
                }&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.txns?.length > 0) {
                        setData([
                            ...response.data?.data?.txns,
                            {
                                id: "footer",
                                remoteId: "",
                                amount: response.data?.data?.totalAmount,
                                operation: "Total",
                                transactionId: "",
                                createdAt: "",
                                balance: "",
                                image: "",
                                comment: "",
                            },
                        ]);
                    } else {
                        setData(response.data?.data?.txns);
                    }
                } else {
                    setErrorMessage(response.data?.message);
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

    const handleFormSubmit = async () => {
        await getData();
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
                                    <Title>{adminLanguageData?.finance_agent_balances_page?.finance_agent_balances_page_title?.value}</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <Row>
                            <Col lg={12}>
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
                                                    <div className="form_input_wp form-element">
                                                        <select
                                                            className="form-select casino-provider-select"
                                                            aria-label="Select Providers"
                                                            value={userId}
                                                            onChange={(event) => setUserId(event.target.value)}
                                                        >
                                                            <option defaultValue="All Agents" value="all">
                                                                {adminLanguageData?.finance_agent_balances_page?.all_agent_options?.value}
                                                            </option>
                                                            {childAgents?.map((item) => (
                                                                <option value={item.id} key={item.id}>
                                                                    {item.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <i className="far fa-angle-down"></i>
                                                    </div>
                                                </Col>
                                                <Col lg={3} sm={6}>
                                                    <div className="form_input_wp form-element">
                                                        <select
                                                            className="form-select casino-provider-select"
                                                            aria-label="Select Providers"
                                                            value={operationType}
                                                            onChange={(event) => setOperationType(event.target.value)}
                                                        >
                                                            <option defaultValue="All Operations" value="all">
                                                                {adminLanguageData?.common_finance_module?.all_operations_option?.value}
                                                            </option>
                                                            <option value="collect">{adminLanguageData?.common_finance_module?.collect_option?.value}</option>
                                                            <option value="payout">{adminLanguageData?.common_finance_module?.payout_option?.value}</option>
                                                            <option value="discount">{adminLanguageData?.common_finance_module?.discount_option?.value}</option>
                                                            <option value="surcharge">{adminLanguageData?.common_finance_module?.surcharge_option?.value}</option>
                                                        </select>
                                                        <i className="far fa-angle-down"></i>
                                                    </div>
                                                </Col>
                                                <Col lg={3} sm={6} className="for_des"></Col>
                                                <Col lg={3} sm={6}>
                                                    <div className="submit_btn">
                                                        <button type="submit" className="sec_btn">
                                                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <div className={data?.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                                {!errorMessage ? (
                                                    <DataTable
                                                        className="balances_table"
                                                        columns={columns}
                                                        data={data}
                                                        theme="solarized"
                                                        progressPending={loading}
                                                        progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                                        noDataComponent={"No matching records found"}
                                                    />
                                                ) : errorMessage === 500 ? (
                                                    <>No Data Found</>
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
                        </Row>
                    </div>
                </div>

                <AdminModal
                    className="light_box_modal"
                    show={open}
                    closeModal={() => {
                        setOpen(false);
                        setModalImage("");
                    }}
                    size="lg"
                >
                    <div className="light_box_img_wp">
                        {!modalImage && <Loader />}
                        <Image src={modalImage} alt="modal" height={1500} width={1500} />
                    </div>
                </AdminModal>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Finance agent balances",
            description: "Finance agent balances",
        },
    };
}

export default FinanceAgentBalances;
