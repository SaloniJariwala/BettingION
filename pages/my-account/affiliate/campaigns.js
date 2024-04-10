import Button from "@/components/frontend/UI/Button";
import AccountAffiliate from "@/components/frontend/account/AccountAffiliate";
import Head from "next/head";
import Image from "next/image";
import downIcon from "@/frontend/images/down_icon.svg";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { useEffect, useState } from "react";
import CreateCampaigns from "@/components/frontend/Modal/CreateCampaigns";
import sha1 from "sha1";
import axios from "axios";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import ListCampaigns from "@/components/frontend/affiliate/ListCampaigns";
import { LanguageState } from "@/context/FrontLanguageProvider";

/**
 * To create array with starting and ending index
 *
 * @param {*} start
 * @param {*} end
 * @returns Array
 */
const range = (start, end) => {
    let pages = [];

    if (end === undefined) return pages;

    for (let nums = start; nums <= end; nums++) {
        pages.push(nums);
    }

    return pages;
};

const limit = 6;
const Campaigns = (props) => {
    const { languageData } = LanguageState();
    const [accordion, setAccordion] = useState(false);
    const [modal, setModal] = useState(false);
    const [campaigns, setCampaigns] = useState([]);
    const [copyStatus, setCopyStatus] = useState({ status: false, id: 0 });
    const [loading, setLoading] = useState(false);
    const [refreshCampaigns, setRefreshCampaigns] = useState(false);
    const [pagination, setPagination] = useState([]);
    const [showLast, setShowLast] = useState(true);
    const [lastPage, setLastPage] = useState();
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();

    useEffect(() => {
        if (typeof localStorage === "undefined" && !JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        }
    }, []);

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
        range(1, limit);
    }, []);

    const handlePageChange = (currPage) => setPage(currPage);

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/list?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&limit=${limit}&page=${page}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setCampaigns(response.data?.data?.list);
                    const pageCount = Math.ceil(response.data?.data?.totalCount / limit);
                    setTotalRows(response.data?.data?.totalCount);
                    setPaginate(pageCount, page);
                } else {
                    setCampaigns([]);
                    // setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setCampaigns([]);
                // setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [refreshCampaigns, page]);

    const refreshData = () => {
        setRefreshCampaigns((prev) => !prev);
    };

    const refreshCopyStatus = (id) => {
        setCopyStatus({ ...copyStatus, id: id });
    };

    const accordionToggle = () => {
        setAccordion(!accordion);
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountAffiliate>
                <div className="affiliate_campaigns_sec">
                    <div className="affiliate_campaigns_top_bar">
                        <Button size="sm" type="button" onClick={setModal}>
                            <i className="far fa-plus"></i>{" "}
                            {languageData?.affiliate_page?.create_campaign_button?.value}
                        </Button>
                    </div>

                    <div className="affiliate_campaigns_list table_pagination">
                        {loading ? (
                            <>
                                <span
                                    className="load-more"
                                    style={{
                                        display: loading ? "block" : "none",
                                        textAlign: "center",
                                        margin: 0,
                                        fontSize: "25px",
                                    }}>
                                    <i className="fad fa-spinner-third fa-spin"></i>
                                </span>
                            </>
                        ) : (
                            <>
                                {campaigns?.length > 0 &&
                                    campaigns?.map((campaign) => {
                                        return (
                                            <ListCampaigns
                                                campaign={campaign}
                                                key={campaign?.id}
                                                copyStatus={refreshCopyStatus}
                                            />
                                        );
                                    })}
                                {campaigns?.length > 0 && (
                                    <div className="table_pagination">
                                        <ul className="table-paging">
                                            {!pagination.includes(1) && (
                                                <li>
                                                    <button type="button" onClick={() => handlePageChange(1)}>
                                                        <i className="far fa-angle-double-left"></i>
                                                    </button>
                                                </li>
                                            )}
                                            {console.log(totalRows)}
                                            {totalRows > limit &&
                                                pagination?.map((item, index) => (
                                                    <li key={index}>
                                                        <button
                                                            type="button"
                                                            className={page === item ? "is-active" : ""}
                                                            onClick={() => handlePageChange(item)}>
                                                            {item}
                                                        </button>
                                                    </li>
                                                ))}
                                            {showLast && (
                                                <li>
                                                    <button
                                                        type="button"
                                                        onClick={() => handlePageChange(lastPage)}>
                                                        <i className="far fa-angle-double-right"></i>
                                                    </button>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </AccountAffiliate>

            <CreateCampaigns show={modal} setShow={setModal} refreshData={refreshData} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Campaigns",
            description: "Campaigns",
        },
    };
}

export default Campaigns;
