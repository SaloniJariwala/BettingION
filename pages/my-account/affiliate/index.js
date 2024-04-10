import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";

const Affiliate = (props) => {
    const router = useRouter();

    useEffect(() => {
        if (typeof localStorage === "undefined" && !JSON.parse(localStorage.getItem("User"))) {
            router.push("/login");
        } else {
            router.push("./affiliate/commissions");
        }
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Affiliate",
            description: "Affiliate",
        },
    };
}

export default Affiliate;
