import Head from "next/head";
import React, { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import AddEditBonus from "@/components/admin/Bonus/AddEditBonus";
import Loader from "@/components/admin/UI/Loader";
import { useRouter } from "next/router";

const Edit = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [bonusDetails, setBonusDetails] = useState();

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/get-campaign?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&campaignId=${id}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setBonusDetails(response.data?.data);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            {loading ? <Loader /> : <AddEditBonus bonusDetails={bonusDetails} />}
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Edit bonus",
            description: "Edit bonus",
        },
    };
}

export default Edit;
