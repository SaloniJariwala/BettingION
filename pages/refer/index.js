import Head from "next/head";
import FrontLayout from "@/components/frontend/FrontLayout";
import Registration from "@/components/frontend/Registration";

const Refer = (props) => {
    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <FrontLayout>
                <div className="inner-page-text">
                    <Registration />
                </div>
            </FrontLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Refer",
            description: "Refer",
        },
    };
}

export default Refer;
