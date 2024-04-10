import { useState } from "react";
import { LanguageState } from "@/context/FrontLanguageProvider";

const ProviderDropDown = ({ providerData, handleProviderChange }) => {
    const [dropDown, setDropDown] = useState(false);
    const { languageData } = LanguageState();

    return (
        <div className={dropDown ? "casino-dropdown casino-dropdown-open" : "casino-dropdown "}>
            <div className="casino-dropdown-text" onClick={() => setDropDown(!dropDown)}>
                <span className="casino-dropdown-title">
                    {languageData?.all_games_page?.casino_game_dropdown_title?.value}{" "}
                    <i className="far fa-chevron-down"></i>
                </span>
            </div>
            <div className="casino-dropdown-box">
                <ul>
                    {providerData?.map((item) => (
                        <li key={item.id}>
                            <div className="checkbox-wp custom-img-box">
                                <label>
                                    <input
                                        type="checkbox"
                                        className="provider-checkbox"
                                        name="provider[]"
                                        value={item?.providerId}
                                        onChange={(event) => handleProviderChange(event)}
                                    />
                                    <span>
                                        {item?.name} <i>{item?.gamesCount}</i>
                                    </span>
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProviderDropDown;
