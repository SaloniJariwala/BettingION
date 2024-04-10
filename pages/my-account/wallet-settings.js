import AccountWalletSideBar from "@/components/frontend/account/AccountWalletSideBar";
import Button from "@/components/frontend/UI/Button";
import axios from "axios";
import { useEffect, useState } from "react";
import sha1 from "sha1";
import { LanguageState } from "@/context/FrontLanguageProvider";
import CurrencyDropDown from "@/components/frontend/common/CurrencyDropDown";

const WalletSettings = () => {
    const { languageData } = LanguageState();
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedOptions, setSelectOptions] = useState(null);
    const [walletInfo, setWalletInfo] = useState();

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/get-user-withdraw-settings?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setWalletInfo(response.data?.data?.walletInfo);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    useEffect(() => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&hide=false&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setAddress(response.data?.data?.walletAddress);
                    const userData = JSON.parse(localStorage.getItem("User"));
                    const cur = userData?.paymentCurrencies?.find((item) => item.currencyAbrv === response.data?.data?.withdrawCoin);
                    setSelectOptions({
                        label: cur?.currencyName,
                        value: cur?.currencyAbrv,
                    });
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        if (!selectedOptions) {
            setErrorMessage("please choose your withdrawal method");
            return;
        } else {
            setErrorMessage("");
        }
        const payload = {
            remoteId: JSON.parse(localStorage.getItem("User"))?.remoteId,
            withdrawCoin: selectedOptions?.value,
            walletAddress: address,
        };
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&withdrawCoin=${selectedOptions?.value}&walletAddress=${address}`);
        setLoading(true);
        await axios
            .post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-withdraw-settings?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`, payload)
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AccountWalletSideBar>
            <h2
                dangerouslySetInnerHTML={{
                    __html: languageData?.wallet_setting_page?.wallet_setting_page_title?.value,
                }}
            ></h2>

            <hr />

            <form method="post" onSubmit={handleSubmit}>
                <div className="form_input_wp">
                    <label
                        dangerouslySetInnerHTML={{
                            __html: languageData?.wallet_setting_page?.wallet_setting_page_method_input_title?.value,
                        }}
                    ></label>

                    <CurrencyDropDown id="Select Currency" selectedOption={selectedOptions} setSelectedOption={setSelectOptions} walletInfo={walletInfo} setAddress={setAddress} />
                </div>

                <div className="form_input_wp">
                    <label
                        dangerouslySetInnerHTML={{
                            __html: languageData?.wallet_setting_page?.wallet_setting_page_address_input_title?.value,
                        }}
                    ></label>

                    <input
                        type="text"
                        className="form_input"
                        name="woo_wallet_withdrawal_cryptocurrency_email"
                        id="woo_wallet_withdrawal_cryptocurrency_email"
                        placeholder={languageData?.wallet_setting_page?.wallet_setting_page_address_input_title?.value}
                        onChange={(event) => setAddress(event.target.value)}
                        value={address}
                    />
                </div>
                <p
                    className="error-msg"
                    style={{
                        display: errorMessage ? "block" : "none",
                    }}
                >
                    {errorMessage}
                </p>
                <p
                    className="success-msg mb_10"
                    style={{
                        display: successMessage ? "block" : "none",
                    }}
                >
                    {successMessage}
                </p>
                <div className="woo_add_btn">
                    <Button type="submit">{languageData?.wallet_setting_page?.wallet_setting_page_form_button?.value}</Button>
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third fa-spin"></i>
                    </span>
                </div>
            </form>
        </AccountWalletSideBar>
    );
};

export async function getServerSideProps() {
    return {
        props: {},
    };
}

export default WalletSettings;
