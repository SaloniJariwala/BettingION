import Image from "next/image";
import React from "react";
import searchIcon from "@/frontend/images/search.svg";
import fullscreenIcon from "@/frontend/images/fullscreen_icon.svg";
import closeIcon from "@/frontend/images/close_icon.svg";

const Topbar = ({ selectedGame, id, handle, setGameController, mainframe, getGameData }) => {
    const renderCloseIcon = () => {
        if (!mainframe) {
            if (selectedGame) {
                return (
                    <button
                        className="round_btn"
                        type="button"
                        onClick={() => {
                            if (confirm("Are you sure you want to close?")) {
                                if (getGameData) {
                                    getGameData(null, id);
                                }
                            } else {
                                return;
                            }
                        }}>
                        <Image src={closeIcon} alt="BettingIon Close" width={12} height={12} />
                    </button>
                );
            }
        }
    };

    return (
        <div className="single_game_top_bar">
            <h5>
                {selectedGame?.providerName} - {selectedGame?.name}
            </h5>
            <button className="round_btn" type="button" onClick={handle.enter}>
                <Image src={fullscreenIcon} alt="BettingIon Fullscreen" />
            </button>
            <button
                className="round_btn"
                onClick={() => {
                    setGameController(true);
                }}>
                <Image src={searchIcon} alt="" width={16} height={16} />
            </button>

            {renderCloseIcon()}
        </div>
    );
};

export default Topbar;
