import { FullScreen } from "react-full-screen";

const Game = ({ handle, url }) => {
    return (
        <>
            <FullScreen handle={handle}>
                <iframe src={url} className="single_game_iframe"></iframe>
            </FullScreen>
        </>
    );
};

export default Game;
