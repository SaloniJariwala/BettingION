import FrontLayout from "@/components/frontend/FrontLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Loader from "@/components/admin/UI/Loader";
import Link from "next/link";

const AccountSetting = ({ children }) => {
    const router = useRouter();

    const { languageData } = LanguageState();
    const [loggedInUser, setLoggedInUser] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        } else {
            setLoggedInUser(localStorage.getItem("User"));
        }
    }, []);

    const menuData = [
        {
            title: "General",
            link: "/my-account/edit-account",
            key: "general_tabs",
        },
        {
            title: "Security",
            link: "/my-account/security",
            key: "security_tabs",
        },
    ];

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.security_page) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData?.security_page[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    return (
        <>
            <FrontLayout>
                <section className="account_page account_setting">
                    <Container>
                        {!loggedInUser && <Loader fullScreen />}
                        <Row>
                            <Col lg="12">
                                <h2
                                    className="h2_title text_center"
                                    dangerouslySetInnerHTML={{
                                        __html: languageData?.my_account_page_title?.value,
                                    }}
                                ></h2>
                                <div className="account_setting_tabs">
                                    <ul>
                                        {menuData.map((data, index) => {
                                            return (
                                                <li key={index}>
                                                    <Link
                                                        href={data.link}
                                                        title={getKey(data.key, data.title) || data.title}
                                                        className={`${router?.pathname === data.link ? "active_setting_tab" : ""}`}
                                                    >
                                                        {getKey(data.key, data.title) || data.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="account_page_box">
                                    <div className="account_box_content">{children}</div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </FrontLayout>
        </>
    );
};

export default AccountSetting;
