import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";
import AdminLayout from "@/components/admin/AdminLayout";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import Title from "@/components/admin/UI/Title";
import ReferralModal from "@/components/admin/Modals/ReferralModal";
import IncreaseModal from "@/components/admin/Modals/IncreaseModal";
import DecreaseModal from "@/components/admin/Modals/DecreaseModal";
import Loader from "@/components/admin/UI/Loader";
import { useRouter } from "next/router";
import MonthlyNetwin from "@/components/admin/Charts/MonthlyNetwin";
import DailyNetwin from "@/components/admin/Charts/DailyNetwin";
import TopAgents from "@/components/admin/Charts/TopAgents";
import AddUserModal from "@/components/admin/Modals/AddUserModal";
import Head from "next/head";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Dashboard = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [netIncome, setNetIncome] = useState();
    const [balance, setBalance] = useState();
    const [previousMonthBalance, setPreviousMonthBalance] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [referralModal, setReferralModal] = useState(false);
    const [increaseModal, setShowIncreaseModal] = useState(false);
    const [decreaseModal, setShowDecreaseModal] = useState(false);
    const [username, setUsername] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const [userDetails, setUserDetails] = useState();
    const [netIncomeError, setNetIncomeError] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, [router]);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("NetIncome"))?.expiry < Date.now()) {
            localStorage.removeItem("NetIncome");
        }
        if (JSON.parse(localStorage.getItem("DailyNetwin"))?.expiry < Date.now()) {
            localStorage.removeItem("DailyNetwin");
        }
        if (JSON.parse(localStorage.getItem("MonthlyNetwin"))?.expiry < Date.now()) {
            localStorage.removeItem("MonthlyNetwin");
        }
    }, []);

    // set net Income data
    useEffect(() => {
        setIsLoading(true);
        const currMonthGGR = Number(netIncome?.currentGGR?.totalCommission.toFixed(4)) || 0;
        let currBalance = currMonthGGR.toLocaleString("en-US", {
            style: "currency",
            currency:
                userDefaultCurrency?.currencyAbrv ||
                JSON.parse(localStorage.getItem("User"))?.currencyObj?.currencyAbrv,
            minimumFractionDigits: currMonthGGR === 0 ? 2 : 3,
        });
        setBalance(currBalance);
        const lastMonthGGR = Number(netIncome?.lastGGR?.totalCommission.toFixed(4)) || 0;
        let prevBalance = lastMonthGGR.toLocaleString("en-US", {
            style: "currency",
            currency:
                userDefaultCurrency?.currencyAbrv ||
                JSON.parse(localStorage.getItem("User"))?.currencyObj?.currencyAbrv,
            minimumFractionDigits: lastMonthGGR === 0 ? 2 : 3,
        });
        setPreviousMonthBalance(prevBalance);
        setIsLoading(false);
    }, [netIncome]);

    /** API Commented */
    useEffect(() => {
        if (localStorage.getItem("NetIncome")) {
            setIsLoading(true);
            setNetIncome(JSON.parse(localStorage.getItem("NetIncome"))?.netIncome);
            setIsLoading(false);
        } else {
            const getNetIncome = async () => {
                setIsLoading(true);
                await axios
                    .get(
                        `${
                            process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN
                        }/casinos/casino-admin-reports?action=netIncome&token=${
                            process.env.NEXT_PUBLIC_TOKEN
                        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${
                            JSON.parse(localStorage.getItem("User"))?.remoteId
                        }`
                    )
                    .then((response) => {
                        if (response?.data?.status === 200) {
                            setNetIncome(response?.data?.commissionInfo || 0);
                            const commissionInfo = {
                                netIncome: response?.data?.commissionInfo,
                                expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
                            };
                            localStorage.setItem("NetIncome", JSON.stringify(commissionInfo));
                        } else {
                            setNetIncomeError(response?.error?.message);
                        }
                    })
                    .catch((error) => {
                        if (error.response?.status === 500) {
                            setNetIncomeError(500);
                        } else {
                            setNetIncomeError(error.message);
                        }
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            };
            getNetIncome();
        }
    }, []);

    const findChildren = (allChildren) => {
        allChildren?.forEach((child) => {
            if (child?.name === username) {
                return child;
            }
            if (child?.child?.length > 0) {
                findChildren(child?.child);
            }
        });
    };

    // get user and sub user credit
    const getUserCredit = async (e) => {
        e.preventDefault();
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        try {
            await axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setUserDetails({
                            userBalance: response.data?.data?.balance,
                            username: response.data?.data?.username,
                            remoteId: response.data?.data?.remoteId,
                        });
                        setErrorMessage("");
                        setShowIncreaseModal(true);
                    } else {
                        setErrorMessage(response?.data?.message);
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 500) {
                        setDataNotFound(true);
                    }
                    setErrorMessage(error.message);
                });
        } catch (error) {
            setErrorMessage(error);
        }
    };

    const getUserDebit = async (e) => {
        e.preventDefault();
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `username=${username}`);
        try {
            await axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-username?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&username=${username}&authKey=${authkey}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setUserDetails({
                            userBalance: response.data?.data?.balance,
                            username: response.data?.data?.username,
                            remoteId: response.data?.data?.remoteId,
                        });
                        setErrorMessage("");
                        setShowDecreaseModal(true);
                    } else {
                        setErrorMessage(response?.data?.message);
                    }
                })
                .catch((error) => {
                    if (error.response?.status === 500) {
                        setDataNotFound(true);
                    }
                    setErrorMessage(error.message);
                });
        } catch (error) {
            setErrorMessage(error);
        }
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <section className="dashboard_main">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6} className=" text-lg-start text-center">
                                <div className="title">
                                    <Title>
                                        {adminLanguageData?.dashboard_page?.dashboard_page_title?.value}
                                    </Title>
                                </div>
                            </Col>
                            <Col lg={6} className="text-lg-end text-center">
                                <button
                                    type="button"
                                    onClick={() => setReferralModal(true)}
                                    className="sec_btn">
                                    {adminLanguageData?.dashboard_page?.get_referral_link?.value}{" "}
                                    <i className="far fa-plus-circle"></i>
                                </button>
                            </Col>
                        </Row>
                    </div>

                    <Row className="g-20 justify-content-center">
                        <Col xl={4} lg={6}>
                            <div className="dashboard_box">
                                <h3 className="h3-title">
                                    {adminLanguageData?.dashboard_page?.fast_charge?.value}
                                </h3>

                                <button
                                    className="sec_btn modal-html-btn mb_10"
                                    onClick={() => setShow(true)}>
                                    {adminLanguageData?.users_page?.user_button?.value}{" "}
                                    <i className="far fa-plus-circle"></i>
                                </button>

                                <div className="referral-link-response"></div>
                                <form
                                    method="post"
                                    className="credit_debit_dashboard mt_10"
                                    onSubmit={(event) => {
                                        event.preventDefault();
                                        return;
                                    }}>
                                    <div className="form_input_group">
                                        <div className="d-flex">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text input-modal-addon">
                                                    <i className="fal fa-user"></i>
                                                </span>
                                            </div>
                                            <input
                                                name="username"
                                                type="text"
                                                className="form_input"
                                                autoComplete="off"
                                                placeholder={
                                                    adminLanguageData?.dashboard_page?.username_placeholder
                                                        ?.value
                                                }
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                        <div className="table_btn_group form_right_group">
                                            <ul>
                                                <li>
                                                    <NextTooltip
                                                        title={
                                                            adminLanguageData?.dashboard_page
                                                                ?.credit_button_tooltip?.value
                                                        }>
                                                        <button
                                                            type="button"
                                                            className="sec_btn icon_btn balance_action"
                                                            onClick={(e) => {
                                                                getUserCredit(e);
                                                            }}>
                                                            <i className="far fa-plus"></i>
                                                        </button>
                                                    </NextTooltip>
                                                </li>
                                                <li>
                                                    <NextTooltip
                                                        title={
                                                            adminLanguageData?.dashboard_page
                                                                ?.debit_button_tooltip?.value
                                                        }>
                                                        <button
                                                            type="button"
                                                            className="sec_btn icon_btn balance_action"
                                                            onClick={(e) => {
                                                                getUserDebit(e);
                                                            }}>
                                                            <i className="far fa-minus"></i>
                                                        </button>
                                                    </NextTooltip>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    {errorMessage === 500 ? (
                                        <>Something Went Wrong</>
                                    ) : (
                                        <p
                                            className="error-msg"
                                            style={{ display: errorMessage ? "block" : "none" }}>
                                            {errorMessage}
                                        </p>
                                    )}
                                </form>
                            </div>
                        </Col>
                        <Col xl={4} lg={6}>
                            <div className="dashboard_box">
                                <h3 className="h3-title">
                                    {adminLanguageData?.dashboard_page?.net_income?.value}
                                </h3>
                                <div className="dashboard_list">
                                    {isLoading ? (
                                        <Loader />
                                    ) : !netIncomeError ? (
                                        <>
                                            <ul>
                                                <li>
                                                    <label>
                                                        {
                                                            adminLanguageData?.dashboard_page?.current_month
                                                                ?.value
                                                        }{" "}
                                                        :
                                                    </label>
                                                    <span>{balance}</span>
                                                </li>
                                                <li>
                                                    <label>
                                                        {
                                                            adminLanguageData?.dashboard_page?.previous_month
                                                                ?.value
                                                        }{" "}
                                                        :
                                                    </label>{" "}
                                                    <span>{previousMonthBalance}</span>
                                                </li>
                                            </ul>
                                        </>
                                    ) : (
                                        <>
                                            {netIncomeError === 500 ? (
                                                "No Data Found"
                                            ) : (
                                                <p
                                                    className="error-msg"
                                                    style={{ display: netIncomeError ? "block" : "none" }}>
                                                    {netIncomeError}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <div className="badge_wp d-none">
                                    <span className="badge badge-minus">
                                        -4.39% <i className="far fa-level-down"></i>
                                    </span>
                                    <span className="badge badge-plus">
                                        +2.90% <i className="far fa-level-up"></i>
                                    </span>
                                    <i className="fal fa-eye"></i>
                                </div>
                            </div>
                        </Col>
                        <Col xl={4} lg={6}>
                            {/** API Commented */}
                            <MonthlyNetwin />
                        </Col>
                    </Row>

                    <Row className="g-20">
                        <Col lg={8}>
                            {/** API Commented */}
                            <DailyNetwin />
                        </Col>
                        <Col lg={4}>
                            <TopAgents
                                commission={netIncome?.topAgent?.commission}
                                isLoading={isLoading}
                                netIncomeError={netIncomeError}
                            />
                        </Col>
                    </Row>
                </section>
            </AdminLayout>

            <AddUserModal setShow={setShow} show={show} />

            <ReferralModal show={referralModal} setShow={setReferralModal} />

            <IncreaseModal show={increaseModal} setShow={setShowIncreaseModal} userDetails={userDetails} />

            <DecreaseModal show={decreaseModal} setShow={setShowDecreaseModal} userDetails={userDetails} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "dashboard",
            description: "dashboard",
        },
    };
}

export default Dashboard;
