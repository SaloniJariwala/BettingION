import downIcon from "@/frontend/images/down_icon.svg";
import Image from "next/image";
import allProviderIcon from "@/frontend/images/provider_sidebar/all_provider_icon.svg";
import searchIcon from "@/frontend/images/search.svg";
import SimpleBar from "simplebar-react";
import { useEffect, useState } from "react";
import { GamesProviderState } from "@/context/GamesProvider";
import closeIcon from "@/frontend/images/close_icon.svg";
import { useRouter } from "next/router";
import defaultGameTypeIcon from "./common/genres/ClassicSlots.png";
import { LanguageState } from "@/context/FrontLanguageProvider";

const tryRequire = (path) => {
    try {
        return require(`${path}`);
    } catch (err) {
        return false;
    }
};

const ProviderDropdown = ({ title, children, className }) => {
    const [dropDown, setDropDown] = useState(true);

    return (
        <div
            className={`sidebar_dropdown ${dropDown ? "" : "collapse_sidebar_dropdown"} ${
                className ? className : ""
            }`}>
            <div className="sidebar_dropdown_title" onClick={() => setDropDown((prev) => !prev)}>
                <span>{title}</span>
                <Image src={downIcon} alt="BettingIon Arrow" />
            </div>
            {dropDown && children}
        </div>
    );
};

