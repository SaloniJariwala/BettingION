export const getDateAndTime = (dateStr) => {
    if (dateStr) {
        const date = dateStr?.split("T")[0]?.split("-")?.reverse()?.join("-");
        const time = dateStr?.split("T")[1]?.slice(0, -1)?.split(".")[0];
        return `${date} ${time}`;
    } else {
        return "";
    }
};
