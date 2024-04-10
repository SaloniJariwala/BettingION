/* react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import DepositTypeContainer from "./DepositTypeContainer";
import IncludeExcludePaymentMethods from "./IncludeExcludePaymentMethods";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const AllocationCriteria = ({
    methods,
    setInfo,
    fetchCurrency,
    isSubmitClick,
    bonusDetails,
    errorsHandle,
    allocationInfoError,
    setAllocationInfoError,
    setShowDepositPercentage,
    setFixedBonusDisplay,
}) => {
    const { adminLanguageData } = AdminLanguageState();
    const [currencies, setCurrencies] = useState([]);
    const [display, setDisplay] = useState(false);
    const [allocationInfo, setAllocationInfo] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [depositClick, setDepositClick] = useState(false);
    // const [allocationInfoError, setAllocationInfoError] = useState([]);

    useEffect(() => {
        if (bonusDetails) {
            if (bonusDetails?.allocationType === "deposits") {
                if (bonusDetails?.allocationInfo) {
                    setAllocationInfo([bonusDetails?.allocationInfo]);
                } else {
                    setAllocationInfo([
                        {
                            currency: bonusDetails?.currencies[0],
                            depositType: "",
                            minimum: "",
                            includePaymentMethods: [],
                            excludePaymentMethods: [],
                        },
                    ]);
                }
                setDisplay(true);
            } else {
                setAllocationInfo([]);
            }
        }
    }, [bonusDetails]);

    useEffect(() => {
        if (bonusDetails) {
            if (bonusDetails?.allocationInfo) {
                if (depositClick) {
                    const currencyList = methods.getValues("currenciesList");
                    setCurrencies(currencyList);
                    if (currencyList?.length > 0) {
                        let list = [];
                        currencyList?.forEach((item) => {
                            const obj = {
                                currency: item?.value,
                                depositType: "",
                                minimum: "",
                                includePaymentMethods: [],
                                excludePaymentMethods: [],
                            };
                            list = [...list, obj];
                        });
                        setAllocationInfo(list);
                        setInfo(list);
                    }
                } else {
                    setAllocationInfo([bonusDetails?.allocationInfo]);
                    setInfo([bonusDetails?.allocationInfo]);
                }
            } else {
                setAllocationInfo([
                    {
                        currency: bonusDetails?.currencies[0],
                        depositType: "",
                        minimum: "",
                        includePaymentMethods: [],
                        excludePaymentMethods: [],
                    },
                ]);
                setInfo([
                    {
                        currency: bonusDetails?.currencies[0],
                        depositType: "",
                        minimum: "",
                        includePaymentMethods: [],
                        excludePaymentMethods: [],
                    },
                ]);
            }
        } else {
            const currencyList = methods.getValues("currenciesList");
            setCurrencies(currencyList);
            if (currencyList?.length > 0) {
                let list = [];
                currencyList?.forEach((item) => {
                    const obj = {
                        currency: item?.value,
                        depositType: "",
                        minimum: "",
                        includePaymentMethods: [],
                        excludePaymentMethods: [],
                    };
                    list = [...list, obj];
                });
                setAllocationInfo(list);
                setInfo(list);
            } else {
                if (depositClick) {
                    setErrorMessage("Please select currency");
                }
            }
        }
    }, [display]);

    useEffect(() => {
        if (isSubmitClick) {
            if (errorsHandle()) {
                setAllocationInfoError(errorsHandle());
            }
        }
    }, [isSubmitClick]);

    useEffect(() => {
        setErrorMessage("");
        const currencyList = methods.getValues("currenciesList");
        setCurrencies(currencyList);
        let list = [];
        currencyList?.forEach((item) => {
            const obj = {
                currency: item?.value,
                depositType: "",
                minimum: "",
                includePaymentMethods: [],
                excludePaymentMethods: [],
            };
            list = [...list, obj];
        });
        list.forEach((item, index) => {
            const newElem = allocationInfo?.find((i) => i?.currency === item?.currency);
            if (newElem) {
                list?.splice(index, 1, newElem);
            }
        });
        setAllocationInfo(list);
        setInfo(list);
    }, [fetchCurrency]);

    const handleCheck = (event) => {
        if (event.target.value === "deposits") {
            setDepositClick(true);
            setShowDepositPercentage(true);
            methods.setValue("bonusDataType", "");
            setFixedBonusDisplay(false);
            setDisplay(true);
        } else {
            setShowDepositPercentage(false);
            setDisplay(false);
            document.getElementById("fixedBonus")?.click();
            methods.setValue("bonusDataType", "fixedBonus");
        }
    };

    const handleChange = (currency, field, value) => {
        allocationInfo?.forEach((item) => {
            if (item?.currency === currency) {
                item[field] = value;
                return;
            }
        });
        setInfo(allocationInfo);
        if (allocationInfoError?.length > 0) {
            let indexI;
            allocationInfoError.forEach((item, index) => {
                if (item.currency === currency && item.field === field) {
                    indexI = index;
                }
            });
            allocationInfoError.splice(indexI, 1);
            // setCheck((prev) => !prev);
            setAllocationInfoError(allocationInfoError);
            errorsHandle();
        }
    };

    return (
        <>
            <div className="form_checkbox">
                <input
                    name="allocationType"
                    id="registration"
                    type="radio"
                    value="registration"
                    onClick={handleCheck}
                    {...methods.register("allocationType")}
                />
                <span>
                    {
                        adminLanguageData?.bonus_campaign_create_page
                            ?.bonus_campaign_create_allocation_criteria_option_registration?.value
                    }
                </span>
            </div>
            <div className="form_checkbox">
                <input
                    name="deposits"
                    id="deposits"
                    type="radio"
                    value="deposits"
                    onClick={handleCheck}
                    {...methods.register("allocationType")}
                />
                <span>
                    {
                        adminLanguageData?.bonus_campaign_create_page
                            ?.bonus_campaign_create_allocation_criteria_option_deposits?.value
                    }
                </span>
            </div>
            {errorMessage && <p className="player-bet-loss">{errorMessage}</p>}
            {display && allocationInfo?.length > 0 && <hr />}
            {display &&
                allocationInfo?.map((item, index) => {
                    return (
                        <div key={index} className="all_action_info">
                            <h6>{item?.currency}</h6>
                            <Row>
                                <Col md={3}>
                                    <DepositTypeContainer
                                        currency={item?.currency}
                                        handleChange={handleChange}
                                        value={item?.depositType}
                                        allocationInfo={allocationInfo}
                                    />
                                </Col>
                                <Col md={3}>
                                    <div className="form_input_wp">
                                        <label>
                                            {
                                                adminLanguageData?.bonus_campaign_create_page
                                                    ?.bonus_campaign_create_allocation_criteria_minimum?.value
                                            }
                                        </label>
                                        <input
                                            name="minimum"
                                            type="number"
                                            // value={item?.minimum}
                                            defaultValue={item?.minimum}
                                            onChange={(event) => {
                                                // setMinimum(event.target.value);
                                                handleChange(item?.currency, "minimum", event.target.value);
                                            }}
                                            min={0}
                                            className={`form_input`}
                                            autoComplete="off"
                                        />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <IncludeExcludePaymentMethods
                                        label={"Include Payment Method"}
                                        name="include"
                                        currency={item?.currency}
                                        handleChange={handleChange}
                                        value={item?.includePaymentMethods}
                                    />
                                </Col>
                                <Col md={3}>
                                    <IncludeExcludePaymentMethods
                                        label={"Exclude Payment Method"}
                                        name="exclude"
                                        currency={item?.currency}
                                        handleChange={handleChange}
                                        value={item?.excludePaymentMethods}
                                    />
                                </Col>
                            </Row>
                            {allocationInfoError?.map((i, index) => {
                                if (i?.currency === item?.currency) {
                                    return (
                                        <p key={index} className="player-bet-loss">
                                            {i?.message}
                                        </p>
                                    );
                                }
                            })}
                            {display && <hr />}
                        </div>
                    );
                })}
        </>
    );
};

export default AllocationCriteria;
