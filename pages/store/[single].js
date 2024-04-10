/* react-hooks/exhaustive-deps */
import Image from "next/image";
import { Col, Container, Row } from "react-bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import axios from "axios";
import { BalanceState } from "@/context/BalanceProvider";
import Head from "next/head";
import { LanguageState } from "@/context/FrontLanguageProvider";
import FrontLayout from "@/components/frontend/FrontLayout";
import Button from "@/components/frontend/UI/Button";
import ClaimRewardModal from "@/components/frontend/Modal/claimRewardModal";

const StoreSingle = (props) => {
    const { points, loading } = BalanceState();
    const router = useRouter();
    const [reward, setReward] = useState();
    const [loadingState, setLoadingState] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [show, setShow] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        if (!JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const rewardId = urlParams.get("id");

        if (rewardId) {
            const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}&id=${rewardId}`);
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/get-reward?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&id=${rewardId}&authKey=${authKey}&remoteId=${user?.userId}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setReward(response.data?.data);
                    } else {
                        setErrorMessage(response.data?.message);
                    }
                })
                .catch((error) => {
                    setErrorMessage(error?.message);
                })
                .finally(() => {
                    setLoadingState(false);
                });
        } else {
            setLoadingState(false);
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                {loadingState ? (
                    <>
                        <span
                            className="load-more reward_error"
                            style={{
                                display: loadingState ? "block" : "none",
                                textAlign: "center",
                                margin: 0,
                                fontSize: "25px",
                            }}
                        >
                            <i className="fad fa-spinner-third fa-spin"></i>
                        </span>
                    </>
                ) : reward ? (
                    <section className="store_single_sec">
                        <Container>
                            <Row>
                                <Col lg={6}>
                                    <div className="product_img">
                                        <Image src={reward?.image} alt={reward?.name} width={620} height={620} loading="lazy" />
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="product_info">
                                        <h1 className="h2_title">{reward?.name}</h1>
                                        <ul>
                                            <li>
                                                <h5 className="h5_title">
                                                    {languageData?.store_single_page?.bonus_label?.value || "Bonus"}: <span>{reward?.description}</span>
                                                </h5>
                                            </li>
                                            {reward?.quantity && (
                                                <li>
                                                    <h5 className="h5_title">
                                                        {languageData?.store_single_page?.quantity_label?.value || "Quantity"}: <span>{reward?.quantity}</span>
                                                    </h5>
                                                </li>
                                            )}
                                            <li>
                                                <h5 className="h5_title">
                                                    {languageData?.store_single_page?.required_label?.value || "Required"}: <span>{reward?.amount} PTS</span>
                                                </h5>
                                            </li>
                                        </ul>
                                        <div className="product_info_btn">
                                            <Button type="button" onClick={() => setShow(true)} disabled={points === undefined || reward?.amount >= points}>
                                                {points === undefined
                                                    ? "Insufficient Points"
                                                    : reward?.amount >= points
                                                    ? "Insufficient Points"
                                                    : languageData?.store_single_page?.claim_now_button?.value || "Claim Now"}
                                            </Button>
                                            <h5>
                                                {languageData?.store_single_page?.Available?.value || "Available"}
                                                {loading ? (
                                                    <span
                                                        className="load-more"
                                                        style={{
                                                            display: loadingState ? "inline-block" : "none",
                                                            color: "#ffffff",
                                                        }}
                                                    >
                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                    </span>
                                                ) : (
                                                    <span>{`${points === undefined ? 0 : points} PTS`}</span>
                                                )}
                                            </h5>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </section>
                ) : (
                    <>
                        <div className="reward_error">
                            <h1 className="h3_title">{errorMessage ? errorMessage : "404 | This page could not be found."}</h1>
                        </div>
                    </>
                )}
            </FrontLayout>

            <ClaimRewardModal show={show} setShow={setShow} reward={reward} />
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Store single page",
            description: "Store single page",
        },
    };
}

export default StoreSingle;
