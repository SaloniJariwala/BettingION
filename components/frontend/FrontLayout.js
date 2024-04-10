// Css file
import "bootstrap/scss/bootstrap-grid.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap-daterangepicker/daterangepicker.css";
import "simplebar-react/dist/simplebar.min.css";

// Components
import Header from "@/components/frontend/Header";
import Footer from "@/components/frontend/Footer";
import Sidebar from "@/components/frontend/Sidebar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CookieModal from "./Modal/CookieModal";
import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
    barColors: {
        0: "#7d4fe9",
        0.5: "#0acc86",
        1.0: "#e150e7",
    },
    shadowBlur: 2,
    shadowColor: "#7d4fe9",
});

const FrontLayout = ({ children }) => {
    const [sideBarCollapse, setSidebarCollapse] = useState(false);
    const [dropDown, SetDropDown] = useState(false);
    const [login, setLogin] = useState();
    const [isCookie, setIsCookies] = useState(false);
    const [loading, setLoading] = useState(false);
    const [closeLanguage, setCloseLanguage] = useState(false);

    const router = useRouter();

    const providerSidebarPathData = [
        {
            path: "/casino",
        },
        {
            path: "/live-dealer",
        },
        {
            path: "/virtual-sports",
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            if (localStorage.getItem("isCookie")) {
                setIsCookies(false);
            } else {
                setIsCookies(true);
            }
        }, 5000);
    }, []);

    useEffect(() => {
        const start = () => {
            setLoading(true);
        };
        const end = () => {
            setLoading(false);
        };
        router.events.on("routeChangeStart", start);
        router.events.on("routeChangeComplete", end);
        router.events.on("routeChangeError", end);

        return () => {
            router.events.off("routeChangeStart", start);
            router.events.off("routeChangeComplete", end);
            router.events.off("routeChangeError", end);
        };
    }, [router]);

    const providerSidebarPath = providerSidebarPathData.filter((data) => router?.pathname?.includes(data.path));
    const routerPath = providerSidebarPath[0]?.path;
    const allGamesPages = router?.pathname?.includes(routerPath);

    useEffect(() => {
        if (!sideBarCollapse) {
            document.body.classList.add(`sidebar_open`);
        } else {
            document.body.classList.remove(`sidebar_open`);
        }
    }, [sideBarCollapse]);

    useEffect(() => {
        if (window.innerWidth <= 1023) {
            document.body.classList.remove(`sidebar_open`);
        }
    }, []);

    useEffect(() => {
        if (allGamesPages) {
            document.body.classList.add("casino_page");
            setSidebarCollapse(true);
        } else {
            document.body.classList.remove("casino_page");
        }
    }, [allGamesPages]);

    const sidebarOpenButton = () => {
        setCloseLanguage(false);
        if (Object.values(document.body.classList).includes("sidebar_open")) {
            document.body.classList.remove(`sidebar_open`);
            setCloseLanguage(true);
        } else {
            document.body.classList.add(`sidebar_open`);
        }
        SetDropDown(false);
    };

    const providerSidebarButton = () => {
        document.body.classList.add(`provider_sidebar_open`);
    };

    const dropDownBtn = () => {
        SetDropDown(!dropDown);

        if (!sideBarCollapse) {
            document.body.classList.add(`sidebar_open`);
        }
        setSidebarCollapse(false);
    };

    const openSidebar = () => {
        if (!sideBarCollapse) {
            document.body.classList.add(`sidebar_open`);
        }
        setSidebarCollapse(false);
    };

    const closeSidebar = () => {
        document.body.classList.remove(`sidebar_open`);
    };

    return (
        <>
            {loading && <TopBarProgress />}
            <Header sidebarOpenButton={sidebarOpenButton} providerSidebarButton={providerSidebarButton} allGamesPages={allGamesPages} />
            <Sidebar
                SetDropDown={SetDropDown}
                login={login}
                setLogin={setLogin}
                dropDown={dropDown}
                dropDownBtn={dropDownBtn}
                closeSidebar={closeSidebar}
                openSidebar={openSidebar}
                closeLanguage={closeLanguage}
                setCloseLanguage={setCloseLanguage}
            />
            <div className="page-container">
                <main className="page-main">{children}</main>
                <Footer />
            </div>
            {isCookie && <CookieModal />}
        </>
    );
};

export default FrontLayout;
