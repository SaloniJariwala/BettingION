/* eslint-disable react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import CollectModal from "@/components/admin/Modals/FinanceModals/CollectModal";
import PlayOutModal from "@/components/admin/Modals/FinanceModals/PlayOutModal";
import DiscountModal from "@/components/admin/Modals/FinanceModals/DiscountModal";
import SubChargeModal from "@/components/admin/Modals/FinanceModals/SurchargeModal";
import Loader from "@/components/admin/UI/Loader";
import axios from "axios";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import sha1 from "sha1";
import Head from "next/head";
import { useRouter } from "next/router";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const FinancePlayerOperation = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [collectModal, setCollectModal] = useState(false);
    const [playOutModal, setPlayOutModal] = useState(false);
    const [discountModal, setDiscountModal] = useState(false);
    const [subChargeModal, setSubChargeModal] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [username, setUsername] = useState("");
    const [userDetails, setUserDetails] = useState();
    const [fetchAgain, setFetchAgain] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["super-agent", "administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    const renderData = () => {
        setFetchAgain(!fetchAgain);
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

    const renderAction = (row) => {
        const modalData = {
            userId: row.remoteId,
            username: row.username || row.id,
            balance: row.balance,
        };

        return (
            <div className="table_btn_group form_right_group">
                <ul>
                    <li>
                        <NextTooltip title={adminLanguageData?.common_finance_module?.tooltip_collect?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn double-icon-btn"
                                onClick={() => {
                                    setCollectModal(true);
                                    setUserDetails(modalData);
                                }}
                            >
                                <i className="far fa-plus"></i>
                                <i className="fas fa-sack-dollar"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title={adminLanguageData?.common_finance_module?.tooltip_register_payout?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn double-icon-btn"
                                onClick={() => {
                                    setPlayOutModal(true);
                                    setUserDetails(modalData);
                                }}
                            >
                                <i className="far fa-minus"></i>
                                <i className="fas fa-sack-dollar"></i>
                            </button>
                        </NextTooltip>
                    </li>

                    <li>
                        <NextTooltip title={adminLanguageData?.common_finance_module?.tooltip_discount?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn balance_action"
                                onClick={() => {
                                    setDiscountModal(true);
                                    setUserDetails(modalData);
                                }}
                            >
                                <i className="far fa-minus"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title="Surcharge">
                            <button
                                type="button"
                                className="sec_btn icon_btn balance_action"
                                onClick={() => {
                                    setSubChargeModal(true);
                                    setUserDetails(modalData);
                                }}
                            >
                                <i className="far fa-plus"></i>
                            </button>
                        </NextTooltip>
                    </li>
                </ul>
            </div>
        );
    };

    const getData = () => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&action=finance-user-list`);
        setLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/finance-user/actions?action=finance-user-list&type=player&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&username=${username}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setErrorMessage("");
                    if (response.data?.data?.users?.length > 0) {
                        setData([
                            ...response.data?.data?.users,
                            {
                                id: "footer",
                                username: <b>Total Payment</b>,
                                role: "",
                                balance: response.data?.data?.totalBalance,
                            },
                        ]);
                    } else {
                        setData([]);
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

    useEffect(() => {
        getData();
    }, [fetchAgain]);

    const columns = [
        {
            name: adminLanguageData?.finance_players_operation_page?.table_cell_user?.value,
            minWidth: "200px",
            grow: 1,
            selector: (row) => row.username || row.id,
        },
        {
            name: adminLanguageData?.finance_players_operation_page?.table_cell_balance?.value,
            grow: 1,
            selector: (row) =>
                row.id === "footer" ? <b>{renderAmountWithCurrency(row.balance, userDefaultCurrency?.currencyAbrv)}</b> : renderAmountWithCurrency(row.balance, userDefaultCurrency?.currencyAbrv),
        },
        {
            name: adminLanguageData?.finance_players_operation_page?.table_cell_actions?.value,
            grow: 1,
            minWidth: "210px",
            selector: (row) => (row.id === "footer" ? "" : renderAction(row)),
        },
    ];

    const handleFormSubmit = (event) => {
        event.preventDefault();
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
                                    <Title>{adminLanguageData?.finance_players_operation_page?.finance_players_operation_page_title?.value}</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <div className="user_main_sec_content">
                        <form onSubmit={handleFormSubmit}>
                            <Row>
                                <Col lg={12}>
                                    <div className={data.length > 0 ? "dataTables_wrapper" : "dataTables_wrapper noData"}>
                                        <div className="table_filter_topbar finance_data">
                                            <Row className="align-items-center">
                                                <Col sm={12}>
                                                    <div className="finance-operations-top-bar">
                                                        <div id="finance_operations_filter" className="dataTables_filter">
                                                            <label>
                                                                <input
                                                                    type="search"
                                                                    className="form_input"
                                                                    placeholder={adminLanguageData?.finance_players_operation_page?.username_placeholder?.value}
                                                                    aria-controls="finance_operations"
                                                                    value={username}
                                                                    onChange={(event) => setUsername(event.target.value)}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="table_submit_button">
                                                            <div className="submit_btn">
                                                                <button type="submit" className="sec_btn finance-operations-submit">
                                                                    {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </div>

                                        {!errorMessage ? (
                                            <DataTable
                                                columns={columns}
                                                data={data}
                                                theme="solarized"
                                                progressPending={loading}
                                                progressComponent={<Loader style={{ minHeight: "62px" }} />}
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
                        </form>
                    </div>
                </div>
            </AdminLayout>

            <CollectModal show={collectModal} setShow={setCollectModal} userDetails={userDetails} type="player" renderData={renderData} />
            <PlayOutModal show={playOutModal} setShow={setPlayOutModal} userDetails={userDetails} type="player" renderData={renderData} />
            <DiscountModal show={discountModal} setShow={setDiscountModal} userDetails={userDetails} type="player" renderData={renderData} />
            <SubChargeModal show={subChargeModal} setShow={setSubChargeModal} userDetails={userDetails} type="player" renderData={renderData} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Finance player operation",
            description: "Finance player operation",
        },
    };
}

export default FinancePlayerOperation;
