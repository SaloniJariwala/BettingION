/* react-hooks/exhaustive-deps */
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Image from "next/image";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import DataTable, { createTheme } from "react-data-table-component";
import Loader from "@/components/admin/UI/Loader";
import axios from "axios";
import sha1 from "sha1";
import Button from "@/components/frontend/UI/Button";
import RewardDeleteModal from "@/components/admin/Modals/RewardsDeleteModal";
import EditReward from "./edit";
import Head from "next/head";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Rewards = (props) => {
    const { adminLanguageData } = AdminLanguageState();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [totalRows, setTotalRows] = useState(0);
    const [rewards, setRewards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState();
    const [retrieveData, setRetrieveData] = useState(false);
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [editStatus, setEditStatus] = useState(false);
    const [editData, setEditData] = useState();
    const [editId, setEditId] = useState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const router = useRouter();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    const renderUserActions = (rewardId, reward) => {
        return (
            <div className="table_btn_group form_right_group">
                <ul>
                    <li>
                        <NextTooltip title={adminLanguageData?.store_rewards_list_page?.store_rewards_list_edit_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn"
                                onClick={(event) => {
                                    setEditStatus(true);
                                    setEditId(rewardId);
                                    setEditData(reward);
                                }}
                            >
                                <i className="fal fa-pencil"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title={adminLanguageData?.store_rewards_list_page?.store_rewards_list_delete_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn"
                                onClick={(event) => {
                                    setDeleteId(rewardId);
                                    setDeleteModal(true);
                                }}
                            >
                                <i className="fal fa-trash-alt"></i>
                            </button>
                        </NextTooltip>
                    </li>
                </ul>
            </div>
        );
    };

    const paginationReset = () => {
        setResetPaginationToggle(!resetPaginationToggle);
    };

    const handleRetreiveData = () => {
        setRetrieveData(!retrieveData);
    };

    const handleUpdateReward = (updateStatus = false) => {
        setEditStatus(!editStatus);
        setEditId();
        setEditData();

        if (updateStatus) getData(page);
    };

    const getData = async (currentPage = page, rowsLimit = limit) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        let emptyReward = [];

        setLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/get-reward-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&page=${currentPage}&limit=${rowsLimit}&remoteId=${JSON.parse(localStorage.getItem("User"))?.userId}&searchName=${search}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    response.data?.data?.rewardsList?.map((reward) => {
                        const startDate = reward?.startDate.substring(0, reward?.startDate?.indexOf("T"));
                        const endDate = reward?.endDate.substring(0, reward?.endDate?.indexOf("T"));

                        emptyReward = [
                            ...emptyReward,
                            {
                                image: <Image src={reward.image} alt={reward.name} width={280} height={280} />,
                                name: reward.name,
                                start_end_data: (
                                    <p>
                                        {startDate}
                                        <br />
                                        {endDate}
                                    </p>
                                ),
                                language: reward.language,
                                currency: reward.currency,
                                category: reward.category?.name,
                                status: <div className={`player-bet-${!reward.status ? "loss" : "won"}`}>{!reward.status ? "Not Active" : "Active"}</div>,
                                action: renderUserActions(reward?.id, reward),
                            },
                        ];
                    });
                    setRewards(emptyReward);
                    setTotalRows(response.data?.data?.count);
                } else {
                    setRewards(emptyReward);
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setRewards(emptyReward);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setPage(1);
        getData(1);
        paginationReset();
    }, [retrieveData, search]);

    const handlePageChange = async (page) => {
        setPage(page);
        getData(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        setLimit(newPerPage);
        setPage(page);
        getData(page, newPerPage);
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

    const columns = [
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_image?.value,
            maxWidth: "140px",
            grow: 1,
            selector: (row) => row.image,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_name?.value,
            grow: 2,
            maxWidth: "300px",
            minWidth: "200px",
            selector: (row) => row.name,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_dates?.value,
            grow: 1.2,
            maxWidth: "200px",
            minWidth: "130px",
            selector: (row) => row.start_end_data,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_language?.value,
            grow: 1,
            minWidth: "120px",
            selector: (row) => row.language,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_currency?.value,
            grow: 1,
            selector: (row) => row.currency,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_category?.value,
            grow: 1,
            selector: (row) => row.category,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_status?.value,
            grow: 1,
            minWidth: "125px",
            selector: (row) => row.status,
        },
        {
            name: adminLanguageData?.store_rewards_list_page?.store_rewards_list_action?.value,
            grow: 1,
            minWidth: "110px",
            selector: (row) => row.action,
        },
    ];

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
                {editStatus ? (
                    <EditReward updateStatus={handleUpdateReward} editId={editId} editData={editData} />
                ) : (
                    <>
                        <div className="rewards_list_sec">
                            <div className="title_bar">
                                <Row className="align-items-center">
                                    <Col lg={6}>
                                        <div className="title">
                                            <Title>{adminLanguageData?.store_rewards_list_page?.store_rewards_list_page?.value}</Title>
                                        </div>
                                    </Col>
                                    <Col lg={6} className="text-lg-end">
                                        <Button href="./rewards/create" className="sec_btn sm_btn">
                                            {adminLanguageData?.store_rewards_list_page?.store_rewards_list_new_button?.value}
                                            <i className="far fa-plus-circle"></i>
                                        </Button>
                                    </Col>
                                </Row>
                            </div>

                            <Row className="align-items-center">
                                <Col sm={4}>
                                    <div className="form_input_wp">
                                        <i className="fal fa-search"></i>
                                        <input
                                            type="search"
                                            className="form_input"
                                            placeholder={adminLanguageData?.store_rewards_list_page?.store_rewards_list_search_placeholder?.value}
                                            aria-controls="user_data"
                                            onChange={(event) => setSearch(event.target.value)}
                                        />
                                    </div>
                                </Col>
                            </Row>

                            <DataTable
                                columns={columns}
                                data={rewards}
                                pagination
                                paginationServer
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                paginationResetDefaultPage={resetPaginationToggle}
                                progressPending={loading}
                                progressComponent={<Loader style={{ minHeight: "62px" }} />}
                                paginationTotalRows={totalRows}
                                onChangeRowsPerPage={handlePerRowsChange}
                                onChangePage={handlePageChange}
                                noDataComponent={adminLanguageData?.no_records_found?.value}
                                theme="solarized"
                                paginationComponentOptions={paginationComponentOptions}
                            />
                        </div>
                        <RewardDeleteModal show={deleteModal} setShow={setDeleteModal} rewardId={deleteId} renderData={handleRetreiveData} />
                    </>
                )}
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Rewards",
            description: "Rewards",
        },
    };
}

export default Rewards;
