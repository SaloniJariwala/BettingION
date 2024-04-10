import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";

const PromoCodeContainer = ({ setPromoCodes, isSubmitted, isSubmitClick, bonusDetails }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [inputFields, setInputFields] = useState([
        {
            code: "",
            // tag: "",
        },
    ]);

    useEffect(() => {
        if (bonusDetails) {
            if (bonusDetails?.promoCodes) {
                setInputFields(bonusDetails?.promoCodes);
                setPromoCodes(bonusDetails?.promoCodes);
            } else {
                setInputFields([{ code: bonusDetails?.code }]);
                setPromoCodes([{ code: bonusDetails?.code }]);
            }
        }
    }, [bonusDetails]);

    const addInputField = () => {
        setInputFields([
            ...inputFields,
            {
                code: "",
                // tag: "",
            },
        ]);
    };

    const removeInputFields = (index) => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
        setPromoCodes(rows);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const list = [...inputFields];
        list[index][name] = value;
        setInputFields(list);
        if (value === "" || value === null) list[index].error = "Fields are required";
        if (inputFields[index].code === "" && inputFields[index].tag === "") {
            list[index].error = adminLanguageData?.bonus_campaign_create_page?.bonus_promo_btag_code_error?.value;
        } else if (inputFields[index].code === "") {
            list[index].error = adminLanguageData?.bonus_campaign_create_page?.bonus_promo_code_error?.value;
        } else if (inputFields[index].tag === "") {
            list[index].error = adminLanguageData?.bonus_campaign_create_page?.bonus_btag_code_error?.value;
        } else {
            list[index].error = "";
        }
        setPromoCodes(list);
    };

    useEffect(() => {
        inputFields?.map((input, index) => {
            inputFields.errorStatus = true;
            if (input.code === "" && input.tag === "") {
                input.error = adminLanguageData?.bonus_campaign_create_page?.bonus_promo_btag_code_error?.value;
            } else if (input.code === "") {
                input.error = adminLanguageData?.bonus_campaign_create_page?.bonus_promo_code_error?.value;
            } else if (input.tag === "") {
                input.error = adminLanguageData?.bonus_campaign_create_page?.bonus_btag_code_error?.value;
            } else {
                input.error = "";
                inputFields.errorStatus = false;
            }
        });
    }, [isSubmitClick]);

    return (
        <>
            {inputFields.map((data, index) => {
                const { code, tag, error } = data;
                return (
                    <div key={index}>
                        <Row className="mb-3 align-items-end">
                            <Col md={5}>
                                <label>{adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_promo_code_input?.value}</label>
                                <input
                                    type="text"
                                    onChange={(e) => {
                                        handleChange(index, e);
                                    }}
                                    style={{ textTransform: "uppercase" }}
                                    className={`form_input`}
                                    value={code}
                                    name="code"
                                />
                            </Col>
                            {/*   <Col md={5}>
                                <label>{adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_btag_input?.value}</label>
                                <input type="text" onChange={(e) => handleChange(index, e)} className={`form_input`} value={tag} name="tag" />
                            </Col>
                            <Col md={2}>
                                <button type="button" className="sec_btn icon_btn" onClick={() => removeInputFields(index)} style={{ display: index !== 0 ? "block" : "none" }}>
                                    <i className="fal fa-trash-alt"></i>
                                </button>
                            </Col> */}
                        </Row>
                        {error && isSubmitted && <p className="player-bet-loss">{error}</p>}
                    </div>
                );
            })}

            {/*    <button type="button" onClick={addInputField} className="sec_btn">
                {adminLanguageData?.bonus_campaign_create_page?.bonus_campaign_create_translation_add_button?.value} <i className="far fa-plus-circle"></i>
            </button>*/}
        </>
    );
};

export default PromoCodeContainer;
