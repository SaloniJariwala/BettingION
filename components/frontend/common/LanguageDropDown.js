import Image from "next/image";
import Link from "next/link";
import En from "@/frontend/images/en_US.png";
import Es from "@/frontend/images/es_ES.png";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import downIcon from "@/frontend/images/down_icon.svg";

const LanguageDropDown = ({ closeLanguage, setCloseLanguage }) => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState("En");
    const [selectedImage, setSelectedImage] = useState(En);
    const [dropdown, setDropdown] = useState();

    const languageData = [
        {
            id: 1,
            icon: En,
            language: "EN",
            locale: "en",
        },
        {
            id: 2,
            icon: Es,
            language: "ES",
            locale: "es",
        },
    ];

    useEffect(() => {
        languageData?.forEach((item) => {
            if (item?.locale === router?.locale) {
                setSelectedImage(item.icon);
                setSelectedLanguage(item.language);
            }
        });
    }, [router?.locale]);

    useEffect(() => {
        if (closeLanguage) {
            setDropdown(false);
        }
    }, [closeLanguage]);

    return (
        <>
            <div className={`dropdown ${dropdown ? "active_dropdown" : ""}`}>
                <button
                    className="dropdown_button"
                    type="button"
                    onClick={() => {
                        setDropdown((prev) => !prev);
                        if (closeLanguage) {
                            setCloseLanguage(false);
                        }
                    }}>
                    <span>{selectedLanguage}</span> <Image src={downIcon} alt="BettingIon" />
                </button>

                {dropdown && (
                    <div className="dropdown_items">
                        <ul>
                            {router?.locales?.map((l, i) => {
                                const value = languageData[i];
                                return (
                                    <li
                                        key={i}
                                        className={
                                            selectedLanguage === value?.language ? "active_option" : ""
                                        }>
                                        <Link href={router.asPath} locale={l} title={value?.language}>
                                            <Image src={value?.icon} alt={value?.language} />
                                            {value?.language}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};

export default LanguageDropDown;
