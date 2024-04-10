import Image from "next/image";
import downIcon from "@/frontend/images/down_icon.svg";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import React, { useState } from "react";
import { getDescriptiveDate } from "@/utils/getDescriptiveData";
import { LanguageState } from "@/context/FrontLanguageProvider";

const ListCampaigns = ({ campaign }) => {
    const { languageData } = LanguageState();
    const [accordion, setAccordion] = useState(false);
    const [isCopy, setIsCopy] = useState(false);

    const accordionToggle = () => {
        setAccordion(!accordion);
    };

    const handleCopy = async () => {
        if ("clipboard" in navigator) {
            setIsCopy(true);
            return await navigator.clipboard.writeText(
                `${process.env.NEXT_PUBLIC_SITE_URL}${process.env.NEXT_PUBLIC_REFER_PAGE_LINK}?user=${campaign?.remoteId}&referral=${campaign?.tag}&type=affiliate`
            );
        } else {
            setIsCopy(false);
            return document.execCommand("copy", true, text);
        }
    };

    return (
        <React.Fragment>
            <div
                className={`affiliate_campaigns_accordion ${
                    accordion ? "affiliate_campaigns_accordion_active" : ""
                }`}
                onMouseLeave={() => {
                    isCopy && setIsCopy(false);
                }}>
                <div className="affiliate_campaigns_accordion_title">
                    <h5 onClick={accordionToggle}>{campaign?.tag}</h5>
                    <div className="ca_details_input">
                        <span onClick={accordionToggle}>{`...referral=${campaign?.tag}&type=affiliate`}</span>
                        <NextTooltip
                            title={
                                isCopy
                                    ? languageData?.affiliate_page?.copied_tooltip?.value
                                    : languageData?.affiliate_page?.copy_tooltip?.value
                            }>
                            <button className="ca_details_input_copy" onClick={handleCopy}>
                                <i className="fas fa-copy"></i>
                            </button>
                        </NextTooltip>
                    </div>
                    <span className="accordion_icon" onClick={accordionToggle}>
                        <Image src={downIcon} alt="Down Arrow" />
                    </span>
                </div>
                <div className="affiliate_campaigns_accordion_content">
                    <div>
                        <hr />
                        <div className="affiliate_campaigns_info_wp">
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_name?.value}: </span>
                                {campaign?.tag}
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_created?.value}: </span>
                                {getDescriptiveDate(campaign?.createdAt, "showTime")}
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_commission_rate?.value}: </span>
                                {campaign?.commission?.casino}%
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_last_deposits?.value}: </span>
                                N/A
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_sign_ups?.value}: </span>0
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_active_users?.value}: </span>0
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>
                                    {languageData?.affiliate_page?.label_first_time_deposits?.value}:{" "}
                                </span>
                                0
                            </div>
                            <div className="affiliate_campaigns_info">
                                <span>{languageData?.affiliate_page?.label_total_deposits?.value}: </span>0
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ListCampaigns;
