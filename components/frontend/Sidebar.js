import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SidebarData } from "@/api/frontend/sidebarData";
import LanguageDropDown from "./common/LanguageDropDown";
import { BalanceState } from "@/context/BalanceProvider";
import { LanguageState } from "@/context/FrontLanguageProvider";
import closeIcon from "@/frontend/images/close_icon.svg";
import SimpleBar from "simplebar-react";
import useLocalStorage from "use-local-storage";
import darkMode from "@/frontend/images/sidebar/dark_mode_icon.svg";
import lightMode from "@/frontend/images/sidebar/light_mode_icon.svg";

const Sidebar = ({ dropDown, dropDownBtn, closeSidebar, openSidebar, closeLanguage, setCloseLanguage }) => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const { points } = BalanceState();
    const [login, setLogin] = useState();
    const [theme, setTheme] = useLocalStorage("theme", undefined);
    const [user, setUser] = useState();

    useEffect(() => {
        if (localStorage.getItem("User")) {
            setLogin(true);
        }
        setUser(localStorage.getItem("User"));
    }, []);

    useEffect(() => {
        if (theme) {
            document.body.classList.add("light_mode");
            localStorage.setItem("lightMode", true);
        } else {
            document.body.classList.remove("light_mode");
            localStorage.setItem("lightMode", false);
        }
    }, [theme]);

    const themeMode = () => {
        setTheme((prev) => !prev);
    };

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.sidebar) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData.sidebar[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    return (
        <div className="page-sidebar">
            <div className="sidebar_top_info hide_desktop_show_tablet">
                <h4 className="h4_title">Menu</h4>
                <button className="round_btn" type="button" onClick={closeSidebar}>
                    <Image loading="lazy" src={closeIcon} alt="BettingIon Close" width={12} height={12} />
                </button>
            </div>
            <SimpleBar>
                <div className="sidebar_items">
                    <div className="sidebar_menu">
                        <ul className="menu_items">
                            {SidebarData?.map((data) => {
                                const { id, title, link, default_icon, key, point, access } = data;

                                if ((login && access === "visitor") || (!login && access === "user")) return;

                                if (!user && id === "4") return;

                                const isActiveMenu = (router?.pathname.includes("/my-account") && id === "3") || router.pathname === link || (data?.child && dropDown) ? "menu_active " : "";

                                return (
                                    <li
                                        key={id}
                                        id={id}
                                        className={`${router.pathname === link || (data?.child && dropDown) ? "menu_active " : ""} ${isActiveMenu}${data?.child && dropDown ? "active" : ""} ${
                                            data?.child && dropDown ? "active" : ""
                                        }`}
                                    >
                                        {data?.child ? (
                                            <button title={getKey(key, title) || title} onClick={data?.child && dropDownBtn}>
                                                <span className="menu_icons">
                                                    <Image loading="lazy" width="auto" height="20" src={default_icon} alt="Bitcoin Casino - Crypto Currency Casino " />
                                                </span>
                                                <span className="title">{getKey(key, title) || title}</span>

                                                {data?.child && <i className="far fa-chevron-down"></i>}
                                            </button>
                                        ) : (
                                            <Link href={link} title={getKey(key, title) || title} onClick={data?.child && dropDownBtn}>
                                                <span className="menu_icons">
                                                    <Image loading="lazy" width="auto" height="20" src={default_icon} alt="Bitcoin Casino - Crypto Currency Casino " />
                                                </span>
                                                <span className="title">{getKey(key, title) || title}</span>
                                                {point && <span className="amount">{points === undefined ? "0 PTS" : `${points} PTS`}</span>}
                                                {data?.child && <i className="far fa-chevron-down"></i>}
                                            </Link>
                                        )}
                                        {data?.child && (
                                            <ul
                                                className="sub-menu"
                                                style={{
                                                    display: dropDown ? "block" : "none",
                                                }}
                                            >
                                                {data?.child.map((children) => {
                                                    return (
                                                        <li key={children.id} className={`${router.pathname === children.link ? "sub_menu_active" : ""}`}>
                                                            <Link href={children.link} title={getKey(children.key, children.title) || children.title}>
                                                                {getKey(children.key, children.title) || children.title}
                                                            </Link>
                                                        </li>
                                                    );
                                                })}

                                                <li>
                                                    <Link
                                                        href="/login"
                                                        title={languageData?.sidebar?.logout?.value || "Logout"}
                                                        onClick={() => {
                                                            localStorage.removeItem("User");
                                                            localStorage.removeItem("currency");
                                                            localStorage.removeItem("MonthlyNetwin");
                                                            localStorage.removeItem("NetIncome");
                                                            localStorage.removeItem("DailyNetwin");
                                                        }}
                                                    >
                                                        {languageData?.sidebar?.logout?.value || "Logout"}
                                                    </Link>
                                                </li>
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div className="sidebar_bottom_items">
                        <div onClick={openSidebar}>
                            <LanguageDropDown closeLanguage={closeLanguage} setCloseLanguage={setCloseLanguage} />
                        </div>

                        <div className="light_mode_switch">
                            <label className="toggle" htmlFor="theme_mode" onChange={themeMode}>
                                <input type="checkbox" className="toggle__input" id="theme_mode" hidden readOnly checked={theme ? true : false} />
                                <span className="toggle-track">
                                    <span className="toggle-indicator"></span>

                                    <div className="toggle_mode_icon">
                                        <span className={!theme ? "active_theme" : ""}>
                                            <Image src={darkMode} alt="Dark Mode" />
                                        </span>
                                        <span className={theme ? "active_theme" : ""}>
                                            <Image src={lightMode} alt="Light Mode" />
                                        </span>
                                    </div>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            </SimpleBar>
        </div>
    );
};

export default Sidebar;
