import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import { Col, Row } from "react-bootstrap";
import DataTable, { createTheme } from "react-data-table-component";
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import Loader from "@/components/admin/UI/Loader";
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

const Campaigns = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const [data, setData] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchAgain, setFetchAgain] = useState(false);
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        setLoading(true);
        axios
            .get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/get-campaign?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&limit=100`)
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
    }, [fetchAgain]);

    const handleDelete = (id) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/delete-campaign?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&campaignId=${id}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setFetchAgain((prev) => !prev);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error?.message);
            })
            .finally(() => {});
    };

    const renderActions = (row) => {
        return (
            <div className="table_btn_group form_right_group">
                <ul>
                    <li>
                        <NextTooltip title={adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_edit_tooltip?.value}>
                            <button type="button" className="sec_btn icon_btn" onClick={() => router.push(`/admin/bonus-system/campaigns/edit?id=${row.id}`)}>
                                <i className="fal fa-pencil"></i>
                            </button>
                        </NextTooltip>
                    </li>
                    <li>
                        <NextTooltip title={adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_delete_tooltip?.value}>
                            <button
                                type="button"
                                className="sec_btn icon_btn"
                                onClick={() => {
                                    const ans = confirm("Are you sure you want to delete this campaign?");
                                    if (ans) {
                                        handleDelete(row.id);
                                    } else {
                                        return;
                                    }
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

    const columns = [
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_id?.value,
            maxWidth: "100px",
            selector: (row) => row.id,
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_internal_name?.value,
            maxWidth: "200px",
            selector: (row) => row.internalName,
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_name?.value,
            maxWidth: "200px",
            selector: (row) => {
                if (Array.isArray(row?.translation)) {
                    return (
                        <ul style={{ paddingLeft: "20px" }}>
                            {row?.translation?.map((item, index) => (
                                <li key={index} style={{ listStyle: "none" }}>
                                    {item?.title}
                                </li>
                            ))}
                        </ul>
                    );
                }
            },
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_allocation_criteria?.value,
            maxWidth: "200px",
            selector: (row) => row.allocationType,
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_bonus?.value,
            maxWidth: "200px",
            selector: (row) => (row.bonusDataType === "fixedBonus" ? `${row.bonusData?.bonusToBeAwarded}` : `${row.bonusData?.percentage} %`),
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_currency?.value,
            maxWidth: "150px",
            selector: (row) => row.currency,
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_date?.value,
            maxWidth: "400px",
            selector: (row) => {
                return (
                    <>
                        <span>{row?.startDate?.replace("T", " ")?.replace("Z", " ")?.split(".")[0]}</span>
                        <br />
                        <span>{row?.endDate?.replace("T", " ")?.replace("Z", " ")?.split(".")[0]}</span>
                    </>
                );
            },
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_status?.value,
            maxWidth: "100px",
            selector: (row) => (row.status ? "Active" : "Inactive"),
        },
        {
            name: adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_actions?.value,
            maxWidth: "200px",
            selector: (row) => renderActions(row),
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
                <section className="dashboard_main">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>{adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_page_title?.value}</Title>
                                </div>
                            </Col>
                            <Col lg={6} className="text-lg-end">
                                <button type="button" onClick={() => router.push("/admin/bonus-system/campaigns/create")} className="sec_btn">
                                    {adminLanguageData?.bonus_campaign_list_page?.bonus_campaign_list_create_button?.value} <i className="far fa-plus-circle"></i>
                                </button>
                            </Col>
                        </Row>
                    </div>
                    <div className="user_main_sec_content">
                        {!errorMessage && (
                            <DataTable
                                columns={columns}
                                data={data}
                                theme="solarized"
                                progressPending={loading}
                                progressComponent={<Loader style={{ minHeight: 50 }} />}
                                paginationComponentOptions={paginationComponentOptions}
                            />
                        )}
                        {errorMessage && (
                            <p
                                className="error-msg"
                                style={{
                                    display: errorMessage ? "block" : "none",
                                }}
                            >
                                {errorMessage}
                            </p>
                        )}
                    </div>
                </section>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Bonus system - campaigns",
            description: "Bonus system - campaigns",
        },
    };
}

export default Campaigns;
