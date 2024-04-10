import { LanguageState } from "@/context/FrontLanguageProvider";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";
import useGetConfig from "@/hooks/use-getConfig";
import sha1 from "sha1";

const CurrencyDropDown = ({ selectedOption, setSelectedOption, id, setCurrency, walletInfo, setAddress }) => {
    const { languageData } = LanguageState;
    const getConfig = useGetConfig();

    return (
        <>
            <div className="form_input_wp">
                <Select
                    className="select_box"
                    classNamePrefix="react-select"
                    placeholder={languageData?.deposit_page?.deposit_cryptocurrency_input_placeholder?.value}
                    onChange={(currencyValue) => {
                        setSelectedOption(currencyValue);
                        if (setCurrency) {
                            setCurrency(currencyValue?.value);
                        }
                        if (walletInfo) {
                            const obj = Object.entries(walletInfo)?.find(
                                ([key, value]) => key === currencyValue?.value
                            );
                            setAddress(obj ? obj[1] : "");
                        }
                    }}
                    id={id}
                    options={getConfig?.optionsData?.paymentCurrenciesOptions}
                    value={selectedOption}
                    theme={(theme) => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            primary: "#e150e7",
                            primary25: "#e150e7",
                            neutral0: "#161a23",
                        },
                    })}
                />
            </div>
        </>
    );
};

export default CurrencyDropDown;
