import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
const LanguageContext = createContext();

const FrontLanguageProvider = ({ children }) => {
    const { locale } = useRouter();
    const [languageData, setLanguageData] = useState();
    const [changeInLanguage, setChangeInLanguage] = useState(false);

    useEffect(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/translation?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&languageCode=${locale || "en"}&pageKey=`
            )
            .then(async (response) => {
                setLanguageData(response.data?.data?.text);
            })
            .catch((error) => { });
    }, [locale, changeInLanguage]);

    const updateLanguage = () => {
        setChangeInLanguage((prev) => !prev);
    };

    return (
        <LanguageContext.Provider value={{ languageData, updateLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const LanguageState = () => {
    return useContext(LanguageContext);
};

export default FrontLanguageProvider;
