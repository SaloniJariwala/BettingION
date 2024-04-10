import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import { Col, Row } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const accountTypes = ["administrator", "super-agent", "agent"];

const AffiliateCommission = () => {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [commission, setCommission] = useState({ default: null, updated: null });
    const { adminLanguageData } = AdminLanguageState();


    useEffect(() => {
        setLoading(true);

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/referral-player/commission-report?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`)
            .then((response) => {
                setCommission({ default: parseFloat(response.data?.data?.defaultAffiliateCommission), updated: parseFloat(response.data?.data?.defaultAffiliateCommission) });
            })
            .catch((e) => setErrorMessage(e.message))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const updateCommission = async (e) => {
        e.preventDefault();

        setLoading(true);

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        await axios.put(
            `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/default-referral-commission?casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&commission=${commission.updated}&authKey=${authkey}`
        ).then((response) => {
            if (response.data?.status === 200) {
                setSuccessMessage(response.data?.message);
                setCommission((p) => ({ ...p, default: p.updated }))
            } else {
                setErrorMessage(response.data?.response);
            }
        }).catch((e) => {
            setErrorMessage(e.message);
        }).finally(() => {
            setLoading(false);
        });

    };

    return (
        <form className="site_setting_form mt_40" onSubmit={updateCommission}>
            <Row>
                <h3>{adminLanguageData?.settings_page?.user_affiliate_settings?.value||"User Affiliate Settings"}</h3>
                <Col lg={4}>
                    <div className="form_input_wp">
                        {/* <label htmlFor="referral_user">
                        {adminLanguageData?.settings_page?.default_affiliate_commission_label?.value}
                        </label> */}
                        <i className="fal fa-percent"></i>
                        <input
                            name="affiliate-commission"
                            type="number"
                            value={commission.updated}
                            className="form_input"
                            placeholder="Affiliate Commission"
                            autoComplete="off"
                            onChange={(e) => setCommission((p) => ({ ...p, updated: e.target.value }))}
                        />
                    </div>
                    {/* </div> */}
                    {!loading && (errorMessage || successMessage) && (
                        <p className={`${errorMessage ? 'error' : 'success'}-msg mt_20 m-0`} style={{ display: "block" }}>{errorMessage || successMessage}</p>
                    )}
                </Col>
                <Col lg={3}>
                    <div className="submit_btn" style={{ marginTop: "0px" }}>
                        <button type="submit" className="sec_btn" disabled={loading || (commission.default == commission.updated)}>Update</button>
                        <span
                            className="load-more mt_20"
                            style={{
                                display: loading ? "inline" : "none",
                                marginLeft: '1rem',
                                verticalAlign: 'middle',
                                fontSize: "25px"
                            }}>
                            <i className="fad fa-spinner-third fa-spin"></i>
                        </span>
                    </div>
                </Col>
            </Row>
        </form >
    );
};

export default AffiliateCommission;
