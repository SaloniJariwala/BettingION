import AccountWalletSideBar from "@/components/frontend/account/AccountWalletSideBar";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import Head from "next/head";

const CancelledRequests = (props) => {
    const [cancelledRequestData, setCancelledRequestData] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { languageData } = LanguageState();

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
                }&status=cancelled&authKey=${authkey}&txnType=withdraw`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setCancelledRequestData(response.data?.data);
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
                            languageData?.cancelled_request_page?.cancelled_request_page_title?.value
                        ),
                    }}></h2>

                <hr />

                {loading ? (
                    <h4
                        dangerouslySetInnerHTML={{
                            __html: HrefLocalReplace(
                                languageData?.cancelled_request_page?.my_account_table_loader?.value
                            ),
                        }}></h4>
                ) : errorMessage ? (
                    <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                        {errorMessage}
                    </p>
                ) : cancelledRequestData?.length > 0 ? (
                    <div className="casino-table-wp">
                        <table className="custom_table">
                            <thead>
                                <tr>
                                    <th>
                                        {
                                            languageData?.cancelled_request_page?.my_account_table_amount_cell
                                                ?.value
                                        }
                                    </th>
                                    <th>
                                        {
                                            languageData?.cancelled_request_page?.my_account_table_status_cell
                                                ?.value
                                        }
                                    </th>
                                    <th>
                                        {
                                            languageData?.cancelled_request_page?.my_account_table_method_cell
                                                ?.value
                                        }
                                    </th>
                                    <th>
                                        {
                                            languageData?.cancelled_request_page?.my_account_table_date_cell
                                                ?.value
                                        }
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {cancelledRequestData?.map((item, index) => (
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
                    <p>Sorry, no transactions were found!</p>
                )}
            </AccountWalletSideBar>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Cancelled withdraw request",
            description: "Cancelled withdraw request",
        },
    };
}

export default CancelledRequests;
