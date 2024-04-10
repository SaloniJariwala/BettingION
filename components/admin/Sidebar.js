/* eslint-disable react-hooks/exhaustive-deps */
import Image from "next/image";
import Link from "next/link";
import Logo from "@/assets/admin/images/bettingIon_white_logo.png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sidebarData } from "@/api/admin/adminSidebarData";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Sidebar = () => {
    const { adminLanguageData } = AdminLanguageState();
    const [sideBarCollapse, setSidebarCollapse] = useState(false);
    const [parentAgentIds, setParentAgentIds] = useState([]);
    const [loginUser, setLoginUser] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setLoginUser(JSON.parse(localStorage.getItem("User")));
    }, []);

    useEffect(() => {
        let res;
        sidebarData?.forEach((item) => {
            if (item?.child) {
                item?.child?.forEach((i) => {
                    if (i?.subChild) {
                        i?.subChild?.forEach((sub) => {
                            if (sub?.link === router.pathname) {
                                res = item?.id;
                                const ele = document.getElementById(res);
                                ele?.classList.add("nav_menu_open");
                                ele?.firstChild?.classList.add("current_menu_active");
                                const inner = ele?.firstChild?.nextSibling.childNodes;
                                inner?.forEach((child) => {
                                    if (child?.id === i?.id) {
                                        child.classList.add("nav_menu_open");
                                        child?.firstChild?.classList.add("current_menu_active");
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                    } else {
                        if (i?.link === router.pathname) {
                            res = item?.id;
                            const ele = document.getElementById(res);
                            ele?.classList.add("nav_menu_open");
                            ele?.firstChild?.classList.add("current_menu_active");
                            return false;
                        }
                    }
                });
            } else {
                if (item?.link === router.pathname) {
                    res = item?.id;
                    const ele = document.getElementById(res);
                    ele?.classList.add("nav_menu_open");
                    ele?.firstChild?.classList.add("current_menu_active");
                    return false;
                }
            }
        });
    }, []);

    useEffect(() => {
        if (sideBarCollapse) {
            document.body.classList.add(`collapse-menu-active`);
        } else {
            document.body.classList.remove(`collapse-menu-active`);
        }
    }, [sideBarCollapse]);

    const handleShowHide = (id) => {
        if (parentAgentIds.includes(id)) {
            const arr = parentAgentIds.filter((item) => item !== id);
            setParentAgentIds(arr);
            const ele = document.getElementById(id);
            ele?.firstChild?.classList.remove("current_menu_active");
            ele?.classList.remove("nav_menu_open");
        } else {
            setParentAgentIds([...parentAgentIds, id]);
        }
    };

    const getKey = (key, title) => {
        if (key) {
            for (const property in adminLanguageData?.admin_sidebar) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return adminLanguageData?.admin_sidebar[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    return (
        <>
            <section className="side_bar">
                <div className="header-logo">
                    <Link href="/" target="_blank">
                        <Image src={Logo} alt="Logo" />
                    </Link>
                </div>
                <nav className="side_bar_nav navbar_wp">
                    <ul>
                        {sidebarData.map((data) => {
                            // validate user access
                            if (
                                !data?.userAccess?.includes(JSON.parse(localStorage.getItem("User"))?.accountType) ||
                                (data.id === "menu-8" && JSON.parse(localStorage.getItem("User"))?.username === "casinoterra.io")
                            ) {
                                return;
                            }

                            return (
                                <li
                                    id={data.id}
                                    key={data.id}
                                    className={`${router.pathname == data.link || router.pathname == data.child?.link ? "active-nav" : ""} ${
                                        data?.child || router.pathname == data?.child?.link ? "sub_menu_li " + `${parentAgentIds.includes(data.id) ? "nav_menu_open" : ""}` : ""
                                    }`}
                                >
                                    <Link
                                        href={data.link}
                                        title={getKey(data.key, data.title) || data.title}
                                        onClick={data?.child ? () => handleShowHide(data.id) : null}
                                        className={
                                            data?.child
                                                ? "sidebar_sub_menu " +
                                                  `${
                                                      (router.pathname == data.link || router.pathname == data?.child?.link ? "current_menu_active" : "",
                                                      parentAgentIds.includes(data.id) ? "current_menu_active" : "")
                                                  }`
                                                : ""
                                        }
                                    >
                                        {data.icon}
                                        <span>
                                            {getKey(data.key, data.title) || data.title}
                                            {data?.child ? <i className="far fa-angle-right"></i> : null}
                                        </span>
                                    </Link>

                                    {data?.child ? (
                                        <ul id={data?.id}>
                                            {data?.child?.map((childData) => {
                                                return (
                                                    <li
                                                        id={childData.id}
                                                        key={childData?.id}
                                                        className={`${router.pathname == childData.link ? "active-nav" : ""} ${
                                                            childData?.subChild ? "sub_menu_li " + `${parentAgentIds.includes(childData.id) ? "nav_menu_open" : ""}` : ""
                                                        }`}
                                                    >
                                                        <Link
                                                            href={childData?.link}
                                                            title={getKey(childData.key, childData.title) || childData.title}
                                                            onClick={childData?.subChild ? () => handleShowHide(childData.id) : null}
                                                            className={childData?.subChild ? `${"sidebar_sub_menu " + `${parentAgentIds.includes(childData.id) ? "current_menu_active" : ""}`}` : ""}
                                                        >
                                                            {childData?.icon}
                                                            <span>
                                                                {getKey(childData.key, childData.title) || childData.title} {childData?.subChild ? <i className="far fa-angle-right"></i> : null}
                                                            </span>
                                                        </Link>

                                                        {childData?.subChild ? (
                                                            <ul id={childData?.id}>
                                                                {childData?.subChild?.map((subChildData) => {
                                                                    const innerChildMenu = (
                                                                        <li id={subChildData?.id} key={subChildData?.id} className={router.pathname == subChildData?.link ? "active-nav" : ""}>
                                                                            <Link href={subChildData?.link} title={getKey(subChildData.key, subChildData.title) || subChildData.title}>
                                                                                {subChildData?.icon}
                                                                                <span>{getKey(subChildData.key, subChildData.title) || subChildData.title}</span>
                                                                            </Link>
                                                                        </li>
                                                                    );

                                                                    if (subChildData?.id === "6.2.3") {
                                                                        if (
                                                                            JSON.parse(localStorage.getItem("User"))?.accountType?.accountType === "administrator" ||
                                                                            JSON.parse(localStorage.getItem("User"))?.accountType?.accountType === "super-agent"
                                                                        ) {
                                                                            return innerChildMenu;
                                                                        }
                                                                    } else {
                                                                        return innerChildMenu;
                                                                    }
                                                                })}
                                                            </ul>
                                                        ) : null}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    ) : null}
                                </li>
                            );
                        })}

                        <li className="collapse_menu" onClick={() => setSidebarCollapse(!sideBarCollapse)}>
                            <Link href="#">
                                <i className="fas fa-angle-double-left"></i>
                                <span>Collapse Menu</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </section>
        </>
    );
};

export default Sidebar;
