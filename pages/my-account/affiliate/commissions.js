import AccountAffiliate from "@/components/frontend/account/AccountAffiliate";
import Head from "next/head";
import coin from "@/frontend/images/coin/btc.svg";
import Image from "next/image";
import Button from "@/components/frontend/UI/Button";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import Loader from "@/components/admin/UI/Loader";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { useRouter } from "next/router";
import Link from "next/link";
import { LanguageState } from "@/context/FrontLanguageProvider";

const Commissions = (props) => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [commissionData, setCommissionData] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawErrorMessage, setWithdrawErrorMessage] = useState("");
    const [fetchAgain, setFetchAgain] = useState(false);

    useEffect(() => {
        if (typeof localStorage === "undefined" && !JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/commission-report?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setCommissionData(response.data?.data);
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
    }, [fetchAgain]);

    const handleWithdraw = () => {
        setWithdrawErrorMessage("");
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        setWithdrawLoading(true);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/withdraw-referral?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setFetchAgain((prev) => !prev);
                } else {
                    setWithdrawErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setWithdrawErrorMessage(error.message);
            })
            .finally(() => {
                setWithdrawLoading(false);
            });
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountAffiliate>
                {loading && (
                    <span
                        className="load-more"
                        style={{
                            display: "flex",
                            textAlign: "center",
                            margin: 0,
                            fontSize: "30px",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}>
                        <i className="fad fa-spinner-third fa-spin"></i>
                    </span>
                )}
                {errorMessage ? (
                    <p
                        className="error-msg"
                        style={{
                            display: errorMessage ? "block" : "none",
                        }}>
                        {errorMessage}
                    </p>
                ) : (
                    <>
                        <section className={`affiliate_commissions_sec ${loading ? "d-none" : ""}`}>
                            <div className="affiliate_balance_sec">
                                <div className="affiliate_commissions_box_wp">
                                    <div className="affiliate_commissions_box affiliate_commissions_earned">
                                        <span className="affiliate_commissions_icon">
                                            <i className="far fa-dollar-sign"></i>
                                        </span>
                                        <h2 className="amount">
                                            {renderAmountWithCurrency(
                                                commissionData?.totalEarned,
                                                userDefaultCurrency?.currencyAbrv
                                            )}
                                        </h2>
                                        <p>{languageData?.affiliate_page?.total_earned?.value}</p>
                                    </div>

                                    <div className="affiliate_commissions_box affiliate_commissions_paid">
                                        <span className="affiliate_commissions_icon">
                                            <i className="far fa-dollar-sign"></i>
                                        </span>
                                        <h2 className="amount">
                                            {renderAmountWithCurrency(
                                                commissionData?.totalPaid,
                                                userDefaultCurrency?.currencyAbrv
                                            )}
                                        </h2>
                                        <p>{languageData?.affiliate_page?.total_paid?.value}</p>
                                    </div>

                                    <div className="affiliate_commissions_box affiliate_commissions_gross">
                                        <span className="affiliate_commissions_icon">
                                            <i className="far fa-dollar-sign"></i>
                                        </span>
                                        <h2 className="amount">
                                            {renderAmountWithCurrency(
                                                commissionData?.totalGGR,
                                                userDefaultCurrency?.currencyAbrv
                                            )}
                                        </h2>
                                            <p>{languageData?.affiliate_page?.gross_generated_revenue?.value || "Gross Generated Revenue"}</p>
                                    </div>
                                </div>

                                <div className="affiliate_commissions_referral">
                                    <div className="ca_details_input">
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: languageData?.affiliate_page?.go_to_campaigns?.value,
                                            }}></span>
                                        <NextTooltip title={languageData?.go_to_campaign_tooltip?.value}>
                                            <button
                                                className="ca_details_input_copy"
                                                onClick={() => router.push("./campaigns")}>
                                                <i className="far fa-external-link"></i>
                                            </button>
                                        </NextTooltip>
                                    </div>
                                    <p>
                                        {languageData?.affiliate_page?.share_referral_link_message?.value}{" "}
                                        <span>
                                            {commissionData?.defaultAffiliateCommission}%{" "}
                                            {languageData?.affiliate_page?.commission?.value}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <hr />

                            <div className="table-responsive affiliate_table">
                                <table className="custom_table" cellSpacing="0" cellPadding="0">
                                    <thead>
                                        <tr>
                                            <th>{languageData?.affiliate_page?.table_cell_total?.value}</th>
                                            <th>
                                                {languageData?.affiliate_page?.table_cell_withdrawn?.value}
                                            </th>
                                            <th>
                                                {languageData?.affiliate_page?.table_cell_available?.value}
                                            </th>
                                            <th style={{ width: "200px" }}>
                                                {languageData?.affiliate_page?.table_cell_cashout?.value}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span className="coin_info">
                                                    {/* <Image src={coin} width={20} height={20} alt="BTC" /> */}
                                                    {renderAmountWithCurrency(
                                                        commissionData?.totalEarnedByCurrency,
                                                        userDefaultCurrency?.currencyAbrv
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="coin_info">
                                                    {/* <Image src={coin} width={20} height={20} alt="BTC" /> */}
                                                    {renderAmountWithCurrency(
                                                        commissionData?.withdraw,
                                                        userDefaultCurrency?.currencyAbrv
                                                    )}
                                                </span>
                                            </td>
                                            <td>
                                                <p className="coin_info balance_available">
                                                    {/* <Image src={coin} width={20} height={20} alt="BTC" /> */}
                                                    {renderAmountWithCurrency(
                                                        commissionData?.available,
                                                        userDefaultCurrency?.currencyAbrv
                                                    )}
                                                </p>
                                            </td>
                                            <td>
                                                <Button
                                                    size="sm"
                                                    variant="transparent"
                                                    type="button"
                                                    onClick={handleWithdraw}>
                                                    <i className="far fa-dollar-sign"></i>
                                                    {languageData?.affiliate_page?.withdraw_button?.value}
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                        <span
                            className="load-more"
                            style={{
                                display: withdrawLoading ? "inline-block" : "none",
                            }}>
                            <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                        </span>
                        {withdrawErrorMessage && (
                            <p
                                className="error-msg"
                                style={{
                                    display: withdrawErrorMessage ? "block" : "none",
                                }}>
                                {withdrawErrorMessage}
                            </p>
                        )}
                    </>
                )}
            </AccountAffiliate>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Commissions",
            description: "Commissions",
        },
    };
}

export default Commissions;
