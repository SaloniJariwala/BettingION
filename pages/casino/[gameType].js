import Casino from "@/pages/casino";

export async function getServerSideProps(context) {
    const initialGameType = context.params.gameType || "";

    return {
        props: {
            initialGameType,
        },
    };
}

export default Casino;
 