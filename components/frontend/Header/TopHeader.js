import Image from "next/image";
import Link from "next/link";
import logo from "@/frontend/images/bettingIon_white_logo.png";
import searchIcon from "@/frontend/images/search.svg";
import coinIcon from "@/frontend/images/coin/coin_icon.svg";
import btcIcon from "@/frontend/images/coin/btc.svg";
import usdIcon from "@/frontend/images/coin/usd.svg";
import userImg from "@/frontend/images/user.png";
import downIcon from "@/frontend/images/down_icon.svg";
import { useEffect, useState } from "react";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { BalanceState } from "@/context/BalanceProvider";
import Button from "../UI/Button";
import GameSearch from "../Games/GameSearch";
import SimpleBar from "simplebar-react";
import closeIcon from "@/frontend/images/close_icon.svg";
import { LanguageState } from "@/context/FrontLanguageProvider";

const TopHeader = ({ sidebarOpenButton, providerSidebarButton, allGamesPages }) => {
    const { balance, handleCurrencyChange, balanceArr, userDefaultCurrency, rollover, bonus } =
        BalanceState();
    const [dropDown, setDropDown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loginUser, setLoginUser] = useState(null);
    const [gameController, setGameController] = useState(false);
    const [coinDropDown, setCoinDropDown] = useState(false);
    const [currencyData, setCurrencyData] = useState([]);
    const [selectedCurrency, setSelectedCurrency] = useState({
        currencyAbrv: userDefaultCurrency?.currencyAbrv,
        icon: btcIcon,
        balance: balance,
    });
    const [hoveredCurrency, setHoveredCurrency] = useState(selectedCurrency);
    const [toggle, setToggle] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const { languageData } = LanguageState();

    useEffect(() => {
        if (localStorage.getItem("User")) {
            const user = JSON.parse(localStorage.getItem("User"));
            setLoginUser(JSON.parse(localStorage.getItem("User")));
            const userCurrencyData = JSON.parse(localStorage.getItem("User"))?.paymentCurrencies;
            setCurrencyData([
                {
                    currencyAbrv: "USD",
                    currencyName: "Dollar",
                    currencyShortName: "usd",
                    currencySymbol: "$",
                },
                ...userCurrencyData,
            ]);
            setSelectedCurrency({
                currencyAbrv: user?.selectedCurrency?.currencyAbrv || userDefaultCurrency?.currencyAbrv,
                icon: user?.selectedCurrency?.icon || usdIcon,
                balance: user?.selectedCurrency?.balance || balance,
            });

            setHoveredCurrency({
                ...selectedCurrency,
                current: balanceArr?.find((c) => c.currency === selectedCurrency?.currencyAbrv)?.currentPrice,
            });
        }
    }, [balance]);

    useEffect(() => {
        if (JSON.parse(localStorage.getItem("User"))?.selectedCurrency) {
            let user = JSON.parse(localStorage.getItem("User"));
            const latest = balanceArr?.find((c) => c.currency === user?.selectedCurrency?.currencyAbrv);

            setSelectedCurrency({
                currencyAbrv: latest?.currency || user?.selectedCurrency?.currencyAbrv,
                icon: user?.selectedCurrency?.icon,
                balance: latest?.convertPrice,
            });
            const newUser = {
                ...user,
                selectedCurrency: {
                    currencyAbrv: user?.selectedCurrency?.currencyAbrv,
                    icon: user?.selectedCurrency?.icon,
                    balance: user?.selectedCurrency?.balance,
                },
            };
            localStorage.setItem("User", JSON.stringify(newUser));
        }
    }, [balanceArr]);

    const handleLogOut = () => {
        localStorage.removeItem("User");
        localStorage.removeItem("currency");
        localStorage.removeItem("NetIncome");
        localStorage.removeItem("MonthlyNetwin");
        localStorage.removeItem("DailyNetwin");
    };

    const removeSidebarClass = () => {
        if (document.body.classList?.value?.includes("sidebar_open")) {
            document.body.classList.remove(`sidebar_open`);
        }
    };

    const closeDropdown = () => {
        removeSidebarClass();
        setDropDown(true);
    };

    const closeCoinDropdown = () => {
        removeSidebarClass();
        setCoinDropDown(true);
    };

    return (
        <>
            <div className="header_top">
                <div className="header_left">
                    <div className="menu_icon_wp hide_large_tablet">
                        <button
                            className="menu_icon"
                            type="button"
                            aria-label="Menu"
                            onClick={sidebarOpenButton}>
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className="site_logo">
                        <Link href="/" title="BettingIon">
                            <Image loading="lazy" width={180} height={70} src={logo} alt="BettingIon" />
                        </Link>
                    </div>
                </div>

                <div className="header_search hide_large_tablet">
                    <GameSearch
                        setGameController={setGameController}
                        isHeader={true}
                        showClose={false}
                        overlay={true}
                    />
                </div>

                {loginUser && (
                    <div className="header_deposit">
                        <div
                            className="dropdown_close_wrapper"
                            style={{ display: coinDropDown ? "block" : "none" }}
                            onClick={() => setCoinDropDown(false)}></div>
                        <div
                            className={`header_account_balance_dropdown ${coinDropDown ? "active_dropdown_menu" : ""
                                }`}>
                            <div className="header_account_balance">
                                <div className="currency_dropdown">
                                    <Image
                                        loading="lazy"
                                        src={selectedCurrency.icon}
                                        alt="BettingIon"
                                        width={20}
                                        height={20}
                                    />
                                    {selectedCurrency.currencyAbrv}
                                </div>
                                {renderAmountWithCurrency(
                                    selectedCurrency.balance,
                                    userDefaultCurrency?.currencyAbrv
                                )}
                            </div>

                            <div className="currency_dropdown_list">
                                <div className="coin_live_price">
                                    <h5>Coins</h5>
                                    <div className="selected_coin_info">
                                        <p>
                                            {hoveredCurrency.currencyAbrv} balance:{" "}
                                            <span>
                                                {renderAmountWithCurrency(
                                                    hoveredCurrency?.current,
                                                    userDefaultCurrency?.currencyAbrv
                                                )}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <SimpleBar>
                                    <ul>
                                        {currencyData?.map((currency, index) => {
                                            const currencyIcon =
                                                require(`@/frontend/images/coin/${currency.currencyAbrv.toLowerCase()}.svg`).default;
                                            const con = balanceArr?.find(
                                                (c) =>
                                                    c.currency.toLowerCase() ===
                                                    currency.currencyAbrv.toLowerCase()
                                            );
                                            return (
                                                <li
                                                    key={index}
                                                    onMouseEnter={() => {
                                                        setHoveredCurrency({
                                                            currencyAbrv: currency.currencyAbrv,
                                                            icon: currencyIcon,
                                                            current: con?.currentPrice ?? 0,
                                                        });
                                                    }}
                                                    onMouseLeave={() => {
                                                        setHoveredCurrency({
                                                            ...selectedCurrency,
                                                            current: balanceArr?.find(
                                                                (c) =>
                                                                    c.currency ===
                                                                    selectedCurrency?.currencyAbrv
                                                            )?.currentPrice,
                                                        });
                                                    }}
                                                    onClick={() => {
                                                        setSelectedCurrency({
                                                            currencyAbrv: currency.currencyAbrv,
                                                            icon: currencyIcon,
                                                            balance: con?.convertPrice,
                                                        });
                                                        let user = JSON.parse(localStorage.getItem("User"));
                                                        user = {
                                                            ...user,
                                                            selectedCurrency: {
                                                                currencyAbrv:
                                                                    currency.currencyAbrv ||
                                                                    userDefaultCurrency?.currencyAbrv,
                                                                icon: currencyIcon,
                                                                balance: con?.convertPrice || 0,
                                                            },
                                                        };
                                                        localStorage.setItem("User", JSON.stringify(user));
                                                        handleCurrencyChange(currency.currencyAbrv);
                                                        setCoinDropDown(false);
                                                    }}>
                                                    <button type="button">
                                                        <span className="coin_info">
                                                            <Image
                                                                loading="lazy"
                                                                src={currencyIcon}
                                                                alt={currency.currencyName}
                                                                width={20}
                                                                height={20}
                                                            />
                                                            {currency.currencyAbrv}
                                                        </span>

                                                        <span className="coin_price">
                                                            {toggle && (
                                                                <>
                                                                    {renderAmountWithCurrency(
                                                                        con?.convertPrice || 0,
                                                                        userDefaultCurrency?.currencyAbrv
                                                                    )}
                                                                </>
                                                            )}
                                                            <span>
                                                                {Number(con?.balance || 0).toFixed(2)}
                                                            </span>
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </SimpleBar>
                                <div className="switch_to_usd">
                                    <div className="input_switch">
                                        <label className="input_switch_toggle" htmlFor="login_verification">
                                            view in <span>{userDefaultCurrency?.currencyAbrv}</span>
                                            <input
                                                type="checkbox"
                                                className="input_toggle_input"
                                                id="login_verification"
                                                // defaultChecked={false}
                                                value={toggle}
                                                onChange={(event) =>
                                                    event.target.checked ? setToggle(true) : setToggle(false)
                                                }
                                            />
                                            <span className="input_switch_track">
                                                <span className="input_switch_indicator"></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            href="/my-account/deposit"
                            variant="grey"
                            title={languageData?.header?.deposit_button_title?.value}>
                            {languageData?.header?.deposit_button_title?.value}
                        </Button>
                    </div>
                )}

                <div className="header_search_button menu_icon_wp hide_desktop_show_tablet">
                    <button
                        type="button"
                        aria-label="Search"
                        className="search_btn menu_icon"
                        onClick={() => setSearchModal(true)}>
                        <Image loading="lazy" src={searchIcon} alt="" />
                    </button>
                </div>

                <div className={`header_modal_search ${searchModal ? "header_search_open" : ""}`}>
                    <button className="round_btn" type="button" onClick={() => setSearchModal(false)}>
                        <Image loading="lazy" src={closeIcon} alt="BettingIon Close" width={12} height={12} />
                    </button>
                    <GameSearch
                        setGameController={setGameController}
                        isHeader={true}
                        showClose={false}
                        overlay={true}
                    />
                </div>

                {loginUser && (
                    <div className={`header_account_info ${dropDown ? "active_dropdown_menu" : ""}`}>
                        <div
                            className="dropdown_close_wrapper"
                            style={{ display: dropDown ? "block" : "none" }}
                            onClick={() => setDropDown(false)}></div>
                        <button
                            className="header_account_dropdown"
                            onClick={window.innerWidth <= 1023 ? closeDropdown : (prev) => setDropDown(prev)}>
                            <p>{JSON.parse(localStorage.getItem("User"))?.username}</p>
                            <div className="user_img">
                                <Image
                                    loading="lazy"
                                    src={userImg}
                                    width={48}
                                    height={48}
                                    alt="User profile"
                                />
                            </div>
                            <span>
                                <Image loading="lazy" src={downIcon} alt="BettingIon" />
                            </span>
                        </button>

                        <div className="dropdown-menu">
                            <div className="account-dropdown">
                                <div className="account-dropdown_top_info_wp">
                                    <div className="account-dropdown_top_info account-dropdown-user_name">
                                        <span className="small-title">
                                            {languageData?.header_account_menu?.username?.value || "Username"}
                                        </span>
                                        <span className="title">
                                            {JSON.parse(localStorage.getItem("User"))?.username}
                                        </span>
                                    </div>
                                    <div className="account-dropdown_top_info">
                                        <span className="small-title">
                                            {languageData?.header_account_menu?.balance?.value || "Balance"}
                                        </span>
                                        <span className="title header-wallet-balance ">
                                            <Link
                                                className="woo-wallet-menu-contents"
                                                href="/my-account/wallet"
                                                title={
                                                    languageData?.header_account_menu?.balance?.value ||
                                                    "Balance"
                                                }>
                                                <span className="amount">
                                                    {loading ? (
                                                        <span
                                                            className="load-more"
                                                            style={{
                                                                display: loading ? "inline-block" : "none",
                                                                color: "var(--primary_color)",
                                                            }}>
                                                            <i className="fad fa-spinner-third fa-spin"></i>
                                                        </span>
                                                    ) : (
                                                        <>
                                                            {renderAmountWithCurrency(
                                                                balance || 0,
                                                                userDefaultCurrency?.currencyAbrv
                                                            )}
                                                            <Image
                                                                loading="lazy"
                                                                src={coinIcon}
                                                                alt="BettingIon"
                                                            />
                                                        </>
                                                    )}
                                                </span>
                                            </Link>
                                        </span>
                                    </div>
                                    <div className="account-dropdown_top_info">
                                        <span className="small-title">
                                            {languageData?.header_account_menu?.rollover_menu?.value ||
                                                "rollover"}
                                        </span>
                                        <span className="title header-wallet-balance ">
                                            <span className="amount">
                                                {loading ? (
                                                    <span
                                                        className="load-more"
                                                        style={{
                                                            display: loading ? "inline-block" : "none",
                                                            color: "var(--primary_color)",
                                                        }}>
                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                    </span>
                                                ) : (
                                                    <>{rollover || "0/0"}</>
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="account-dropdown_top_info">
                                        <span className="small-title">
                                            {languageData?.header_account_menu?.bonus?.value || "Bonus"}
                                        </span>
                                        <span className="title header-wallet-balance ">
                                            <span className="amount">
                                                {loading ? (
                                                    <span
                                                        className="load-more"
                                                        style={{
                                                            display: loading ? "inline-block" : "none",
                                                            color: "var(--primary_color)",
                                                        }}>
                                                        <i className="fad fa-spinner-third fa-spin"></i>
                                                    </span>
                                                ) : (
                                                    <>
                                                        {renderAmountWithCurrency(
                                                            bonus || 0,
                                                            userDefaultCurrency?.currencyAbrv
                                                        )}
                                                    </>
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <ul className="account-info">
                                <li>
                                    <Link
                                        href="/my-account/active-bonus"
                                        className="list-group-item"
                                        title={
                                            languageData?.active_bonus_page?.active_bonus_page_title?.value ||
                                            "Active Bonus"
                                        }>
                                        {/* <span className="fad fa-check-circle"></span> */}
                                        <span className="fad fa-gift"></span>
                                        {languageData?.active_bonus_page?.active_bonus_page_title?.value ||
                                            "Active Bonus"}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-account/deposit"
                                        className="list-group-item"
                                        title={
                                            languageData?.header_account_menu?.deposit_menu?.value ||
                                            "Deposit"
                                        }>
                                        <span className="fad fa-plus-circle"></span>{" "}
                                        {languageData?.header_account_menu?.deposit_menu?.value || "Deposit"}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-account/wallet-withdrawal"
                                        className="list-group-item"
                                        title={
                                            languageData?.header_account_menu?.withdraw_menu?.value ||
                                            "Withdraw"
                                        }>
                                        <span className="fad fa-wallet"></span>{" "}
                                        {languageData?.header_account_menu?.withdraw_menu?.value ||
                                            "Withdraw"}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-account/edit-account"
                                        className="list-group-item"
                                        title={
                                            languageData?.header_account_menu?.setting_menu?.value ||
                                            "Setting"
                                        }>
                                        <span className="fad fa-dice"></span>{" "}
                                        {languageData?.header_account_menu?.setting_menu?.value || "Setting"}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-account/affiliate"
                                        className="list-group-item"
                                        title={
                                            languageData?.header_account_menu?.affiliate_menu?.value ||
                                            "affiliate"
                                        }>
                                        <span className="fad fa-handshake"></span>{" "}
                                        {languageData?.header_account_menu?.affiliate_menu?.value ||
                                            "affiliate"}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/my-account/wallet"
                                        className="list-group-item"
                                        title={
                                            languageData?.header_account_menu?.transaction_menu?.value ||
                                            "Transactions"
                                        }>
                                        <span className="fad fa-chart-bar"></span>{" "}
                                        {languageData?.header_account_menu?.transaction_menu?.value ||
                                            "Transactions"}
                                    </Link>
                                </li>
                                {loginUser?.accountType !== "player" && (
                                    <li>
                                        <Link
                                            href="/admin"
                                            className="list-group-item"
                                            target="_blank"
                                            title={
                                                languageData?.header_account_menu?.dashboard_menu?.value ||
                                                "Dashboard"
                                            }>
                                            <span className="fas fa-tachometer-alt"></span>{" "}
                                            {languageData?.header_account_menu?.dashboard_menu?.value ||
                                                "Dashboard"}
                                        </Link>
                                    </li>
                                )}
                                <li>
                                    <Link
                                        href="/login"
                                        className="list-group-item"
                                        onClick={handleLogOut}
                                        title={
                                            languageData?.header_account_menu?.logout_menu?.value || "Logout"
                                        }>
                                        <span className="fad fa-power-off"></span>{" "}
                                        {languageData?.header_account_menu?.logout_menu?.value || "Logout"}
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {!loginUser && (
                    <div className="header_buttons_wrapper">
                        <Button
                            size="sm"
                            href="/login"
                            title={languageData?.header?.header_login?.value || "Log In"}>
                            <span>{languageData?.header?.header_login?.value || "Log In"}</span>
                            <i className="far fa-sign-in"></i>
                        </Button>

                        <Button size="sm" href="/register" title={"Register"}>
                            <span>{"Register"}</span>
                            <i className="far fa-user-plus"></i>
                        </Button>
                    </div>
                )}
            </div>

            {allGamesPages && (
                <div className="casino_sidebar_btn_wrapper hide_desktop_show_tablet">
                    <button type="button" className="casino_sidebar_btn" onClick={providerSidebarButton}>
                        {languageData?.all_casino_page?.all_providers?.value || "All Providers"}{" "}
                        <Image loading="lazy" src={downIcon} alt="Dropdown Icon" />
                    </button>
                </div>
            )}
        </>
    );
};

export default TopHeader;
