import React, { useEffect, useState } from "react";
import Select from "react-select";

const TimezoneContainer = ({ methods, bonusDetails }) => {
    const {
        formState: { errors },
    } = methods;

    const [options, setOptions] = useState([]);
    const [timezone, setTimezone] = useState("");

    useEffect(() => {
        const timezones = Intl.supportedValuesOf("timeZone")?.map((item) => {
            return {
                value: item,
                label: item,
            };
        });
        setOptions(timezones);
        if (bonusDetails) {
            timezones?.forEach((item) => {
                if (item?.value === bonusDetails?.timezone) {
                    methods.setValue("timezone", item.value);
                    setTimezone(item);
                    return;
                }
            });
        }
    }, [bonusDetails]);

    return (
        <>
            <div className="form_input_wp form-element">
                <div className="position-relative">
                    <Select
                        className={`select_box form_input ${errors?.timezone ? "input_error" : ""}`}
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
                        value={timezone}
                        {...methods.register("timezone", { required: "Timezone is required" })}
                        onChange={(value) => {
                            setTimezone(value);
                            methods.setValue("timezone", value?.value);
                            methods.clearErrors("timezone");
                        }}
                        options={options}
                    />
                    {errors?.timezone && <p className="player-bet-loss">{errors?.timezone?.message}</p>}
                </div>
            </div>
        </>
    );
};

export default TimezoneContainer;