const ProviderSidebar = ({
    allProviders,
    allGameTypes = false,
    onPageLoad = false,
    showCategories = true,
}) => {
    const {
        providerId,
        setProviderId,
        setProviderTitle,
        allGamesCount,
        errorMessage,
        setPagePerProvider,
        gameType,
        setGameType,
        setIsGameTypeClick,
    } = GamesProviderState();

    const router = useRouter();
    const { languageData } = LanguageState();

    const [finalProviderData, setFinalProviderData] = useState(allProviders);
    const [finalCategoryData, setFinalCategoryData] = useState(allGameTypes);
    const [providerData, setProviderData] = useState(allProviders);
    const [categoryData, setCategoryData] = useState(allGameTypes);

    useEffect(() => {
        setFinalProviderData(allProviders);
        setProviderData(allProviders);
    }, [allProviders]);

    useEffect(() => {
        if (allGameTypes !== false) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            allGameTypes = [
                {
                    name: languageData?.provider_sidebar?.provider_all_categories_label?.value,
                    gamesCount: allGamesCount,
                },
                ...allGameTypes,
            ];
        }

        setFinalCategoryData(allGameTypes);
        setCategoryData(allGameTypes);
    }, [allGameTypes]);

    const handleSearch = (value, filterFor) => {
        if (filterFor === "categories") {
            if (value === "") {
                setFinalCategoryData(categoryData);
            } else {
                let filteredData = categoryData?.filter((item) =>
                    item.name?.toLowerCase().includes(value.toLowerCase())
                );
                setFinalCategoryData(filteredData);
            }
        } else if (filterFor === "providers") {
            if (value === "") {
                setFinalProviderData(providerData);
            } else {
                let filteredData = providerData?.filter((item) =>
                    item.name?.toLowerCase().includes(value.toLowerCase())
                );
                setFinalProviderData(filteredData);
            }
        }
    };

    const closeSidebar = () => {
        if (document.body.classList?.value?.includes("provider_sidebar_open")) {
            document.body.classList.remove(`provider_sidebar_open`);
        }
    };

    const handelGameTypeClick = (gameType) => {
        setGameType(
            gameType === languageData?.provider_sidebar?.provider_all_categories_label?.value ? "" : gameType
        );
        setIsGameTypeClick(true);
        closeSidebar();
    };

    const handleProviderClick = (id, name) => {
        setGameType("");
        setIsGameTypeClick(false);
        setProviderId(id);
        setProviderTitle(name);
        setPagePerProvider(1);
        closeSidebar();
    };

    return (
        <div className="provider_sidebar">
            <div className="sidebar_top_info hide_desktop_show_tablet">
                <h4 className="h4_title">
                    {languageData?.provider_sidebar?.all_providers_label?.value || "All Providers"}
                </h4>
                <button className="round_btn" type="button" onClick={closeSidebar}>
                    <Image src={closeIcon} alt="BettingIon Close" width={12} height={12} />
                </button>
            </div>
            {showCategories && (
                <ProviderDropdown title={languageData?.provider_sidebar?.provider_categories?.value}>
                    <SimpleBar>
                        <form className="search_form">
                            <input
                                type="search"
                                name="search"
                                className="form_input"
                                placeholder={
                                    languageData?.provider_sidebar?.provider_categories_placeholder?.value ||
                                    "Search by Category"
                                }
                                onChange={(event) => handleSearch(event.target.value, "categories")}
                            />
                            <button type="submit" className="search_btn">
                                <Image
                                    loading="lazy"
                                    src={searchIcon}
                                    alt="BettingIon Search"
                                    width={16}
                                    height={16}
                                />
                            </button>
                        </form>

                        {onPageLoad ? (
                            <span className="search_form_loading">
                                {languageData?.provider_sidebar?.provider_sidebar_loading?.value}
                            </span>
                        ) : (
                            <ul>
                                {allGameTypes !== false &&
                                    finalCategoryData?.map((data, index) => {
                                        const path = `./common/genres/${data?.name}.png`;

                                        return (
                                            <li key={index}>
                                                <button
                                                    title={data.name}
                                                    className={
                                                        gameType === ""
                                                            ? data.name ===
                                                              languageData?.provider_sidebar
                                                                  ?.provider_all_categories_label?.value
                                                                ? "active_provider_menu"
                                                                : ""
                                                            : gameType === data.name
                                                            ? "active_provider_menu"
                                                            : ""
                                                    }
                                                    onClick={() => handelGameTypeClick(data.name)}>
                                                    <Image
                                                        loading="lazy"
                                                        src={
                                                            tryRequire(path)
                                                                ? tryRequire(path)?.default
                                                                : defaultGameTypeIcon
                                                        }
                                                        alt={data.name}
                                                        width={22}
                                                        height={22}
                                                    />
                                                    <b>{data.name}</b>
                                                    <span>{data.gamesCount}</span>
                                                </button>
                                            </li>
                                        );
                                    })}
                            </ul>
                        )}
                    </SimpleBar>
                </ProviderDropdown>
            )}

            <ProviderDropdown
                title={languageData?.provider_sidebar?.providers?.value}
                className="sidebar_provider_dropdown">
                <SimpleBar>
                    <form className="search_form">
                        <input
                            type="search"
                            name="search"
                            className="form_input"
                            placeholder={
                                languageData?.provider_sidebar?.provider_placeholder?.value ||
                                "Search by Providers"
                            }
                            onChange={(event) => handleSearch(event.target.value, "providers")}
                        />
                        <button type="submit" className="search_btn">
                            <Image
                                loading="lazy"
                                src={searchIcon}
                                alt="BettingIon Search"
                                width={16}
                                height={16}
                            />
                        </button>
                    </form>

                    {!errorMessage ? (
                        onPageLoad ? (
                            <span className="search_form_loading">
                                {languageData?.provider_sidebar?.provider_sidebar_loading?.value}
                            </span>
                        ) : (
                            <ul>
                                <li>
                                    <button
                                        onClick={() => {
                                            setGameType("");
                                            setProviderId("");
                                            setProviderTitle(
                                                languageData?.provider_sidebar?.all_providers_label?.value ||
                                                    "All Provider"
                                            );
                                            setPagePerProvider(1);
                                            closeSidebar();
                                        }}
                                        type="button"
                                        className={providerId === "" ? "active_provider_menu" : ""}>
                                        <Image
                                            loading="lazy"
                                            src={allProviderIcon}
                                            alt={languageData?.provider_sidebar?.all_providers_label?.value}
                                        />
                                        <b>{languageData?.provider_sidebar?.all_providers_label?.value}</b>
                                        {!providerId && <span>{allGamesCount}</span>}
                                    </button>
                                </li>
                                {finalProviderData?.map((data, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleProviderClick(data.providerId, data.name)}>
                                        <button
                                            type="button"
                                            title="Free spins"
                                            className={
                                                providerId === data.providerId ? "active_provider_menu" : ""
                                            }>
                                            <b>{data?.name}</b>
                                            <span>{data?.gamesCount}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )
                    ) : (
                        <p
                            className="error-msg"
                            style={{
                                display: errorMessage ? "block" : "none",
                            }}>
                            {errorMessage}
                        </p>
                    )}
                </SimpleBar>
            </ProviderDropdown>
        </div>
    );
};

export default ProviderSidebar;
