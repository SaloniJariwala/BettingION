import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";

const RolloversDataContainer = ({ methods, bonusDetails }) => {
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();
    const [options, setOptions] = useState([]);
    const [rollover, setRollover] = useState("");

    useEffect(() => {
        const opts = [
            {
                value: true,
                label: adminLanguageData?.bonus_campaign_create_page
                    ?.bonus_campaign_create_rollovers_data_option_yes?.value,
            },
            {
                value: "no",
                label: adminLanguageData?.bonus_campaign_create_page
                    ?.bonus_campaign_create_rollovers_data_option_no?.value,
            },
        ];
        setOptions(opts);
        if (bonusDetails) {
            methods.setValue("rolloverMultiplier", bonusDetails?.rolloverData?.rolloverMultiplier);
            methods.setValue("daysToComplete", bonusDetails?.rolloverData?.daysToComplete);
            // if (bonusDetails?.rolloverType === true) {
            //     setRollover({
            //         value: true,
            //         label: adminLanguageData?.bonus_campaign_create_page
            //             ?.bonus_campaign_create_rollovers_data_option_yes?.value,
            //     });
            //     methods.setValue("rolloverType", bonusDetails?.rolloverType);

            // } else {
            //     setRollover({
            //         value: "no",
            //         label: adminLanguageData?.bonus_campaign_create_page
            //             ?.bonus_campaign_create_rollovers_data_option_yes?.value,
            //     });
            //     methods.setValue("rolloverType", "no");
            // }
        }
    }, [bonusDetails]);

    return (
        <>
            <Row>
                {/* <Col md={4}>
                    <div className="form_input_wp form-element">
                        <label>
                            {
                                adminLanguageData?.bonus_campaign_create_page
                                    ?.bonus_campaign_create_rollovers_type?.value
                            }
                        </label>
                        <div className="position-relative">
                            <Select
                                className={`select_box form_input ${
                                    errors?.rolloverType ? "input_error" : ""
                                }`}
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
                                {...methods.register("rolloverType", {
                                    required: "Rollover Type is required",
                                })}
                                onChange={(value) => {
                                    setRollover(value);
                                    methods.setValue("rolloverType", value?.value);
                                    if (methods.getValues("rolloverType") !== "") {
                                        methods.clearErrors("rolloverType");
                                    }
                                }}
                                value={rollover}
                                options={options}
                            />
                            {errors?.rolloverType && (
                                <p className="player-bet-loss">{errors?.rolloverType?.message}</p>
                            )}
                        </div>
                    </div>
                </Col> */}
                {/* {methods?.getValues("rolloverType") === true && ( */}
                <>
                    <Col md={4}>
                        <div className="form_input_wp">
                            <label>
                                {
                                    adminLanguageData?.bonus_campaign_create_page
                                        ?.bonus_campaign_create_rollover_multiplier?.value
                                }
                            </label>
                            <input
                                name="rolloverMultiplier"
                                type="number"
                                min={0}
                                className={`form_input ${errors?.rolloverMultiplier ? "input_error" : ""}`}
                                autoComplete="off"
                                {...methods.register("rolloverMultiplier", {
                                    required: "Rollover Multiplier is required",
                                })}
                            />
                            {errors?.rolloverMultiplier && (
                                <p className="player-bet-loss">{errors?.rolloverMultiplier?.message}</p>
                            )}
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className="form_input_wp">
                            <label>
                                {
                                    adminLanguageData?.bonus_campaign_create_page
                                        ?.bonus_campaign_create_days_to_complete_rollover?.value
                                }
                            </label>
                            <input
                                name="daysToComplete"
                                type="number"
                                min={0}
                                className={`form_input ${errors?.daysToComplete ? "input_error" : ""}`}
                                autoComplete="off"
                                {...methods.register("daysToComplete", {
                                    required: "Days to complete rollover is required",
                                })}
                            />
                            {errors?.daysToComplete && (
                                <p className="player-bet-loss">{errors?.daysToComplete?.message}</p>
                            )}
                        </div>
                    </Col>
                </>
                {/* )} */}
            </Row>
        </>
    );
};

export default RolloversDataContainer;
