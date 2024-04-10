import Head from "next/head";
import Title from "@/components/admin/UI/Title";
import AdminLayout from "@/components/admin/AdminLayout";
import { Col, Row } from "react-bootstrap";
import UserSettings from "@/components/admin/Settings/UserSettings";
import { useEffect, useState } from "react";
import { LanguageState } from "@/context/FrontLanguageProvider";
import AffiliateCommission from "@/components/admin/Settings/AffiliateCommission";

const Settings = ({ props }) => {
    const [isNotAccessible, setIsNotAccessible] = useState(true);
    const { adminLanguageData } = LanguageState();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        user?.accountType === "administrator" ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props?.title} />
                <meta name="description" content={props?.description} />
            </Head>

            <AdminLayout>
                <div className="user_main_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>
                                        {adminLanguageData?.settings_page?.page_title?.value || "Settings"}
                                    </Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {!isNotAccessible ? (
                        <p className="error-msg" style={{ display: "block" }}>
                            {
                                adminLanguageData?.common_restriction_message?.page_not_accessible_message
                                    ?.value
                            }
                        </p>
                    ) : (
                        <>
                            <UserSettings />
                            <AffiliateCommission />
                        </>
                    )}
                </div>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Sport Book Settings",
            description: "Sport Book Settings",
        },
    };
}
export default Settings;
