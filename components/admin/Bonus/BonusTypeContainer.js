/* react-hooks/exhaustive-deps */
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const BonusTypeContainer = ({ methods, bonusDetails }) => {
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();

    const [options, setOptions] = useState([]);
    const [type, setType] = useState("");

    useEffect(() => {
        const opts = [
            {
                value: "instant",
                label: adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_bonus_type_option_instant?.value,
            },
        ];
        setOptions(opts);
        if (bonusDetails) {
            opts?.forEach((item) => {
                if (item?.value === bonusDetails?.bonusType) {
                    methods.setValue("bonusType", item.value);
                    setType(item);
                    return;
                }
            });
        }
    }, [adminLanguageData, bonusDetails]);

    return (
        <>
            <div className="form_input_wp form-element select_box_wrapper">
                <label>{adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_bonus_type?.value}</label>
                <div className="position-relative">
                    <Select
                        className={`select_box form_input ${errors?.bonusType ? "input_error" : ""}`}
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
                        {...methods.register("bonusType", { required: adminLanguageData?.bonus_campaign_create_page?.bonus_type_error?.value })}
                        value={type}
                        onChange={(value) => {
                            setType(value);
                            methods.setValue("bonusType", value?.value);
                            methods.clearErrors("bonusType");
                        }}
                        options={options}
                    />
                    {errors?.bonusType && <p className="player-bet-loss">{errors?.bonusType?.message}</p>}
                </div>
            </div>
        </>
    );
};

export default BonusTypeContainer;
