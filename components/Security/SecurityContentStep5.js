import Image from "next/image";
import successfullyIcon from "../../assets/frontend/images/successfully_icon.svg";

const SecurityContentStep5 = ({ languageData }) => {
    return (
        <div className="security_content_step5">
            <Image loading="lazy" width={60} height={60} src={successfullyIcon} alt="successfully" />
            <p className="security_authenticator_title text_center">{languageData?.security_page?.security_step_5_title?.value}</p>
            <p>{languageData?.security_page?.security_step_5_content?.value}</p>
        </div>
    );
};

export default SecurityContentStep5;
