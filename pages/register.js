import Head from "next/head";
import FrontLayout from "@/components/frontend/FrontLayout";
import Registration from "@/components/frontend/Registration";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Loader from "@/components/admin/UI/Loader";

const Register = (props) => {
    const router = useRouter();
    const [user, setUser] = useState(false);

    useEffect(() => {   
        if (localStorage.getItem("User")) {
            router.push("/my-account");
        }
        setUser(true);
    }, []);

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                {!user ? (
                    <Loader fullscreen />
                ) : (
                    <div className="inner-page-text">
                        <Registration />
                    </div>
                )}
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Registration",
            description: "Registration",
        },
    };
}

export default Register;
