import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import sha1 from "sha1";

const WalletAddress = (props) => {
    const router = useRouter();
    const { adminLanguageData } = AdminLanguageState();
    const [walletData, setWalletData] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/currency-address?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authKey}`
            )
            .then((response) => {
                setWalletData(response?.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleOnChange = (event, id) => {
        const updatedData = walletData?.map((item) => {
            if (item?.id === id) {
                return { ...item, address: event.target.value };
            } else {
                return item;
            }
        });
        setWalletData(updatedData);
    };
    const handleUpdate = (event, id) => {
        event.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");
        const selected = walletData?.find((item) => item?.id === id);
        if (!selected?.address || selected?.address === "") {
            setErrorMessage("Wallet Address is required");
            return;
        }
        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
                `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        axios
            .post(
                ` ${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/update-currency-address?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&currencyAbrv=${selected?.currencyAbrv}&address=${
                    selected?.address
                }&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&authKey=${authKey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <div className="title_bar">
                    <Row className="align-items-center">
                        <Col lg={5}>
                            <div className="title">
                                <Title>
                                    {adminLanguageData?.wallet_address_page?.wallet_address_page_title?.value}
                                </Title>
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row>
                    {!isNotAccessible ? (
                        <Col lg={12}>
                            <div className="use_main_form">
                                <p className="error-msg" style={{ display: "block" }}>
                                    {
                                        adminLanguageData?.common_restriction_message
                                            ?.page_not_accessible_message?.value
                                    }
                                </p>
                            </div>
                        </Col>
                    ) : (
                        <>
                            <Col lg={12}>
                                <form className="wallet_address_form">
                                    {walletData?.map((item) => {
                                        return (
                                            <div key={item.currencyAbrv}>
                                                <div className="form_input_wp side_input">
                                                    <label htmlFor={item.currencyAbrv}>
                                                        {item.currencyAbrv}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name={item.currencyName}
                                                        className="form_input"
                                                        defaultValue={item.address}
                                                        onChange={(event) => handleOnChange(event, item?.id)}
                                                        required
                                                    />
                                                    <div className="submit_btn">
                                                        <button
                                                            onClick={(event) => handleUpdate(event, item?.id)}
                                                            className="sec_btn"
                                                            style={{ width: "auto", marginBottom: 5 }}>
                                                            {
                                                                adminLanguageData?.wallet_address_page
                                                                    ?.update_button?.value
                                                            }
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {successMessage && (
                                        <p
                                            className="success-msg"
                                            style={{
                                                display: successMessage ? "block" : "none",
                                            }}>
                                            {successMessage}
                                        </p>
                                    )}
                                    {errorMessage && (
                                        <p
                                            className="error-msg"
                                            style={{
                                                display: errorMessage ? "block" : "none",
                                            }}>
                                            {errorMessage}
                                        </p>
                                    )}
                                </form>
                            </Col>
                        </>
                    )}
                </Row>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Wallet address",
            description: "Wallet address",
        },
    };
}

export default WalletAddress;
