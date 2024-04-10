/* react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import slugify from "slugify";
import Head from "next/head";
import sha1 from "sha1";
import Image from "next/image";
import axios from "axios";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { BalanceState } from "@/context/BalanceProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import { Col, Container, Row } from "react-bootstrap";
import FrontLayout from "@/components/frontend/FrontLayout";

const Store = (props) => {
    const { points, loading } = BalanceState();
    const { languageData } = LanguageState();
    const [products, setProducts] = useState([]);
    const router = useRouter();
    const [filterBy, setFilterBy] = useState("all");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [totalRows, setTotalRows] = useState(0);
    const [pagination, setPagination] = useState([]);
    const [showLast, setShowLast] = useState(true);
    const [lastPage, setLastPage] = useState();
    const [loadingState, setLoadingState] = useState(true);

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.store_page) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData?.store_page[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        }
    }, []);

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

    const handlePageChange = async (event, currPage) => {
        setPage(currPage);
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
        setLoadingState(true);
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/get-reward-list/1681276584012?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&filterType=${filterBy}&page=${page}&limit=6`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setProducts(response.data?.data);
                    setTotalRows(response.data?.data?.totalCount);
                    const pageCount = Math.ceil(response.data?.data?.totalCount / limit);
                    setPaginate(pageCount, page);
                }
            })
            .catch((error) => {
                // setErrorMessage(error?.message);
            })
            .finally(() => {
                console.log("success");
                setLoadingState(false);
            });
    }, [filterBy, page]);

    const storeMenuData = [
        {
            key: "all",
            title: "all",
            total: "allCount",
        },
        {
            key: "available",
            title: "available",
            total: "availableCount",
        },
        {
            key: "not_available",
            title: "not available",
            total: "notAvailableCount",
        },
        {
            key: "without_category",
            title: "without category",
            total: "withoutCategoryCount",
        },
        {
            key: "bonus",
            title: "bonus",
            total: "bonusCount",
        },
        {
            key: "Gifts",
            title: "gifts",
            total: "giftsCount",
        },
    ];

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="store_sec">
                                <div className="account_page_box">
                                    <div className="account_box_tabbing">
                                        <div className="store_pts">
                                            <h5>
                                                {languageData?.store_page?.available?.value || "Available"}
                                                {loading ? (
                                                    <span
                                                        className="load-more"
                                                        style={{
                                                            display: loadingState ? "inline-block" : "none",
                                                            color: "#ffffff",
                                                        }}>
                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                    </span>
                                                ) : (
                                                    <span>{`${points === undefined ? 0.0 : points
                                                        } PTS`}</span>
                                                )}
                                            </h5>
                                        </div>
                                        <ul>
                                            {storeMenuData?.map((data, index) => {
                                                const { key, title, total } = data;
                                                return (
                                                    <li key={index}>
                                                        <button
                                                            type="button"
                                                            className={
                                                                key === filterBy ? "active_account_tab" : ""
                                                            }
                                                            onClick={() => {
                                                                setFilterBy(key);
                                                            }}>
                                                            <span>{getKey(key, title) || title}</span>
                                                            <span className="text-right">
                                                                {products[total] || 0}
                                                            </span>
                                                        </button>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>

                                    <div
                                        className={`account_box_content ${loadingState ||
                                            (!loadingState && !products?.rewardsList?.length > 0)
                                            ? "d-flex"
                                            : ""
                                            }`}>
                                        {loadingState ? (
                                            <h4
                                                className="store_tab_loader"
                                                dangerouslySetInnerHTML={{
                                                    __html: HrefLocalReplace(
                                                        languageData?.approved_request_page
                                                            ?.my_account_table_loader?.value
                                                    ),
                                                }}></h4>
                                        ) : (
                                            <div className="store_box_wp">
                                                {products?.rewardsList?.map((product, index) => {
                                                    return (
                                                        <Link
                                                            href={`/store/${slugify(product?.name, {
                                                                lower: true,
                                                            })}?id=${product?.id}`}
                                                            key={product?.id}
                                                            className="store_box">
                                                            <div className="store_box_img">
                                                                <Image
                                                                    loading="lazy"
                                                                    src={product?.image}
                                                                    width={253}
                                                                    height={253}
                                                                    alt="Bonus"
                                                                />
                                                            </div>
                                                            <div className="store_box_content">
                                                                <h5>{product?.amount} PTS</h5>
                                                                <p>
                                                                    {points === undefined
                                                                        ? "Insufficient Points"
                                                                        : product?.amount >= points
                                                                            ? "Insufficient Points"
                                                                            : languageData?.store_page
                                                                                ?.store_box_button?.value ||
                                                                            "Claim Now"}
                                                                </p>
                                                                <h6>{product?.name}</h6>
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {!loadingState &&
                                            (products?.rewardsList?.length > 0 ? (
                                                <ul className="table-paging">
                                                    {!pagination.includes(1) && (
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={(event) =>
                                                                    handlePageChange(event, 1)
                                                                }>
                                                                <i className="far fa-angle-double-left"></i>
                                                            </button>
                                                        </li>
                                                    )}
                                                    {totalRows > limit &&
                                                        pagination?.map((item, index) => (
                                                            <li key={index}>
                                                                <button
                                                                    type="button"
                                                                    className={
                                                                        page === item ? "is-active" : ""
                                                                    }
                                                                    onClick={(event) =>
                                                                        handlePageChange(event, item)
                                                                    }>
                                                                    {item}
                                                                </button>
                                                            </li>
                                                        ))}
                                                    {showLast && (
                                                        <li>
                                                            <button
                                                                type="button"
                                                                onClick={(event) =>
                                                                    handlePageChange(event, lastPage)
                                                                }>
                                                                <i className="far fa-angle-double-right"></i>
                                                            </button>
                                                        </li>
                                                    )}
                                                </ul>
                                            ) : (
                                                <h4 className="store_tab_loader">
                                                    {
                                                        languageData?.store_page?.no_rewards_found_message
                                                            ?.value
                                                    }
                                                </h4>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Store",
            description: "Store",
        },
    };
}

export default Store;
