import Link from "next/link";
import { Col, Container, Row } from "react-bootstrap";
import FrontLayout from "../FrontLayout";
import AccountTab from "./AccountTab";
import { accountWalletTabData } from "@/api/frontend/accountWalletTabData";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { useEffect, useState } from "react";
import { BalanceState } from "@/context/BalanceProvider";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { useRouter } from "next/router";
import Loader from "@/components/admin/UI/Loader";

const AccountSidebar = ({ children }) => {
    const router = useRouter();
    const { balance, userDefaultCurrency } = BalanceState();
    const { languageData } = LanguageState();
    const [loggedInUser, setLoggedInUser] = useState(false);

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.account_withdraw_sidebar) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData?.account_withdraw_sidebar[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (!user) {
            router.push("/login");
        } else {
            setLoggedInUser(localStorage.getItem("User"));
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
                                <div className="wallet_info">
                                    <div>
                                        {languageData?.wallet_pages?.current_wallet_balance?.value}
                                        &nbsp;:&nbsp;
                                        <b className="wallet_balance">
                                            {renderAmountWithCurrency(
                                                balance,
                                                userDefaultCurrency?.currencyAbrv
                                            )}
                                        </b>
                                    </div>
                                    <Link
                                        title="Back To Wallet"
                                        className="woocommerce-info_back_icon"
                                        href="/my-account/wallet">
                                        <i className="fal fa-arrow-to-left"></i>
                                    </Link>
                                </div>

                                <AccountTab data={accountWalletTabData} getKey={getKey} />
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
