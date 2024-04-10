import axios from "axios";

export const getFeaturedProviders = async () => {
    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/games/admin/getAllCombineAPI`,
            {
                params: {
                    action: "feature-providers-games",
                    token: process.env.NEXT_PUBLIC_TOKEN,
                    casino: process.env.NEXT_PUBLIC_CASINO,
                    gameType: "all",
                },
            }
        );

        if (response.status !== 200) {
            throw new Error("Error fetching data from API");
        }

        // directly return the providers array from the response data
        return response.data.providers;
    } catch (error) {
        console.error(error?.message);
        return [];
    }
};
