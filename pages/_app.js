import BalanceProvider from "@/context/BalanceProvider";
import FrontLanguageProvider from "@/context/FrontLanguageProvider";
import Meta from "./api/meta";
import "@/assets/css/fontawesome-min.css";
import "@/assets/css/loader.css";
import Script from "next/script";
import GamesProvider from "@/context/GamesProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "../assets/scss/index.scss";
import AdminLanguageProvider from "@/context/AdminLanguageProvider";

const App = ({ Component, pageProps }) => {
    const router = useRouter();

    useEffect(() => {
        if (router.pathname?.includes("/admin")) {
            const htmlTag = document.getElementsByTagName("html")[0];
            htmlTag.classList.remove("bettingion_index");
            htmlTag.classList.add("bettingion_admin");
        }
    }, [router.pathname]);

    return (
        <>
            <Meta />
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-MXETYHQ8NJ"
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-MXETYHQ8NJ');`}
            </Script>

            <AdminLanguageProvider>
                <FrontLanguageProvider>
                    <BalanceProvider>
                        <GamesProvider>
                            <Component {...pageProps} />
                        </GamesProvider>
                    </BalanceProvider>
                </FrontLanguageProvider>
            </AdminLanguageProvider>
        </>
    );
};

export default App;
