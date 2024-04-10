import { useEffect, useState } from "react";
import axios from "axios";
import sha1 from "sha1";
import { Col, Row } from "react-bootstrap";
import AsyncSelect from "react-select/async";
import { LanguageState } from "@/context/FrontLanguageProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const accountTypes = ["administrator", "super-agent", "agent"];

const UserSettings = () => {
    const [sucessMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [input, setInput] = useState("");
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectLoading, setSelectLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [defaultParent, setDefaultParent] = useState(false);
    const [successToggle, setSuccessToggle] = useState(false);
    const { adminLanguageData } = AdminLanguageState();

    useEffect(() => {
        console.log(adminLanguageData?.common_date_time_label?.submit_button_text?.value);
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setSelectLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/default-agent?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                }`
            )
            .then((response) => {
                if (response.data?.data?.defaultAgent) {
                    setDefaultParent(response.data?.data?.defaultAgent);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setSelectLoading(false);
            });
    }, [successToggle]);

    useEffect(() => {
        if (!defaultParent) return;

        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${defaultParent}`);

        setSelectLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/user-by-remoteId?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${defaultParent}&hide=false&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    const userInfo = [
                        {
                            label: `${response.data?.data?.username} (${response.data?.data?.email
                                } ~ ${response.data?.data?.accountType.toUpperCase()})`,
                            value: response.data?.data?.remoteId,
                            accountType: response.data?.data?.accountType,
                        },
                    ];
                    setSelectedOption(userInfo[0]);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setSelectLoading(false);
            });
    }, [defaultParent]);

    const loadOptions = async (input) => {
        let res;
        const authkey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY +
            `remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}`
        );
        setSelectLoading(true);
        await axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/players/dashboard-users-by-remoteid?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&username=${input}&limit=25&filterType=everyone&authKey=${authkey}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.currentUser !== 0) {
                        res = response.data?.allUsers?.map((user) => {
                            return {
                                label: `${user?.username} (${user?.emailId
                                    } ~ ${user?.accountType.toUpperCase()})`,
                                value: user?.remoteId,
                                accountType: user?.accountType,
                            };
                        });
                    }
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setSelectLoading(false);
            });
        return res;
    };

    const handleInputChange = (newValue) => {
        setInput(newValue);
    };

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
    };

    const defaultParentUserUpdateHandler = (event) => {
        event.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        if (defaultParent === selectedOption?.value || !selectedOption) {
            setErrorMessage("Please search and select another user");
            return;
        }

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        setLoading(true);
        axios
            .put(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/default-agent-edit?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                }&agentRemoteId=${selectedOption?.value}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(response.data?.message);
                    setSuccessToggle((prev) => !prev);
                    setTimeout(() => {
                        setSuccessMessage("");
                    }, 7000);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(response.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <form className="site_setting_form" method="POST" onSubmit={defaultParentUserUpdateHandler}>
            <Row>
                <h3>{adminLanguageData?.settings_page?.page_sub_title?.value}</h3>
                <Col lg={4}>
                    <div className="form_input_wp">
                        <label htmlFor="referral_user">
                            {adminLanguageData?.settings_page?.default_parent_user_label?.value}
                        </label>
                        <AsyncSelect
                            className={`select_box form_input ${selectedOption && !accountTypes.includes(selectedOption?.accountType)
                                ? "input_error"
                                : ""
                                }`}
                            classNamePrefix="react-select"
                            cacheOptions
                            inputValue={input}
                            loadOptions={loadOptions}
                            onInputChange={handleInputChange}
                            isLoading={selectLoading}
                            labelKey="label"
                            valueKey="value"
                            placeholder={"search user.."}
                            onChange={handleSelectChange}
                            value={selectedOption}
                            required
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: "#fff",
                                    primary25: "#bd57fb",
                                    neutral0: "#161a23",
                                },
                            })}
                        />
                    </div>
                    {selectedOption && !accountTypes.includes(selectedOption?.accountType) ? (
                        <p
                            className="error-msg mt_20 m-0"
                            style={{
                                display:
                                    selectedOption &&
                                    !accountTypes.includes(selectedOption?.accountType) &&
                                    "block",
                            }}>
                            {
                                "Player can not be a parent user" /*adminLanguageData?.settings_page?.update_user_settings_error_message?.value*/
                            }
                        </p>
                    ) : loading ? (
                        <>
                            <span
                                className="load-more mt_20"
                                style={{
                                    display: loading ? "block" : "none",
                                    margin: 0,
                                    fontSize: "25px",
                                }}>
                                <i className="fad fa-spinner-third fa-spin"></i>
                            </span>
                        </>
                    ) : (
                        <>
                            <p
                                className="error-msg mt_20 m-0"
                                style={{
                                    display:
                                        !accountTypes.includes(selectedOption?.accountType) &&
                                        "block",
                                }}>
                                {"Player can not be parent user"}
                            </p>
                            <p className="error-msg mt_20 m-0" style={{ display: errorMessage && "block" }}>
                                {errorMessage}
                            </p>
                            <p
                                className="success-msg mt_20 m-0"
                                style={{ display: sucessMessage && "block" }}>
                                {sucessMessage}
                            </p>
                        </>
                    )}
                </Col>
                <Col lg={2}>
                    <div className="submit_btn" style={{ marginTop: "30px" }}>
                        <button
                            type="submit"
                            className="sec_btn"
                            disabled={
                                selectedOption && !accountTypes.includes(selectedOption?.accountType)
                                    ? true
                                    : null
                            }>
                            {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                        </button>
                    </div>
                </Col>
            </Row>
        </form>
    );
};

export default UserSettings;
