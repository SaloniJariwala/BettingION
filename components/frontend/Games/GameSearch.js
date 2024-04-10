import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import slugify from "slugify";
import Image from "next/image";
import SimpleBar from "simplebar-react";
import searchIcon from "@/frontend/images/search.svg";
import closeIcon from "@/frontend/images/close_icon.svg";
import Loader from "@/components/admin/UI/Loader";
import { LanguageState } from "@/context/FrontLanguageProvider";

const GameSearch = ({ setGameController, showClose, getGameData, id, isHeader, overlay }) => {
    var searchTimeout;
    const router = useRouter();
    const { languageData } = LanguageState();
    const [searchedGames, setSearchedGames] = useState([]);
    const [searchOverLay, setSearchOverLay] = useState(false);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [searchInput, setSearchInput] = useState("");

    const handleSearch = async (value) => {
        if (value) {
            setValue(value);
            setLoading(true);
            setSearchedGames([]);
            setError("");

            try {
                let url = `${
                    process.env.NEXT_PUBLIC_API_DOMAIN
                }/games/admin/getAllCombineAPI?action=available_games&token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&page=1&limit=100&&gameSearch=${value}&isGlobal=true&provider=${
                    /*providerId ? providerId : */ ""
                }&gameType=`;
                if (localStorage.getItem("User")) {
                    url += `&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`;
                }
                const response = await axios.get(url);
                if (response.status === 200) {
                    if (response.data?.status === 200) {
                        setSearchedGames(response.data?.data?.currentGame);
                        setSearchOverLay(true);
                    } else {
                        setError(response.data?.message);
                        setSearchedGames([]);
                    }
                } else {
                    setError(response.status);
                    setSearchedGames([]);
                }
            } catch (error) {
                setError(error.message);
                setSearchedGames([]);
            }
            setLoading(false);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    return (
        <>
            {overlay === true && (
                <div
                    className="search_overlay"
                    style={{ display: !searchOverLay ? "none" : "block" }}
                    onClick={() => setSearchOverLay(false)}></div>
            )}
            <div className="single_game_iframe_box single_game_search_box">
                <form className="search_form" onSubmit={handleSubmit}>
                    <div className="search_form_input_wp ">
                        <div className="search_form_input">
                            <input
                                type="text"
                                name="search"
                                className="form_input"
                                placeholder={`${languageData?.header?.search_placeholder?.value || ""}`}
                                autoComplete="off"
                                value={searchInput}
                                onChange={(event) => {
                                    setSearchInput(event.target.value);
                                    clearTimeout(searchTimeout);
                                    searchTimeout = setTimeout(() => {
                                        handleSearch(event.target.value);
                                        setSearchedGames([]);
                                    }, 750);
                                }}
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    className="close_btn"
                                    onClick={() => {
                                        setSearchInput("");
                                        setSearchedGames([]);
                                    }}>
                                    <Image loading="lazy" quality={50} src={closeIcon} alt="Close" />
                                </button>
                            )}
                            <button type="submit" className="search_btn">
                                <Image loading="lazy" quality={50} src={searchIcon} alt="Search" />
                            </button>
                            {loading && <Loader />}
                        </div>

                        {showClose && (
                            <button
                                className="round_btn"
                                type="button"
                                onClick={() => setGameController(false)}>
                                <Image
                                    loading="lazy"
                                    quality={50}
                                    src={closeIcon}
                                    alt="BettingIon Close"
                                    width={12}
                                    height={12}
                                />
                            </button>
                        )}
                    </div>
                </form>
                {!loading && searchedGames?.length > 0 && (
                    <div
                        className="search_game_list"
                        style={{ display: !searchOverLay ? "none" : "block" }}
                        onClick={() => setSearchOverLay(false)}>
                        <SimpleBar>
                            <ul>
                                {searchedGames?.map((data, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            setSearchOverLay(true);
                                            if (getGameData) {
                                                getGameData(data, id);
                                            }
                                            console.log("data: ", id, isHeader, data);
                                            if (isHeader) {
                                                router.push({
                                                    pathname: `/games/${slugify(
                                                        data?.providerName || data?.providerId
                                                    )}/${slugify(data?.name)}`,
                                                    query: { id: `${data?.providerId}-${data?.id}` },
                                                });
                                            }
                                        }}>
                                        <div className="search_game_box">
                                            <div className="search_game_box_img">
                                                <Image
                                                    loading="lazy"
                                                    quality={50}
                                                    src={data.gameIcon}
                                                    alt={`${data.name} Game`}
                                                    fill
                                                />
                                            </div>
                                            <div className="search_game_box_title">
                                                <h5>{data.name}</h5>
                                                <h6>{data.providerName}</h6>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </SimpleBar>
                    </div>
                )}
                {!loading && searchedGames?.length === 0 && !value && (
                    <div className="error_message">{error ? error : ""}</div>
                )}
            </div>
        </>
    );
};

export default GameSearch;
