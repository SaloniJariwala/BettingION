const countryLocales = {
    PEN: "es-PE",
    USD: "en-US",
};

export const renderAmountWithCurrency = (amount, currency) => {
    let amt, currencyObj;
    if (!amount || amount === 0) {
        amt = 0;
    } else {
        amt = amount?.toString().split(",").join("");
    }

    // if (typeof window !== "undefined" &&
    //     typeof localStorage !== "undefined" &&
    //     window.localStorage.getItem("currency")
    // ) {
    //     currencyObj = JSON.parse(localStorage.getItem("currency"));
    // } else {
    //     currencyObj = currency;
    // }

    const minimumFractionDigits = getMinimumFractionDigits(currency);

    let res;

    if (currency !== "undefined") {
        if (isCryptocurrency(currency)) {
            // For cryptocurrencies, simply append the currency code
            res = `${Number(amt).toFixed(minimumFractionDigits)} ${currency}`;
        } else {
            // For standard currencies, use the toLocaleString method
            const useCurrency = currency || 'USD';
            const locale = countryLocales?.[useCurrency]
                ? countryLocales?.[useCurrency]
                : countryLocales?.USD;

            res = Number(amt).toLocaleString(locale, {
                style: "currency",
                currency: useCurrency || "USD",
                minimumFractionDigits: minimumFractionDigits,
            });
        }
    }

    return res;
};

const getMinimumFractionDigits = (currency) => {
    // Add the list of cryptocurrencies you support here
    const cryptocurrencies = getSupportedCryptocurrencies();
    if (cryptocurrencies.includes(currency)) {
        return 8;
    }
    return 2;
};

const isCryptocurrency = (currency) => {
    // Add the list of cryptocurrencies you support here
    const cryptocurrencies = getSupportedCryptocurrencies();
    return cryptocurrencies.includes(currency);
};

const getSupportedCryptocurrencies = () => {
    let cryptocurrencies = [
        "BTC",
        "ETH",
        "LTC",
        "DOGE",
        "USDT",
        "BCH",
        "TRX",
        "USDP",
        "USDC",
        "TUSD",
        "SHIB",
        "PEPE",
        "NEXO",
        "MKR",
        "LINK",
        "FAMILY",
        "EURT",
        "EUROC",
        "BUSD",
        "BNB",
        "1INCH",
        "YES",
        "XRP",
        "USDt",
        "USDC",
        "SHIB",
        "PHPT",
        "MATIC",
        "LUTO",
        "ELT",
        "DOA",
        "DAI",
        "CAKE",
        "ADA",
        "1INCH",
        "WBTC",
        "USDC",
        "USDT",
        "TUSD",
        "INRT",
        "HT",
        "AEDT",
        "WETH",
        "WBTC",
        "MATIC",
        "MANA",
        "AVAX",
        "USDT-TRC20",
    ];

    // Remove duplicates, capitalize all and sort
    cryptocurrencies = Array.from(new Set(cryptocurrencies))
        .map((crypto) => crypto.toUpperCase())
        .sort();

    return cryptocurrencies;
};
