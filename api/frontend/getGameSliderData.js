import axios from "axios";

export const getGameSliderData = async (gameType = "all") => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/games/admin/getAllCombineAPI`,
            {
                params: {
                    action: "feature-providers-games",
                    token: process.env.NEXT_PUBLIC_TOKEN,
                    casino: process.env.NEXT_PUBLIC_CASINO,
                    gameType: gameType,
                },
            }
        );

        if (response.status !== 200) {
            throw new Error("Error fetching data from API");
        }

        // Remove duplicates from the games array
        const games = removeDuplicateGames(response.data.games);

        return games;
    } catch (error) {
        console.error(error?.message);
        return [];
    }
};

// Helper function to remove duplicate games based on the game ID
const removeDuplicateGames = (games) => {
    const gameSet = new Set();
    const uniqueGames = [];

    games.forEach((game) => {
        if (!gameSet.has(game.id)) {
            gameSet.add(game.id);
            uniqueGames.push(game);
        }
    });

    return uniqueGames;
};
