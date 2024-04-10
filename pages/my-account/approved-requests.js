/* react-hooks/exhaustive-deps */
import AccountWalletSideBar from "@/components/frontend/account/AccountWalletSideBar";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import Head from "next/head";

const ApprovedRequests = (props) => {
    const router = useRouter();
    const [approvedRequestData, setApprovedRequestData] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/transactions?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&status=approved&authKey=${authkey}&txnType=withdraw`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setApprovedRequestData(response.data?.data);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountWalletSideBar>
                <h2
                    dangerouslySetInnerHTML={{
                        __html: HrefLocalReplace(
                            languageData?.approved_request_page?.approved_request_page_title?.value
                        ),
                    }}></h2>

                <hr />

                {loading ? (
                    <h4
                        dangerouslySetInnerHTML={{
                            __html: HrefLocalReplace(
                                languageData?.approved_request_page?.my_account_table_loader?.value
                            ),
                        }}></h4>
                ) : errorMessage ? (
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                ) : approvedRequestData?.length > 0 ? (
                    <div className="casino-table-wp">
                        <table className="custom_table">
                            <thead>
                                <tr>
                                    <th>
                                        {
                                            languageData?.approved_request_page?.my_account_table_amount_cell
                                                ?.value
                                        }
                                    </th>

                                    <th>
                                        {
                                            languageData?.approved_request_page?.my_account_table_status_cell
                                                ?.value
                                        }
                                    </th>
                                    <th>
                                        {
                                            languageData?.approved_request_page?.my_account_table_method_cell
                                                ?.value
                                        }
                                    </th>
                                    <th>
                                        {
                                            languageData?.approved_request_page?.my_account_table_date_cell
                                                ?.value
                                        }
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvedRequestData?.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <p className="wallet_price">
                                                <bdi>
                                                    {renderAmountWithCurrency(item.amount, item.currency)}
                                                </bdi>
                                            </p>
                                        </td>
                                        <td style={{ textTransform: "capitalize" }}>{item.status}</td>
                                        <td>
                                            {item.withdrawMethod} - {item.withdrawCoin}
                                        </td>
                                        <td>{getDescriptiveDate(item.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>{languageData?.approved_request_page?.transactions_not_found?.value}</p>
                )}
            </AccountWalletSideBar>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Approved withdraw request",
            description: "Approved withdraw request",
        },
    };
}

export default ApprovedRequests;
