import AdminLayout from "@/components/admin/AdminLayout";
import CategoryModal from "@/components/admin/Modals/CategoryModal";
import CategoryList from "@/components/admin/Posts/Category/category";
import Title from "@/components/admin/UI/Title";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Category = (props) => {
    const [categoryModal, setCategoryModal] = useState(false);
    const [categoryList, setCategorylist] = useState([]);
    const [refreshList, setRefreshList] = useState(false);
    const [categoryAction, setCategoryAction] = useState("");
    const [loading, setIsLoading] = useState(true);
    const [isNotAccessible, setIsNotAccessible] = useState(true);
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    const reloadList = () => {
        setRefreshList((prev) => !prev);
    };

    const categoryActionHandler = (action, categoryId = 0, category = {}) => {
        const categoryAction = {
            action: action,
            categoryId: categoryId,
            category: category,
        };
        setCategoryAction(categoryAction);
        setCategoryModal(true);
    };

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setIsLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/blog-category-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setCategorylist(response.data?.data);
                } else {
                    setCategorylist([]);
                }
            })
            .catch((error) => {
                setCategorylist([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [refreshList]);

    return (
        <React.Fragment>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <section className="slider_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>{adminLanguageData?.categories_page?.categories_page_title?.value}</Title>
                                </div>
                            </Col>
                            <Col lg={6} className="text-lg-end">
                                <button type="button" className="sec_btn" onClick={() => categoryActionHandler("add")}>
                                    {adminLanguageData?.categories_page?.categories_add_button?.value} <i className="far fa-plus-circle"></i>
                                </button>
                            </Col>
                        </Row>
                    </div>

                    {loading ? (
                        <>
                            <span
                                className="load-more"
                                style={{
                                    display: loading ? "block" : "none",
                                    textAlign: "center",
                                    margin: 0,
                                    fontSize: "25px",
                                }}
                            >
                                <i className="fad fa-spinner-third fa-spin"></i>
                            </span>
                        </>
                    ) : categoryList?.length > 0 ? (
                        <div className="slider_main">
                            {categoryList?.map((category) => {
                                return <CategoryList key={category?.id} category={category} refreshList={reloadList} />;
                            })}
                        </div>
                    ) : (
                        <div>
                            <p className="text-center">{adminLanguageData?.categories_page?.categories_not_found?.value}</p>
                        </div>
                    )}
                </section>
            </AdminLayout>
            <CategoryModal setShow={setCategoryModal} show={categoryModal} refreshList={reloadList} action={categoryAction} />
        </React.Fragment>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Blog Category",
            description: "Category",
        },
    };
}

export default Category;
