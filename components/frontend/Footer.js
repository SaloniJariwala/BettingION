import Image from "next/image";
import binanceIcon from "@/frontend/images/binance_icon.svg";
import chainlinkIcon from "@/frontend/images/chainlink_icon.svg";
import usdcIcon from "@/frontend/images/usdc_icon.svg";
import ethIcon from "@/frontend/images/eth_icon.svg";
import pixIcon from "@/frontend/images/pix_icon.svg";
import bitcoinIcon from "@/frontend/images/bitcoin_icon.svg";
import daiIcon from "@/frontend/images/dai_icon.svg";
import dogeCoinIcon from "@/frontend/images/dogecoin_icon.svg";
import { useState } from "react";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { HrefLocalReplace } from "@/utils/hrefLocalReplace";

const Footer = () => {
    const [toggleHeight, setToggleHeight] = useState();
    const { languageData } = LanguageState();

    const currency = [
        {
            icon: binanceIcon,
        },
        {
            icon: chainlinkIcon,
        },
        {
            icon: usdcIcon,
        },
        {
            icon: ethIcon,
        },
        {
            icon: pixIcon,
        },
        {
            icon: bitcoinIcon,
        },
        {
            icon: daiIcon,
        },
        {
            icon: dogeCoinIcon,
        },
    ];

    return (
        <footer className="site_footer">
            <section className="currency_accept_sec">
                <h2 className="h4_title text_center">{languageData?.footer?.footer_currency_accept?.value || "We Accept"}</h2>

                <div className="currency_accept_list">
                    {currency?.map((data, index) => (
                        <div className="currency_accept" key={index}>
                            <Image loading="lazy" width={48} height={48} src={data.icon} alt="currency accept" />
                        </div>
                    ))}
                </div>
            </section>

            <section className="footer_content_sec">
                <h2 className="h4_title text_center">{languageData?.footer?.footer_title?.value || "Experience the premier cryptocurrency casino thrill at BettingIon"}</h2>

                <div className={`footer_text ${toggleHeight ? "footer_content_extend" : ""}`}>
                    <div className="footer_left_text">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_left_content_first?.value),
                            }}
                        ></p>

                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_left_content_second?.value),
                            }}
                        ></p>

                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_left_content_third?.value),
                            }}
                        ></p>
                    </div>

                    <div className="footer_right_text">
                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_right_content_first?.value),
                            }}
                        ></p>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_right_content_second?.value),
                            }}
                        ></p>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: HrefLocalReplace(languageData?.footer?.footer_right_content_third?.value),
                            }}
                        ></p>
                    </div>
                </div>

                {!toggleHeight && (
                    <div className="footer_text_button text_center">
                        <button className="button_link" onClick={() => setToggleHeight((prev) => !prev)}>
                            {languageData?.footer?.read_more?.value || "Read More"}
                        </button>
                    </div>
                )}
            </section>
        </footer>
    );
};

export default Footer;
