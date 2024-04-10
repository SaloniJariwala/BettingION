const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const getDescriptiveDate = (date, showTime = "") => {
    const rawDate = date.split("T")[0];
    const newDate = new Date(rawDate);
    var res = `${months[newDate.getMonth()]} ${newDate.getDate()}, ${newDate.getFullYear()}`;
    if (showTime === "showTime") {
        const staticDate = date;
        const index = staticDate.indexOf(".");
        const dynamicDate = staticDate.substring(0, index);
        const hours =
            new Date(dynamicDate).getHours() > 12
                ? `${new Date(dynamicDate).getHours() - 12}`
                : `${new Date(dynamicDate).getHours()}`;
        res =
            res +
            ` ${hours}:${new Date(dynamicDate).getMinutes()?.toString()?.padStart(2, '0')} ${new Date(dynamicDate).getHours() > 12 ? "PM" : "AM"
            }`;
    }
    return res;
};
