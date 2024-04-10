import Image from "next/image";
import facebookIcon from "@/frontend/images/facebook_icon.svg";
import telegramIcon from "@/frontend/images/telegram_icon.svg";
import whatsappIcon from "@/frontend/images/whatsapp_icon.svg";
import { FacebookShareButton, TelegramShareButton, WhatsappShareButton } from "next-share";
import { useEffect, useState } from "react";

const GameShare = () => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(window.location.href);
    }, []);

    return (
        <div className="single_game_controller single_game_share">
            <ul>
                <li>
                    <div>
                        <FacebookShareButton url={url}>
                            <Image loading="lazy" quality={90} src={facebookIcon} alt="Share On Facebook" />
                        </FacebookShareButton>
                    </div>
                </li>
                <li>
                    <div>
                        <TelegramShareButton url={url}>
                            <Image loading="lazy" quality={90} src={telegramIcon} alt="Share On Telegram" />
                        </TelegramShareButton>
                    </div>
                </li>
                <li>
                    <div>
                        <WhatsappShareButton url={url}>
                            <Image loading="lazy" quality={90} src={whatsappIcon} alt="Share On Whatsapp" />
                        </WhatsappShareButton>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default GameShare;
