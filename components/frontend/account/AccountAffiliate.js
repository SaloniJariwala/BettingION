import FrontLayout from "@/components/frontend/FrontLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Loader from "@/components/admin/UI/Loader";
import Link from "next/link";
import { LanguageState } from "@/context/FrontLanguageProvider";

const AccountAffiliate = ({ children }) => {
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

        if (router?.pathname === "/my-account/affiliate") {
            router.push("/my-account/affiliate/commissions");
        }
    }, []);

    const menuData = [
        {
            title: languageData?.affiliate_page?.commissions_tab?.value,
            link: "/my-account/affiliate/commissions",
        },
        {
            title: languageData?.affiliate_page?.referrals_tab?.value,
            link: "/my-account/affiliate/referrals",
        },
        {
            title: languageData?.affiliate_page?.campaigns_tab?.value,
            link: "/my-account/affiliate/campaigns",
        },
    ];

    return (
        <>
            <FrontLayout>
                <section className="account_page account_setting affiliate_account">
                    <Container>
                        {!loggedInUser && <Loader fullScreen />}
                        <Row>
                            <Col lg="12">
                                <h2 className="h2_title text_center">Affiliate</h2>
                                <div className="account_setting_tabs">
                                    <ul>
                                        {menuData.map((data, index) => {
                                            return (
                                                <li key={index}>
                                                    <Link
                                                        href={data.link}
                                                        className={`${
                                                            router?.pathname === data.link
                                                                ? "active_setting_tab"
                                                                : ""
                                                        }`}>
                                                        {data.title}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="account_page_box">
                                    <div className="account_box_content affiliate_box_content">
                                        {children}
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

export default AccountAffiliate;
