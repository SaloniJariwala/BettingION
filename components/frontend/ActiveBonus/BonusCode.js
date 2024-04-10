import Button from "@/components/frontend/UI/Button";
import { LanguageState } from "@/context/FrontLanguageProvider";
import axios from "axios";
import { useState } from "react";
import sha1 from 'sha1';

const BonusCodeSection = ({ refreshData }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bonusCode, setBonusCode] = useState('');
    const { languageData } = LanguageState();


    const bonusCodeInputHandler = (event) => {
        setBonusCode(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        if (bonusCode.trim().length === 0) {
            setErrorMessage( languageData?.active_bonus_page?.bonus_code_required_message?.value || 'Please enter bonus code');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios.post(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/addToPlayer?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&code=${bonusCode}&authKey=${authKey}`)
            .then((response) => {
                console.log(response.data);
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    refreshData();
                    setBonusCode('');
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
        <div className="active_bonus_form">
            <h5>
                {languageData?.active_bonus_page?.bonus_message?.value }
            </h5>

            <form id="active-bonus-code-form" onSubmit={submitHandler}>
                <div className="form_input_wp">
                    <div className="form_bonus_input">
                        <label>
                            <b>{languageData?.active_bonus_page?.label_bonus_code?.value ||"Bonus Code"}</b>
                        </label>
                        <input
                            type="text"
                            className="form_input bonus-code-input"
                            value={bonusCode}
                            onChange={bonusCodeInputHandler}
                        />
                        <p className="error-msg"></p>
                        <p className="success-msg"></p>
                    </div>

                    <Button type="submit" className="sec_btn" size="sm">
                        {languageData?.active_bonus_page?.submit_button?.value || "Submit"}
                    </Button>
                </div>

                {loading ? (
                    <span
                        className="load-more mt_10"
                        style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third fa-spin"></i>
                    </span>
                ) : (
                    <>
                        <p className="error-msg mt_20">{errorMessage}</p>
                        <p className="success-msg mt_20">{successMessage}</p>
                    </>
                )}
            </form>
        </div>
    );
};

export default BonusCodeSection;