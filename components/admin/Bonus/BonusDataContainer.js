/* react-hooks/exhaustive-deps */
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const BonusDataContainer = ({
    methods,
    fetchCurrency,
    showDepositPercentage,
    setShowDepositPercentage,
    setFixedBonusInfo,
    setDepositPercentageInfo,
    isSubmitted,
    isSubmitClick,
    bonusDetails,
    fixedBonusDisplay,
    setFixedBonusDisplay,
}) => {
    const { adminLanguageData } = AdminLanguageState();
    const [depositDisplay, setDepositDisplay] = useState(false);
    const [fixedBonusData, setFixedBonusData] = useState([]);
    const [depositData, setDepositData] = useState([]);
    const [assignValue, setAssignValue] = useState(false);
    const [fixedBonusError, setFixedBonusError] = useState([]);
    const [depositPercentageError, setDepositPercentageError] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (bonusDetails) {
            methods.setValue("bonusDataType", bonusDetails?.bonusDataType);
            if (bonusDetails?.allocationType === "deposits") {
                setShowDepositPercentage(true);
            }
            if (bonusDetails?.bonusDataType === "fixedBonus") {
                setFixedBonusData([bonusDetails?.bonusData]);
                setFixedBonusDisplay(true);
            } else {
                setDepositData([bonusDetails?.bonusData]);
                setDepositDisplay(true);
            }
        }
    }, [bonusDetails]);

    useEffect(() => {
        if (fixedBonusDisplay) {
            setFixedBonusData([bonusDetails?.bonusData]);
        } else {
            setDepositData([bonusDetails?.bonusData]);
        }
    }, [fixedBonusDisplay, depositDisplay]);

    const bonusErrors = () => {
        let errors = [];
        fixedBonusData?.forEach((item) => {
            Object.entries(item)?.forEach(([key, value]) => {
                if (value === "") {
                    errors = [
                        ...errors,
                        { currency: item?.currency, field: key, message: `${key} is required` },
                    ];
                }
            });
            setFixedBonusError(errors);
        });
    };

    const Depositrrors = () => {
        let errors = [];
        depositData?.forEach((item) => {
            if (item) {
                Object.entries(item)?.forEach(([key, value]) => {
                    if (value === "") {
                        errors = [
                            ...errors,
                            { currency: item?.currency, field: key, message: `${key} is required` },
                        ];
                    }
                });
            }
            setDepositPercentageError(errors);
        });
    };

    useEffect(() => {
        bonusErrors();
        Depositrrors();
    }, [isSubmitClick]);

    const renderDynamicFields = () => {
        setErrorMessage("");
        const currencyList = methods.getValues("currenciesList");
        let list = [];

        if (methods.getValues("bonusDataType") === "fixedBonus") {
            currencyList?.forEach((item) => {
                const obj = {
                    currency: item?.value,
                    bonusToBeAwarded: "",
                    maximumToBalance: "",
                };
                list = [...list, obj];
            });
            list.forEach((item, index) => {
                const newElem = fixedBonusData?.find((i) => i?.currency === item?.currency);
                if (newElem) {
                    list?.splice(index, 1, newElem);
                }
            });
            setFixedBonusData(list);
            setFixedBonusDisplay(true);
        } else {
            currencyList?.forEach((item) => {
                const obj = {
                    currency: item?.value,
                    percentage: "",
                    limitToAwarded: "",
                    maximumToBalance: "",
                };
                list = [...list, obj];
            });
            list.forEach((item, index) => {
                const newElem = depositData?.find((i) => i?.currency === item?.currency);
                if (newElem) {
                    list?.splice(index, 1, newElem);
                }
            });
            if (methods.getValues("bonusDataType")) {
                setDepositDisplay(true);
            }
            setDepositData(list);
        }
    };

    useEffect(() => {
        renderDynamicFields();
    }, [assignValue]);

    useEffect(() => {
        renderDynamicFields();
    }, [fetchCurrency]);

    const handleClick = (event) => {
        methods.setValue("bonusDataType", event.target.value);
        document.getElementById(event.target.value).checked = true;
        const currencyList = methods.getValues("currenciesList");
        if (currencyList?.length > 0) {
            if (event.target.value === "fixedBonus") {
                setFixedBonusDisplay(true);
                setDepositDisplay(false);
            } else {
                setDepositDisplay(true);
                setFixedBonusDisplay(false);
            }
            setAssignValue((prev) => !prev);
        } else {
            setErrorMessage("Please select currency");
        }
    };

    const handleBonusDataChange = (currency, field, value) => {
        fixedBonusData?.forEach((item) => {
            if (item?.currency === currency) {
                item[field] = value;
                return;
            }
        });
        setFixedBonusInfo(fixedBonusData);
        if (fixedBonusError) {
            let indexI;
            fixedBonusError.forEach((item, index) => {
                if (item.currency === currency && item.field === field) {
                    indexI = index;
                }
            });
            fixedBonusError.splice(indexI, 1);
            setFixedBonusError(fixedBonusError);
            bonusErrors();
        }
    };

    const handleDepositDataChange = (currency, field, value) => {
        depositData?.forEach((item) => {
            if (item?.currency === currency) {
                item[field] = value;
                return;
            }
        });
        setDepositPercentageInfo(depositData);
        if (depositPercentageError) {
            let indexI;
            depositPercentageError.forEach((item, index) => {
                if (item.currency === currency && item.field === field) {
                    indexI = index;
                }
            });
            depositPercentageError.splice(indexI, 1);
            setDepositPercentageError(depositPercentageError);
            Depositrrors();
        }
    };

    return (
        <>
            <div className="form_checkbox">
                <input
                    name="bonusData"
                    id="fixedBonus"
                    type="radio"
                    value="fixedBonus"
                    onClick={handleClick}
                    {...methods.register("bonusDataType")}
                />
                <span>
                    {
                        adminLanguageData?.bonus_campaign_create_page
                            ?.bonus_campaign_create_bonus_data_option_fixed_bonus?.value
                    }
                </span>
            </div>

            {showDepositPercentage && (
                <div className="form_checkbox">
                    <input
                        name="bonusData"
                        id="depositPercentage"
                        type="radio"
                        value="depositPercentage"
                        onClick={handleClick}
                        {...methods.register("bonusDataType")}
                    />
                    <span>
                        {
                            adminLanguageData?.bonus_campaign_create_page
                                ?.bonus_campaign_create_bonus_data_option_deposit_percentage?.value
                        }
                    </span>
                </div>
            )}

            {errorMessage && <p className="player-bet-loss">{errorMessage}</p>}

            {(fixedBonusDisplay || depositDisplay) && <hr />}
            {fixedBonusDisplay &&
                fixedBonusData?.map((item, index) => {
                    return (
                        <div key={index}>
                            <h6>{item?.currency || methods.getValues("currenciesList")[0]?.value}</h6>
                            <Row>
                                <Col md={4}>
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_fixed_bonus_bonus_to_be_awarded_input
                                                    ?.value
                                            }
                                        </label>
                                        <input
                                            name="bonusToBeAwarded"
                                            type="number"
                                            value={item?.bonusToBeAwarded}
                                            onChange={(event) =>
                                                handleBonusDataChange(
                                                    item?.currency,
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_fixed_bonus_maximum_to_convert_into_real_balance_input
                                                    ?.value
                                            }
                                        </label>
                                        <input
                                            name="maximumToBalance"
                                            type="number"
                                            value={item?.maximumToBalance}
                                            onChange={(event) =>
                                                handleBonusDataChange(
                                                    item?.currency,
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            {isSubmitted &&
                                fixedBonusError?.map((i, index) => {
                                    if (i?.currency === item?.currency) {
                                        return (
                                            <p key={index} className="player-bet-loss">
                                                {i?.message}
                                            </p>
                                        );
                                    }
                                })}
                            {fixedBonusDisplay && <hr />}
                        </div>
                    );
                })}
            {depositDisplay &&
                depositData?.map((item, index) => {
                    return (
                        <div key={index}>
                            <h6>{item?.currency || methods.getValues("currenciesList")[0]?.value}</h6>
                            <Row>
                                <Col md={4}>
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_deposit_percentage_percentage_input
                                                    ?.value
                                            }
                                        </label>
                                        <input
                                            name="percentage"
                                            type="number"
                                            value={item?.percentage}
                                            onChange={(event) =>
                                                handleDepositDataChange(
                                                    item?.currency,
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_deposit_percentage_limit_to_be_awarded_input
                                                    ?.value
                                            }
                                        </label>
                                        <input
                                            name="limitToAwarded"
                                            type="number"
                                            value={item?.limitToAwarded}
                                            onChange={(event) =>
                                                handleDepositDataChange(
                                                    item?.currency,
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form_input_wp">
                                        <label>
                                            {" "}
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_deposit_percentage_maximum_to_convert_into_real_balance_input
                                                    ?.value
                                            }
                                        </label>
                                        <input
                                            name="maximumToBalance"
                                            type="number"
                                            value={item?.maximumToBalance}
                                            onChange={(event) =>
                                                handleDepositDataChange(
                                                    item?.currency,
                                                    event.target.name,
                                                    event.target.value
                                                )
                                            }
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                            </Row>
                            {isSubmitted &&
                                depositPercentageError?.map((i, index) => {
                                    if (i?.currency === item?.currency) {
                                        return (
                                            <p key={index} className="player-bet-loss">
                                                {i?.message}
                                            </p>
                                        );
                                    }
                                })}
                            {depositDisplay && <hr />}
                        </div>
                    );
                })}
        </>
    );
};

export default BonusDataContainer;
