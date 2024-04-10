import Image from "next/image";
import React, { useEffect, useState } from "react";
import cookieIcon from "@/frontend/images/cookie_icon.svg";
import Button from "../UI/Button";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";

const CookieModal = () => {
    const { languageData } = LanguageState();
    const [remove, setRemove] = useState(true);
    const [close, setClose] = useState(true);

    const handleCookieAllow = () => {
        localStorage.setItem("isCookie", true);
        setClose(false);
    };

    return (
        remove && (
            <div className={`cookie_modal ${close ? "" : "cookie_modal_close"}`}>
                <div className="cookie_icon">
                    <Image width={40} height={40} src={cookieIcon} alt="Cookie" priority />
                </div>
                <div className="cookie_content">
                    <div dangerouslySetInnerHTML={{ __html: HrefLocalReplace(languageData?.cookies_modal?.cookies_modal_content?.value) }}></div>

                    <div className="button_group">
                        <Button type="button" onClick={handleCookieAllow}>
                            {languageData?.cookies_modal?.cookies_modal_allow_button?.value || "Allow"}
                        </Button>
                        <Button
                            type="button"
                            variant="transparent"
                            onClick={() => {
                                setClose(false);
                                setTimeout(() => {
                                    setRemove(false);
                                }, 1000);
                            }}
                        >
                            {languageData?.cookies_modal?.cookies_modal_decline_button?.value || "Decline"}
                        </Button>
                    </div>
                </div>
            </div>
        )
    );
};

export default CookieModal;
