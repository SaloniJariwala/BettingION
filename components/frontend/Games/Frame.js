import React, { useEffect, useState } from "react";
import Game from "./Game";
import GameSearch from "./GameSearch";
import Topbar from "./Topbar";
import { useFullScreenHandle } from "react-full-screen";

const Frame = ({ isMain, gameData }) => {
    const handle = useFullScreenHandle();
    const [isMainFrame, setIsMainFrame] = useState(isMain);
    const [data, setData] = useState();
    const [gameUrl, setGameUrl] = useState("");
    const [gameController, setGameController] = useState();

    useEffect(() => {
        setData(gameData);
    }, []);

    const settingGameData = (selectedGameData) => {
        setData(selectedGameData);
        setIsMainFrame(true);
    };

    const settingGameUrl = (url) => {
        setGameUrl(url);
    };

    useEffect(() => {
        if (gameController) {
            setIsMainFrame(false);
        } else {
            setIsMainFrame(true);
        }
    }, [gameController]);

    return (
        <div className="single_game_iframe_box">
            <div style={{ display: isMainFrame ? "block" : "none" }}>
                {gameUrl && (
                    <Topbar
                        selectedGame={data}
                        handle={handle}
                        setGameController={setGameController}
                        mainframe={true}
                    />
                )}
                <Game
                    selectedGame={data}
                    mainframe={true}
                    isGameUrl={settingGameUrl}
                    handle={handle}
                    setGameController={setGameController}
                />
            </div>
            <div style={{ display: !isMainFrame ? "block" : "none" }}>
                <GameSearch
                    setGameData={settingGameData}
                    setGameController={setGameController}
                    gameUrl={gameUrl}
                    settingGameUrl={settingGameUrl}
                />
            </div>
        </div>
    );
};

export default Frame;
