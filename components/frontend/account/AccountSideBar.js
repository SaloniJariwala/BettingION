import { Col, Container, Row } from "react-bootstrap";
import FrontLayout from "../FrontLayout";
import AccountTab from "./AccountTab";
import { accountTabData } from "@/api/frontend/accountTabData";
import { LanguageState } from "@/context/FrontLanguageProvider";
import Loader from "@/components/admin/UI/Loader";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const AccountSidebar = ({ children }) => {
    const { languageData } = LanguageState();
    const router = useRouter();
    const [loggedInUser, setLoggedInUser] = useState(false);

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.my_account_sidebar) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData?.my_account_sidebar[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    useEffect(() => {
        const user = JSON.parse(window.localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        } else {
            setLoggedInUser(window.localStorage.getItem("User"));
        }
    }, []);

    return (
        <FrontLayout>
            <section className="account_page">
                {!loggedInUser && <Loader fullScreen />}
                <Container>
                    <Row>
                        <Col lg="12">
                            <h2
                                className="h2_title text_center"
                                dangerouslySetInnerHTML={{
                                    __html: languageData?.my_account_page_title?.value,
                                }}></h2>
                            <div className="account_page_box">
                                <AccountTab data={accountTabData} getKey={getKey} />
                                <div className="account_box_content">{children}</div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </FrontLayout>
    );
};

export default AccountSidebar;
