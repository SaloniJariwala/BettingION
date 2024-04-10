import Head from "next/head";
import { useRouter } from "next/router";
import { MY_SEO } from "@/config";

const Meta = () => {
    const router = useRouter();

    return (
        <Head>
            <title key="title">{MY_SEO?.title}</title>
            <meta name="description" content={MY_SEO?.description} />
            <link rel="canonical" href={`${MY_SEO?.openGraph.url}${router.pathname}`} />
            <meta property="og:type" content={MY_SEO?.openGraph.type} />
            <meta property="og:title" content={MY_SEO?.openGraph.title} />
            <meta property="og:description" content={MY_SEO?.openGraph.description} />
            <meta property="og:url" content={`${MY_SEO?.openGraph.url}${router.pathname}`} />
            <meta property="og:site_name" content={MY_SEO?.title} />
            <meta property="og:image" content={MY_SEO?.openGraph.image} />
        </Head>
    );
};

export default Meta;
