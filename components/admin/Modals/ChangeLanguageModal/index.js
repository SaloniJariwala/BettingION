import { useRouter } from "next/router";
import AdminModal from "../../AdminModal";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import En from "@/frontend/images/en_US.png";
import Es from "@/frontend/images/es_ES.png";

const ChangeLanguageModal = ({ show, setShow }) => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState();
    const [selectedImage, setSelectedImage] = useState(En);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        languageData?.forEach((item) => {
            if (item?.locale === router?.locale) {
                setSelectedImage(item.icon);
                setSelectedLanguage(item.language);
            }
        });
    }, [router?.locale]);

    const languageData = [
        {
            id: 1,
            icon: En,
            language: "English",
            locale: "en",
        },
        {
            id: 2,
            icon: Es,
            language: "Spanish",
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

    const handleClose = () => {
        setShow(false);
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
            <h3 className="h3-title modal_title"> Change language</h3>

            <div className="lang-switcher">
                <div className="trp_language_switcher_shortcode">
                    <div className={!showDropdown ? `trp-language-switcher trp-language-switcher-container` : "trp-language-switcher trp-language-switcher-container language-switcher-active"}>
                        <div className="trp-ls-shortcode-current-language">
                            <Link href="" className="trp-ls-shortcode-disabled-language" title="English" onClick={() => setShowDropdown((prev) => !prev)}>
                                <Image src={selectedImage} alt={selectedLanguage} /> {selectedLanguage}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="trp-ls-shortcode-language">
                    <ul>
                        {showDropdown &&
                            languageData?.map((item, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSelectedLanguage(item?.language);
                                        setSelectedImage(item?.icon);
                                        handleClose();
                                    }}
                                >
                                    <Link href={router.asPath} locale={item?.locale} title={item?.language}>
                                        <Image src={item?.icon} alt={item?.language} /> {item.language}
                                    </Link>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </AdminModal>
    );
};

export default ChangeLanguageModal;
