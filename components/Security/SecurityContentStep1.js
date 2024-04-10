import Image from "next/image";
import Link from "next/link";
import appleButton from "../../assets/frontend/images/apple_button.svg";
import googleButton from "../../assets/frontend/images/google_button.svg";
import googleQr from "../../assets/frontend/images/google_qr.png";
import appleQr from "../../assets/frontend/images/apple_qr.png";
import { useState } from "react";

const SecurityContentStep1 = ({ languageData }) => {
    const [selectedQr, setSelectedQr] = useState("google");
    const apple = (event) => {
        setSelectedQr("apple");
        event.preventDefault();
    };

    const google = (event) => {
        setSelectedQr("google");
        event.preventDefault();
    };

    return (
        <div className="security_content_step1">
            <p className="security_authenticator_title text_center">{languageData?.security_page?.security_step_1_title?.value || "Download and install the Authenticator app"}</p>

            <div className="button_group">
                <Link
                    href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                    rel="noreferrer"
                    target="_blank"
                    className={`${selectedQr === "apple" ? "" : "transparent_btn"} sec_btn`}
                    title="Download on the App Store"
                    onClick={apple}
                >
                    <Image loading="lazy" src={appleButton} alt="Download on the App Store" />
                </Link>

                <Link
                    href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                    rel="noreferrer"
                    target="_blank"
                    className={`${selectedQr === "google" ? "" : "transparent_btn"} sec_btn`}
                    title="Download on the Google Play"
                    onClick={google}
                >
                    <Image loading="lazy" src={googleButton} alt="Download on the Google Play" />
                </Link>
            </div>

            {selectedQr === "google" && <Image loading="lazy" src={googleQr} alt="Google Authenticator Qr" className="qr_image" />}
            {selectedQr === "apple" && <Image loading="lazy" src={appleQr} alt="Apple Authenticator Qr" className="qr_image" />}
        </div>
    );
};

export default SecurityContentStep1;
