import { bottomHeaderData } from "@/pages/api/frontend/bottomHeaderData";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import menuIcon from "@/frontend/images/menu_icon.svg";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { useEffect, useState } from "react";

const BottomHeader = ({ sidebarOpenButton }) => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const [user, setUser] = useState();

    useEffect(() => {
        setUser(localStorage.getItem("User"));
    }, []);

    const getKey = (key, title) => {
        if (key) {
            for (const property in languageData?.header_menu) {
                if (key?.toLowerCase() === property?.toLowerCase()) {
                    return languageData.header_menu[property]?.value;
                }
            }
        } else {
            return title;
        }
    };

    return (
        <div className="bottom_header">
            <ul>
                {bottomHeaderData?.map((data, index) => {
                    if (!user && data?.id === "2") return;
                    return (
                        <li key={index}>
                            <Link
                                href={data.link}
                                title={getKey(data.key, data.title) || data.title}
                                className={`${router?.pathname === data.link ? "active_header_nav" : ""}`}>
                                <span className="menu_icons">
                                    <Image
                                        loading="lazy"
                                        src={data.default_icon}
                                        alt={getKey(data.key, data.title) || data.title}
                                    />
                                </span>
                                {getKey(data.key, data.title) || data.title}
                            </Link>
                        </li>
                    );
                })}

                <li className="menu_icon_wp hide_desktop_show_tablet">
                    <button className="menu_icon" onClick={sidebarOpenButton}>
                        <span className="menu_icons">
                            <Image loading="lazy" src={menuIcon} alt="Menu Icon" />
                        </span>
                        menu
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default BottomHeader;
