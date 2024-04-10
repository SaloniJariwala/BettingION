/* react-hooks/exhaustive-deps */
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { BalanceState } from "@/context/BalanceProvider";
import useGetConfig from "@/hooks/use-getConfig";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const CurrencyContainer = ({ methods, setFetchCurrency, bonusDetails }) => {
    const getConfig = useGetConfig();
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();
    const { userDefaultCurrency } = BalanceState();
    const [currency, setCurrency] = useState([]);

    useEffect(() => {
        if (bonusDetails) {
            const res = getConfig?.optionsData?.paymentCurrenciesOptionsWithUserCurrency?.find((item) => item?.value === bonusDetails?.currency);
            methods.setValue("currenciesList", [res]);
            setCurrency(res);
        }
    }, [bonusDetails, userDefaultCurrency?.currencyAbrv, getConfig?.isLoading]);

    return (
        <>
            <div className="form_input_wp form-element">
                <label>
                    {adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_currencies?.value}
                </label>
                <div className="position-relative">
                    <Select
                        isMulti={bonusDetails ? false : true}
                        name="currency"
                        options={getConfig?.optionsData?.paymentCurrenciesOptionsWithUserCurrency}
                        className={`select_box form_input ${errors?.currenciesList ? "input_error" : ""}`}
                        classNamePrefix="react-select"
                        {...methods.register("currenciesList", {
                            required:
                                adminLanguageData?.bonus_campaign_create_page?.bonus_currencies_error?.value,
                        })}
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "#fff",
                                primary25: "#bd57fb",
                                neutral0: "black",
                            },
                        })}
                        value={currency}
                        onChange={(value) => {
                            if (bonusDetails) {
                                setCurrency([value]);
                                methods.setValue("currenciesList", [value]);
                            } else {
                                methods.setValue("currenciesList", value);
                                setCurrency(value);
                            }
                            if (
                                (methods.getValues("bonusDataType") || methods.getValues("allocationType")) &&
                                !bonusDetails
                            ) {
                                setFetchCurrency((prev) => !prev);
                            }
                            if (bonusDetails) {
                                setFetchCurrency((prev) => !prev);
                            }
                            if (value.length > 0) {
                                methods.clearErrors("currenciesList");
                            }
                        }}
                    />
                    {errors?.currenciesList && (
                        <p className="player-bet-loss">{errors?.currenciesList?.message}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CurrencyContainer;
