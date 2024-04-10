/* react-hooks/exhaustive-deps */
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const DepositTypeContainer = ({ handleChange, currency, value, allocationInfo }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [depositType, setDepositType] = useState("");
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const opts = [
            {
                value: "first",
                label: adminLanguageData?.bonus_campaign_create_page
                    ?.bonus_campaign_create_allocation_criteria_deposit_type_option_first?.value,
            },
            {
                value: "next",
                label: adminLanguageData?.bonus_campaign_create_page
                    ?.bonus_campaign_create_allocation_criteria_deposit_type_option_next?.value,
            },
        ];
        setOptions(opts);
        if (value) {
            const res = opts?.find((item) => item.value === value);
            if (res) {
                setDepositType(res);
            } else {
                setDepositType("");
            }
        }
    }, [value]);

    useEffect(() => {
        const res = options?.find((item) => item.value === value);
        if (res) {
            setDepositType(res);
        } else {
            setDepositType("");
        }
    }, [allocationInfo]);

    return (
        <>
            <div className="form_input_wp form-element select_box_wrapper">
                <label>
                    {
                        adminLanguageData?.bonus_campaign_create_page
                            ?.bonus_campaign_create_allocation_criteria_deposit_type?.value
                    }
                </label>
                <div className="position-relative">
                    <Select
                        className={`select_box form_input`}
                        classNamePrefix="react-select"
                        theme={(theme) => ({
                            ...theme,
                            colors: {
                                ...theme.colors,
                                primary: "#fff",
                                primary25: "#bd57fb",
                                neutral0: "black",
                            },
                        })}
                        value={depositType}
                        onChange={(value) => {
                            setDepositType(value);
                            handleChange(currency, "depositType", value?.value);
                        }}
                        options={options}
                    />
                </div>
            </div>
        </>
    );
};

export default DepositTypeContainer;
