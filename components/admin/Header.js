import { useEffect, useState } from "react";
import Link from "next/link";
import ChangePassword from "./Modals/ChangePassword";
import ChangeLanguageModal from "./Modals/ChangeLanguageModal";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const Header = () => {
    const { balance, points, userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [passwordModal, setPasswordModal] = useState(false);
    const [languageModal, setLanguageModal] = useState(false);
    const [admin, setAdmin] = useState();
    const [sideBarCollapse, setSidebarCollapse] = useState(false);

    useEffect(() => {
        if (sideBarCollapse) {
            document.body.classList.add(`sidebar_open`);
        } else {
            document.body.classList.remove(`sidebar_open`);
        }
    }, [sideBarCollapse]);

    const password = () => {
        setPasswordModal(true);
    };

    const langModal = () => {
        setLanguageModal(true);
    };
    const handleLogOut = () => {
        localStorage.removeItem("User");
        localStorage.removeItem("currency");
        localStorage.removeItem("MonthlyNetwin");
        localStorage.removeItem("NetIncome");
        localStorage.removeItem("DailyNetwin");
    };

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("User"));
        if (loggedInUser) {
            setAdmin(loggedInUser);
        }
    }, []);

    return (
        <>
            <div className="header_wp">
                <button className="menu-toggle for_mob" onClick={() => setSidebarCollapse(!sideBarCollapse)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <header className="site_header">
                    <nav className="navbar_wp">
                        <ul>
                            <li>
                                <Link
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    title="Balance"
                                    className="cursor_not_allow">
                                    <i className="fal fa-sack-dollar"></i>
                                    <span>
                                        <span className="woocommerce-Price-currencySymbol woo_current_user_balance">
                                            {balance === 0 || balance ? (
                                                <>
                                                    {renderAmountWithCurrency(
                                                        balance,
                                                        userDefaultCurrency?.currencyAbrv
                                                    )}
                                                </>
                                            ) : (
                                                <span className="load-more" style={{ display: "block" }}>
                                                    <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    title="Points"
                                    className="cursor_not_allow">
                                    <i className="fal fa-coins"></i>
                                    <span>
                                        <span className="woocommerce-Price-currencySymbol woo_current_user_balance">
                                            {balance === 0 || balance ? (
                                                <>{points === undefined ? `0 PTS` : `${points} PTS`}</>
                                            ) : (
                                                <span className="load-more" style={{ display: "block" }}>
                                                    <i className="fad fa-spinner-third  fa-spin ajax-loader" />
                                                </span>
                                            )}
                                        </span>
                                    </span>
                                </Link>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                    <i className="fas fa-headset"></i>
                                </a>
                                <ul>
                                    <li>
                                        <Link
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            data-toggle="modal"
                                            data-target="#contact-support"
                                            className="contact-support-button">
                                            <i className="fal fa-paper-plane"></i>{" "}
                                            {adminLanguageData?.header?.contact_support_text?.value}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => e.preventDefault()}>
                                    <i className="fal fa-user"></i>
                                    <span>{admin?.username}</span>
                                </a>
                                <ul>
                                    <li>
                                        <Link
                                            href=""
                                            onClick={password}
                                            data-toggle="modal"
                                            data-target="#main_change_password">
                                            <i className="far fa-angle-right"></i>{" "}
                                            {adminLanguageData?.header?.header_change_password?.value}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href=""
                                            onClick={langModal}
                                            data-toggle="modal"
                                            data-target="#change-language">
                                            <i className="far fa-angle-right"></i>{" "}
                                            {adminLanguageData?.header?.header_change_language?.value}
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/admin" onClick={handleLogOut}>
                                            <i className="far fa-angle-right"></i>{" "}
                                            {adminLanguageData?.header?.header_logout?.value}
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>

            <ChangePassword
                show={passwordModal}
                setShow={setPasswordModal}
                userId={JSON.parse(localStorage.getItem("User"))?.remoteId}
            />

            <ChangeLanguageModal show={languageModal} setShow={setLanguageModal} />
        </>
    );
};

export default Header;
