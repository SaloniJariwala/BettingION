/* react-hooks/exhaustive-deps */
import AccountSideBar from "@/components/frontend/account/AccountSideBar";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DateRangePicker from "react-bootstrap-daterangepicker";
import sha1 from "sha1";
import PriceDownIcon from "@/frontend/images/tr-down.svg";
import PriceUpIcon from "@/frontend/images/tr-up.svg";
import PriceZeroIcon from "@/frontend/images/tr-zero.svg";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { LanguageState } from "@/context/FrontLanguageProvider";

const Wallet = () => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [errorMessage, setErrorMessage] = useState(false);
    const [transactionData, setTransactionData] = useState([]);
    const [value, setValue] = useState("YYYY-MM-DD");
    const [pagination, setPagination] = useState([]);
    const [showLast, setShowLast] = useState(true);
    const [lastPage, setLastPage] = useState();
    const { languageData } = LanguageState();

    const getDate = (date) => {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        const str = date?.split("T");
        const newDate = new Date(str[0]);
        const time = str[1];
        return `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()} ${
            time.split("+")[0]
        }`;
    };

    /**
     * To create array with starting and ending index
     */
    const range = (start, end) => {
        let pages = [];

        if (end === undefined) return pages;

        for (let nums = start; nums <= end; nums++) {
            pages.push(nums);
        }

        return pages;
    };

    /**
     * Set pagination
     */
    const setPaginate = (pageCount, currPage) => {
        setLastPage(pageCount);
        const startingIndex = 1;
        const mostIndex = 5;
        let paginate;
        if (pageCount <= mostIndex) {
            paginate = range(startingIndex, pageCount);
            setShowLast(false);
        } else {
            if (currPage <= 3) {
                paginate = range(startingIndex, mostIndex);
                setShowLast(true);
            } else if (range(pageCount - 2, pageCount).includes(currPage)) {
                paginate = range(pageCount - 4, pageCount);
                setShowLast(false);
            } else {
                paginate = range(currPage - 2, currPage + 2);
                setShowLast(true);
            }
        }
        setPagination(paginate);
    };

    useEffect(() => {
        range(1, 10);
    }, []);

    const getData = (startDate, endDate, page, limit) => {
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=player&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&start=${startDate}&end=${endDate}&limit=${limit}&page=${page}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setTransactionData(response.data?.response[0]?.transactions);
                    setTotalRows(response.data?.response[0]?.totalTxns);
                    const pageCount = Math.ceil(response.data?.response[0]?.totalTxns / limit);
                    setPaginate(pageCount, page);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {});
    };

    useEffect(() => {
        const date = new Date();
        const newStartDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDate = `${newStartDate.getFullYear()}-${(newStartDate.getMonth() + 1)
            .toString()
            .padStart(2, 0)}-${newStartDate.getDate().toString().padStart(2, 0)}`;
        setStartDate(startDate);
        const newEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const endDate = `${newEndDate.getFullYear()}-${(newEndDate.getMonth() + 1)
            .toString()
            .padStart(2, 0)}-${newEndDate.getDate().toString().padStart(2, 0)}`;
        setEndDate(endDate);
        setValue(`${startDate.replaceAll("-", "/")}-${endDate.replaceAll("-", "/")}`);
        getData(startDate, endDate, 1, 10);
    }, []);

    const handleEvent = (event, picker) => {
        setValue("YYYY-MM-DD");
    };

    const handleCallback = (start, end, label) => {
        setValue("YYYY-MM-DD");
    };

    const handleApply = (event, picker) => {
        const newStartDate = new Date(picker.startDate);
        const startDate = `${newStartDate.getFullYear()}-${(newStartDate.getMonth() + 1)
            .toString()
            .padStart(2, 0)}-${newStartDate.getDate().toString().padStart(2, 0)}`;
        setStartDate(startDate);
        const newEndDate = new Date(picker.endDate);
        const endDate = `${newEndDate.getFullYear()}-${(newEndDate.getMonth() + 1)
            .toString()
            .padStart(2, 0)}-${newEndDate.getDate().toString().padStart(2, 0)}`;
        setEndDate(endDate);
        setValue(`${startDate.replaceAll("-", "/")}-${endDate.replaceAll("-", "/")}`);
        setLimit(limit);
        setPage(1);
        getData(startDate, endDate, 1, limit);
    };

    const handlePageChange = async (event, currPage) => {
        setPage(currPage);

        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=player&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&start=${startDate}&end=${endDate}&limit=${limit}&page=${currPage}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setTransactionData(response.data?.response[0]?.transactions);
                    setTotalRows(response.data?.response[0]?.totalTxns);
                    const pageCount = Math.ceil(response.data?.response[0]?.totalTxns / limit);
                    setPaginate(pageCount, currPage);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const handlePerRowChange = (event, row, currPage) => {
        setLimit(row);
        setPage(1);
        currPage = 1;
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos/report?report=player&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&start=${startDate}&end=${endDate}&limit=${row}&page=${currPage}&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setTransactionData(response.data?.response[0]?.transactions);
                    setTotalRows(response.data?.response[0]?.totalTxns);
                    const pageCount = Math.ceil(response.data?.response[0]?.totalTxns / row);
                    setPaginate(pageCount, currPage);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    };

    const getSvgLink = (item) => {
        if (item.amount === 0) {
            return PriceZeroIcon;
        } else {
            if (item.action === "credit") {
                return PriceUpIcon;
            } else {
                return PriceDownIcon;
            }
        }
    };

    const renderStatus = (actionType, status, receiverId, senderId) => {
        if (status) {
            if (status === "transfer-funds-between-accounts") {
                if (receiverId.split(" ")[0] === JSON.parse(localStorage.getItem("User"))?.username) {
                    return senderId;
                } else {
                    return receiverId;
                }
            } else if (actionType === "transfer") {
                if (status === "approved") {
                    return receiverId;
                }
                return `Transfer ${status}: ${receiverId}`;
            } else if ("deposit" === actionType) {
                return (
                    <NextTooltip title="Deposit">
                        <span>
                            <i className="fad fa-plus-circle"></i>
                            &nbsp; {status[0]?.toString()?.toUpperCase() + status?.toString()?.substring(1)}
                        </span>
                    </NextTooltip>
                );
            } else if ("withdraw" === actionType) {
                return (
                    <NextTooltip title="Withdrawal">
                        <span>
                            <i className="fad fa-wallet"></i>
                            &nbsp; {status[0]?.toString()?.toUpperCase() + status?.toString()?.substring(1)}
                        </span>
                    </NextTooltip>
                );
            } else {
                return status.toString();
            }
        } else {
            return `-`;
        }
    };

    return (
        <>
            <AccountSideBar>
                <div className="wallet_content_heading">
                    <h3
                        className="account_box_content_h3"
                        dangerouslySetInnerHTML={{
                            __html: languageData?.transaction_page?.transaction_page_balance_title?.value,
                        }}></h3>
                </div>

                <form className="data-sort-option mb_20">
                    <Row>
                        <Col lg={8}>
                            <DateRangePicker
                                onEvent={handleEvent}
                                onCallback={handleCallback}
                                onApply={handleApply}
                                value={value}>
                                <input type="text" className="form_input" />
                            </DateRangePicker>
                        </Col>
                        <Col lg={4}>
                            <select
                                name="limit"
                                id=""
                                className="form_input"
                                value={limit}
                                onChange={(event) => handlePerRowChange(event, event.target.value, 1)}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </Col>
                    </Row>
                </form>

                <div className="wallet-transactions">
                    <h5
                        className="wallet-transactions-title"
                        dangerouslySetInnerHTML={{
                            __html: languageData?.transaction_page?.transaction_list_title?.value,
                        }}></h5>
                    {errorMessage ? (
                        <></>
                    ) : (
                        <>
                            <ul className="wallet-transactions-items">
                                {transactionData?.map(
                                    (item, index) =>
                                        item.amount !== 0 && (
                                            <li key={index}>
                                                <div className="wallet-transactions-info">
                                                    <Image
                                                        width="32"
                                                        height="32"
                                                        src={getSvgLink(item)}
                                                        alt="Equal Balance"
                                                    />
                                                    <div className="wallet-transactions-detail">
                                                        <small>{getDate(item.createdAt)}</small>
                                                        <p>
                                                            {renderStatus(
                                                                item.actionType,
                                                                item.status,
                                                                item.receiverInfo,
                                                                item.senderInfo
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div
                                                    className="wallet-transaction-type-credit"
                                                    style={{
                                                        color:
                                                            item.action !== "credit" && item.amount !== 0
                                                                ? "#F1696A"
                                                                : "",
                                                    }}>
                                                    {renderAmountWithCurrency(
                                                        item.action === "debit"
                                                            ? item.amount * -1
                                                            : item.amount,
                                                        item?.currency //"USD"
                                                    )}
                                                </div>
                                            </li>
                                        )
                                )}
                            </ul>
                        </>
                    )}
                    {transactionData?.length > 0 && (
                        <ul className="table-paging">
                            {!pagination.includes(1) && (
                                <li>
                                    <button type="button" onClick={(event) => handlePageChange(event, 1)}>
                                        <i className="far fa-angle-double-left"></i>
                                    </button>
                                </li>
                            )}
                            {totalRows > limit &&
                                pagination?.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            className={page === item ? "is-active" : ""}
                                            onClick={(event) => handlePageChange(event, item)}>
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            {showLast && (
                                <li>
                                    <button
                                        type="button"
                                        onClick={(event) => handlePageChange(event, lastPage)}>
                                        <i className="far fa-angle-double-right"></i>
                                    </button>
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </AccountSideBar>
        </>
    );
};

export default Wallet;
