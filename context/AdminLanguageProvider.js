import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
const AdminLanguageContext = createContext();

const AdminLanguageProvider = ({ children }) => {
    const { locale } = useRouter();
    const [adminLanguageData, setAdminLanguageData] = useState();
    const [changeInLanguage, setChangeInLanguage] = useState(false);

    useEffect(() => {
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/admin-translation?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&languageCode=${locale || "en"}&pageKey=`
            )
            .then(async (response) => {
                setAdminLanguageData(response.data?.data?.text);
            })
            .catch((error) => {});
    }, [locale, changeInLanguage]);

    const updateLanguage = () => {
        setChangeInLanguage((prev) => !prev);
    };

    return (
        <AdminLanguageContext.Provider value={{ adminLanguageData, updateLanguage }}>
            {children}
        </AdminLanguageContext.Provider>
    );
};

export const AdminLanguageState = () => {
    return useContext(AdminLanguageContext);
};

export default AdminLanguageProvider;
