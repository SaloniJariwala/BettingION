import AdminLayout from "@/components/admin/AdminLayout";
import PostDeleteModal from "@/components/admin/Modals/BlogPostsModal/PostDeleteModal";
import EditPost from "@/components/admin/Posts/Posts/EditPost";
import Loader from "@/components/admin/UI/Loader";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import Title from "@/components/admin/UI/Title";
import { getDateAndTime } from "@/utils/getDateAndTime";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import sha1 from "sha1";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

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

const postStatus = (status) => {
    const color = status ? "won" : "loss";
    const title = status ? "Published" : "Draft";

    return <div className={`player-bet-${color}`}>{title}</div>;
};

const PostsList = (props) => {
    const [data, setData] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState();
    const [refresh, setRefresh] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deletePost, setDeletePost] = useState({ status: false, id: 0 });
    const [editStatus, setEditStatus] = useState(false);
    const [editId, setEditId] = useState();
    const { adminLanguageData } = AdminLanguageState();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    /**
     * Check user access permissions
     */
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["super-agent", "administrator"].includes(user?.accountType)
            ? setIsNotAccessible(true)
            : setIsNotAccessible(false);
    }, []);

    /**
     * Get category names using IDs
     */
    const getCategoryName = (categories) => {
        const postCategories = categories?.map(category => {
            return category?.name
        });

        return postCategories.join(', ');
    }

    /**
     * Get blog posts
     */
    useEffect(() => {
        setLoading(true);
        setErrorMessage("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/blog-post-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setData(response.data?.data);
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
    }, [refresh]);

    /**
     * Refresh posts
     */
    const refreshData = () => {
        setRefresh((prev) => !prev);
    };

    /**
     * Post actions
     * 
     * @param {*} post 
     * @returns JSX
     */
    const postActions = (post) => {
        return (
            <div className="table_btn_group form_right_group">
                <ul>
                    <li>
                        <NextTooltip title={adminLanguageData?.post_list_page?.edit_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn"
                                onClick={(event) => {
                                    setEditStatus(true);
                                    setEditId(post?.id);
                                }}>
                                <i className="fal fa-pencil"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title={adminLanguageData?.post_list_page?.delete_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn"
                                onClick={() => {
                                    setDeletePost({ status: true, id: post?.id });
                                }}>
                                <i className="fal fa-trash-alt"></i>
                            </button>
                        </NextTooltip>
                    </li>
                </ul>
            </div>
        );
    };

    /**
     * Datatable columns & data
     */
    const columns = [
        {
            name: "#",
            grow: 1,
            selector: (row) => row?.id
        },
        {
            name: adminLanguageData?.post_list_page?.title?.value,
            grow: 1,
            selector: (row) => row?.title
        },
        {
            name: adminLanguageData?.post_list_page?.Categories?.value,
            grow: 1,
            selector: (row) => getCategoryName(row?.categories)
        },
        {
            name: adminLanguageData?.post_list_page?.published_date?.value,
            grow: 1,
            selector: (row) => getDateAndTime(row?.publishDate)
        },
        {
            name: adminLanguageData?.post_list_page?.status?.value,
            grow: 1,
            selector: (row) => postStatus(row?.status)
        },
        {
            name: adminLanguageData?.post_list_page?.page_title?.value,
            grow: 1,
            selector: (row) => postActions(row)
        },
    ];

    /**
     * Edit post process
     * 
     * @param {*} updateStatus
     */
    const handleUpdatePost = (updateStatus = false) => {
        setEditStatus(!editStatus);
        setEditId();

        if (updateStatus) getData(page);
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
                {!isNotAccessible ? (
                    <Col lg={12}>
                        <div className="use_main_form">
                            <p className="error-msg" style={{ display: "block" }}>
                                {
                                    adminLanguageData?.common_restriction_message?.page_not_accessible_message
                                        ?.value
                                }
                            </p>
                        </div>
                    </Col>
                ) : (
                    <>
                        {editStatus ? (
                            <EditPost updateStatus={handleUpdatePost} editId={editId} />
                        ) : (
                            <>
                                <div className="user_main_sec">
                                    <div className="title_bar">
                                        <Row className="align-items-center">
                                            <Col lg={6}>
                                                <div className="title">
                                                    <Title>
                                                        {adminLanguageData?.post_list_page?.page_title?.value}
                                                    </Title>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                                <div className="user_main_sec_content">
                                    <Row>
                                        <Col lg={12}>
                                            <div className="use_main_form">
                                                <div
                                                    className={
                                                        data?.length > 0
                                                            ? "dataTables_wrapper"
                                                            : "dataTables_wrapper noData"
                                                    }>
                                                    {!errorMessage ? (
                                                        <DataTable
                                                            columns={columns}
                                                            data={data}
                                                            theme="solarized"
                                                            pagination
                                                            paginationServer
                                                            paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                                            progressPending={loading}
                                                            // paginationTotalRows={totalRows}
                                                            // onChangeRowsPerPage={handlePerRowsChange}
                                                            // onChangePage={handlePageChange}
                                                            progressComponent={
                                                                <Loader style={{ minHeight: "62px" }} />
                                                            }
                                                            noDataComponent={
                                                                adminLanguageData?.no_records_found?.value
                                                            }
                                                            paginationComponentOptions={
                                                                paginationComponentOptions
                                                            }
                                                        />
                                                    ) : errorMessage === 500 ? (
                                                        <>{adminLanguageData?.no_data_found?.value}</>
                                                    ) : (
                                                        <p
                                                            className="error-msg"
                                                            style={{
                                                                display: errorMessage ? "block" : "none",
                                                            }}>
                                                            {errorMessage}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <PostDeleteModal
                                                show={deletePost}
                                                setShow={setDeletePost}
                                                refreshData={refreshData}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            </>
                        )}
                    </>
                )}
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Blog Posts",
            description: "Blog Posts",
        },
    };
}

export default PostsList;
