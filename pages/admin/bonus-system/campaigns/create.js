import Head from "next/head";
import AddEditBonus from "@/components/admin/Bonus/AddEditBonus";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col } from "react-bootstrap";

const CreateBonus = (props) => {
    const router = useRouter();
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["super-agent", "administrator"].includes(user?.accountType)
            ? setIsNotAccessible(true)
            : setIsNotAccessible(false);
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>

            {!isNotAccessible ? (
                <Col lg={12}>
                    <div className="use_main_form">
                        <p className="error-msg" style={{ display: "block" }}>
                            {
                                adminLanguageData?.common_restriction_message?.page_not_accessible_message
                                    ?.value
                            }
                        </p>
                    </div>
                </Col>
            ) : (
                <>
                    <AddEditBonus />
                </>
            )}
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Create bonus",
            description: "Create bonus",
        },
    };
}

export default CreateBonus;
