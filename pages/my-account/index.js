import FrontLayout from "@/components/frontend/FrontLayout";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

const MyAccount = (props) => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const [loginUser, setLoginUser] = useState();

    useEffect(() => {
        if (localStorage.getItem("User")) {
            setLoginUser(JSON.parse(localStorage.getItem("User")));
        } else {
            router.push("/login");
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <section className="account_page">
                    <Container>
                        <Row>
                            <Col lg="12">
                                <h2
                                    className="h2_title text_center"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.my_account_page_title?.value,
                                    }}></h2>
                                <div className="account_page_box">
                                    <div className="account_box_content">
                                        <p className="text_center">
                                            {languageData?.my_account_page?.account_box_content?.value}{" "}
                                            <strong>{loginUser?.username}</strong> (not&nbsp;
                                            {loginUser?.username}?{" "}
                                            <Link
                                                href="/login"
                                                onClick={(event) => localStorage.removeItem("User")}>
                                                {
                                                    languageData?.my_account_page
                                                        ?.account_box_content_sign_out?.value
                                                }
                                            </Link>
                                            ).
                                        </p>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "My account",
            description: "My account",
        },
    };
}

export default MyAccount;
