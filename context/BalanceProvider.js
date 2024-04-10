import { createContext, useContext, useEffect, useState } from "react";
import sha1 from "sha1";
import axios from "axios";
import { useRouter } from "next/router";

const BalanceContext = createContext();

const BalanceProvider = ({ children }) => {
    const router = useRouter();
    const [balance, setBalance] = useState();
    const [points, setPoints] = useState();
    const [currency, setCurrency] = useState("USD");
    const [balanceArr, setBalanceArr] = useState([]);
    const [fetchBalance, setFetchBalance] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userCurrency, setUserCurrency] = useState();
    const [userDefaultCurrency, setUserDefaultCurrency] = useState();
    const [rollover, setRollover] = useState();
    const [bonus, setBonus] = useState();

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("User"));
    //     setUserCurrency(
    //         user?.selectedCurrency?.currencyAbrv
    //     );
    // }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        if (user) {
            const authkey = sha1(
                process.env.NEXT_PUBLIC_AUTH_KEY +
                `action=balance&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}`
            );
            setLoading(true);
            axios
                .get(
                    `${process.env.NEXT_PUBLIC_API_DOMAIN}/casinos-admin/api?action=balance&remote_id=${JSON.parse(localStorage.getItem("User"))?.remoteId}&token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`
                )
                .then((response) => {
                    if (response.data?.status === 200) {
                        setBalance(response.data?.balance);
                        setUserDefaultCurrency(response.data?.currencyObj);
                        setCurrency(response.data?.currency);
                        setPoints(response.data?.pointsBalance[0]?.points);
                        setBalanceArr(response.data?.balanceArr);
                        setRollover(response.data?.rollover);
                        setBonus(response.data?.bonus);
                    } else {
                        setBalance(0);
                        setPoints(0.0);
                        setBalanceArr([]);
                        setUserDefaultCurrency({ currencyAbrv: "USD", currencyName: "United States Dollar" });
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setUserDefaultCurrency({ currencyAbrv: "USD", currencyName: "United States Dollar" });
                })
                .finally(() => {
                    setLoading(false);
                    setUserDefaultCurrency({ currencyAbrv: "USD", currencyName: "United States Dollar" });
                });
        } else {
            setUserDefaultCurrency({ currencyAbrv: "USD", currencyName: "United States Dollar" });
            setLoading(false);
        }
    }, [fetchBalance, currency, router]);

    const updateBalance = () => {
        setFetchBalance((prev) => !prev);
    };

    const handleCurrencyChange = (selectedCurrency) => {
        setCurrency(selectedCurrency);
        setUserCurrency(selectedCurrency);
    };

    return (
        <BalanceContext.Provider
            value={{
                fetchBalance,
                setFetchBalance,
                updateBalance,
                balance,
                userDefaultCurrency,
                points,
                userCurrency,
                setUserCurrency,
                loading,
                handleCurrencyChange,
                balanceArr,
                rollover,
                bonus,
            }}>
            {children}
        </BalanceContext.Provider>
    );
};

export const BalanceState = () => {
    return useContext(BalanceContext);
};

export default BalanceProvider;
