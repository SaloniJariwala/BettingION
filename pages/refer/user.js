import { Col, Container, Row } from "react-bootstrap";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";
import Head from "next/head";
import FrontLayout from "@/components/frontend/FrontLayout";

const User = (props) => {
    const { languageData } = LanguageState();

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <div className="inner-page-text">
                    <section className="register-section">
                        <Container>
                            <Row className="m-auto justify-content-center">
                                <Col lg={6} className="text-center">
                                    <h2 className="h2_title text_center">
                                        {languageData?.refer_page?.refer_page_title?.value ||
                                            "Account Creation"}
                                    </h2>
                                    <div className="refer_links">
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: HrefLocalReplace(
                                                    languageData?.refer_page?.refer_page_text?.value
                                                ),
                                            }}></p>

                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: HrefLocalReplace(
                                                    languageData?.refer_page?.already_account?.value
                                                ),
                                            }}></p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                </div>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Create user with referral",
            description: "Create user with referral",
        },
    };
}

export default User;
