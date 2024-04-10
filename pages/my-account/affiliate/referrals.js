import AccountAffiliate from "@/components/frontend/account/AccountAffiliate";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import searchIcon from "@/frontend/images/search.svg";
import Dropdown from "@/components/frontend/UI/Dropdown";
import Loader from "@/components/admin/UI/Loader";
import Button from "@/components/frontend/UI/Button";
import coin from "@/frontend/images/coin/btc.svg";
import sha1 from "sha1";
import axios from "axios";
import { useRouter } from "next/router";
import ListReferrals from "@/components/frontend/affiliate/ListReferrals";
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

const Referrals = (props) => {
    const { languageData } = LanguageState();
    const router = useRouter();
    const limit = 7;
    const defaultDropdown = { campaign: false, sort: false };
    const selectedCampaignOption = [
        { option: languageData?.affiliate_page?.sort_by_all?.value, value: "all" },
    ];
    const [dropdown, setDropdown] = useState(defaultDropdown);
    const [dropdownValue, setDropdownValue] = useState({
        campaign: selectedCampaignOption[0]?.option,
        sortBy: languageData?.affiliate_page?.sort_by_all?.value,
    });
    const [loading, setLoading] = useState(false);
    const [referrals, setReferrals] = useState([]);
    const [pagination, setPagination] = useState([]);
    const [showLast, setShowLast] = useState(true);
    const [lastPage, setLastPage] = useState();
    const [page, setPage] = useState(1);
    const [totalRows, setTotalRows] = useState();
    const [campaignInput, setCampaignSearch] = useState("");

    const sortOptions = [
        { option: languageData?.affiliate_page?.sort_by_all?.value, value: "all" },
        { option: languageData?.affiliate_page?.sort_by_campaign?.value, value: "campaign" },
    ];

    useEffect(() => {
        if (typeof localStorage === "undefined" && !JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        }
    }, []);

    const getData = () => {
        setLoading(true);
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/report?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&limit=${limit}&page=${page}&sortby=${dropdownValue?.sortBy?.toLowerCase()}&search=${campaignInput}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setReferrals(response.data?.data?.list);
                    const pageCount = Math.ceil(response.data?.data?.totalCount / limit);
                    setTotalRows(response.data?.data?.totalCount);
                    setPaginate(pageCount, page);
                } else {
                    setReferrals([]);
                }
            })
            .catch((error) => {
                setReferrals([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    /**
     * Get data on page change
     */
    useEffect(() => {
        getData();
    }, [page]);

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

    const handleDropdownShow = (status, identify) => {
        setDropdown({ ...defaultDropdown, [identify]: status });
    };

    const handleDropdownValue = (option, identify) => {
        console.log(dropdownValue);
        setDropdownValue({ ...dropdownValue, [identify]: option });
    };

    /**
     * Filter submit handler
     */
    const submitHandler = (event) => {
        event.preventDefault();
        if (page === 1) getData();
        setPage(1);
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AccountAffiliate>
                <div className="affiliate_referrals_sec">
                    <form onSubmit={submitHandler}>
                        <div className="affiliate_referrals_filter">
                            {/* <div className="form_input_wp">
                            <label htmlFor="campaign_name">Campaign Name</label>
                            <Dropdown show={dropdown.campaign} setShow={(status) => handleDropdownShow(status, 'campaign')} data={campaignOptions} overlay radio={true} selected={dropdownValue?.campaign} radioName="campaign_name" handleDropdownChange={option => handleDropdownValue(option, 'campaign')} />
                        </div> */}
                            <div className="form_input_wp">
                                <label htmlFor="campaign_name">
                                    {languageData?.affiliate_page?.sort_by_label?.value}
                                </label>
                                <Dropdown
                                    show={dropdown.sort}
                                    setShow={(status) => handleDropdownShow(status, "sort")}
                                    data={sortOptions}
                                    selected={dropdownValue?.sortBy}
                                    overlay
                                    radio={true}
                                    radioName="campaign_name"
                                    handleDropdownChange={(option) => handleDropdownValue(option, "sortBy")}
                                />
                            </div>
                            <div className="search_form">
                                <div className="search_form_input_wp">
                                    <div className="search_form_input">
                                        <input
                                            type="text"
                                            name="search"
                                            className="form_input"
                                            placeholder={
                                                languageData?.affiliate_page?.search_campaign_placeholder
                                                    ?.value
                                            }
                                            autoComplete="off"
                                            onChange={(e) => setCampaignSearch(e.target.value)}
                                        />
                                        <button type="button" className="search_btn">
                                            <Image src={searchIcon} alt="Search" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="affiliate_referrals_btn">
                                <Button type="submit" size="sm">
                                    {languageData?.affiliate_page?.search_button?.value}
                                </Button>
                            </div>
                        </div>
                    </form>

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
                    ) : referrals.length === 0 ? (
                        <div className="table_data_notfound">
                            <h4 className="error-msg">Record Not Found</h4>
                        </div>
                    ) : (
                        <div className="table_pagination">
                            <div className="table-responsive affiliate_referrals_table">
                                <table className="custom_table" cellSpacing="0" cellPadding="0">
                                    <thead>
                                        <tr>
                                            <th style={{ minWidth: "9.7193rem" }}>
                                                {languageData?.affiliate_page?.table_cell_campaigns?.value}
                                            </th>
                                            <th>
                                                {languageData?.affiliate_page?.table_cell_withdrawn?.value}
                                            </th>
                                            <th>
                                                {languageData?.affiliate_page?.table_cell_available?.value}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {referrals?.map((referral) => {
                                            return <ListReferrals referral={referral} key={referral?.id} />;
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            <ul className="table-paging">
                                {!pagination.includes(1) && (
                                    <li>
                                        <button type="button" onClick={() => handlePageChange(1)}>
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
                                                onClick={() => handlePageChange(item)}>
                                                {item}
                                            </button>
                                        </li>
                                    ))}
                                {showLast && (
                                    <li>
                                        <button type="button" onClick={() => handlePageChange(lastPage)}>
                                            <i className="far fa-angle-double-right"></i>
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </AccountAffiliate>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Referrals",
            description: "Referrals",
        },
    };
}

export default Referrals;
