import React, { useEffect, useState } from "react";
import AdminModal from "../AdminModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const BonusTranslationModal = ({ show, setShow, language, setTranslation, translation, translationData }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState();

    useEffect(() => {
        if (translationData) {
            setTitle(translationData?.title);
            setDescription(translationData?.description);
        }
    }, [translationData]);

    const handleClose = () => {
        setShow(false);
        setErrors({ ...errors, title: "", description: "" });
        const newArr = translation?.filter((item) => item.language !== language);
        setTranslation([
            ...newArr,
            {
                language: language,
                title: title,
                description: description,
            },
        ]);
    };

    const handleSave = () => {
        if (!title && !description) {
            setErrors({ ...errors, title: "Name is required", description: "Description is required" });
            return;
        } else {
            if (!title) {
                setErrors({ ...errors, title: "Name is required" });
                return;
            } else {
                if (!description) {
                    setErrors({ ...errors, description: "Description is required" });
                    return;
                } else {
                    const newArr = translation?.filter((item) => item.language !== language);
                    setTranslation([
                        ...newArr,
                        {
                            language: language,
                            title: title,
                            description: description,
                        },
                    ]);
                    setShow(false);
                    setErrors({ ...errors, title: "", description: "" });
                }
            }
        }
    };

    return (
        <>
            <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
                <h3 className="h3-title modal_title">
                    {
                        adminLanguageData?.bonus_campaign_create_page
                            ?.bonus_campaign_create_translation_modal_title?.value
                    }
                    :{" "}
                    {language === "en"
                        ? adminLanguageData?.bonus_campaign_create_page
                              ?.bonus_campaign_create_english_translation?.value
                        : adminLanguageData?.bonus_campaign_create_page
                              ?.bonus_campaign_create_japanese_translation?.value}
                </h3>
                <div className="form_input_wp">
                    <label>
                        {
                            adminLanguageData?.bonus_campaign_create_page
                                ?.bonus_campaign_create_translation_modal_name?.value
                        }
                    </label>
                    <input
                        name="translationTitle"
                        type="text"
                        className={`form_input ${errors?.title ? "input_error" : ""}`}
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            if (event.target.value === "") {
                                setErrors({ ...errors, title: "Name is required" });
                            } else {
                                setErrors({ ...errors, title: "" });
                            }
                        }}
                        autoComplete="off"
                    />
                    {errors?.title && <p className="player-bet-loss">{errors?.title}</p>}
                </div>
                <div className="form_input_wp">
                    <label>
                        {
                            adminLanguageData?.bonus_campaign_create_page
                                ?.bonus_campaign_create_translation_modal_description?.value
                        }
                    </label>

                    <textarea
                        name="translationDescription"
                        className={`form_input ${errors?.description ? "input_error" : ""}`}
                        value={description}
                        onChange={(event) => {
                            setDescription(event.target.value);
                            if (event.target.value === "") {
                                setErrors({ ...errors, description: "Description is required" });
                            } else {
                                setErrors({ ...errors, description: "" });
                            }
                        }}></textarea>
                    {errors?.description && <p className="player-bet-loss">{errors?.description}</p>}
                </div>
                <div style={{ textAlign: "center" }}>
                    <button
                        type="button"
                        className="sec_btn"
                        style={{ marginRight: 10 }}
                        onClick={handleSave}>
                        {
                            adminLanguageData?.bonus_campaign_create_page
                                ?.bonus_campaign_create_translation_modal_save_button?.value
                        }
                    </button>
                    <button type="button" className="sec_btn" onClick={handleClose}>
                        {
                            adminLanguageData?.bonus_campaign_create_page
                                ?.bonus_campaign_create_translation_modal_close_button?.value
                        }
                    </button>
                </div>
            </AdminModal>
        </>
    );
};

export default BonusTranslationModal;
