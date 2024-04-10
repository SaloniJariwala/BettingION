import { useEffect, useState } from "react";
import AdminModal from "../AdminModal";
import sha1 from "sha1";
import axios from "axios";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const SliderModal = ({ show, setShow, refreshList, action, sliderType }) => {
    const { adminLanguageData } = AdminLanguageState();
    const modalTitle = {
        add: adminLanguageData?.common_date_time_label?.submit_button_text?.value,
        edit: adminLanguageData?.banner_sliders_edit_modal?.banner_sliders_edit_modal_title?.value,
    };
    const [sliderName, setSliderName] = useState("");
    const [sliderSlug, setSliderSlug] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!show || action?.action !== "edit") return;

        setSliderName(action?.slider?.name);
        setSliderSlug(action?.slider?.slug);
    }, [show]);

    const handleClose = () => {
        if (successMessage) refreshList();

        setErrorMessage("");
        setSuccessMessage("");
        setSliderName("");
        setSliderSlug("");
        setShow(false);
    };

    const handleUpdateSlider = () => {
        if (!sliderName) {
            setErrorMessage(adminLanguageData?.common_date_time_label?.banner_sliders_modal_error?.value);
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);

        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/admin-slider/update-main-slider?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}&name=${sliderName}&sliderId=${action?.sliderId}&slug=${sliderSlug}&type=${sliderType}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Slider updated successfully!");
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally();
    };

    const handleAddSlider = (event) => {
        if (!sliderName) {
            setErrorMessage(adminLanguageData?.common_date_time_label?.banner_sliders_modal_error?.value);
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`);

        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/admin-slider/create-main-slider?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}&name=${sliderName}&slug=${sliderSlug}&type=${sliderType}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(adminLanguageData?.common_date_time_label?.banner_sliders_modal_success?.value);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally();
    };

    return (
        <AdminModal show={show} setShow={setShow} closeModal={handleClose}>
            <h3 className="h3-title modal_title">{modalTitle[action?.action]} Slider</h3>

            <div className="form_input_wp">
                <label>{adminLanguageData?.banner_sliders_edit_modal?.slider_name_label?.value}</label>
                <input name="title" type="text" className="form_input" autoComplete="off" value={sliderName} onChange={(event) => setSliderName(event.target.value)} />
            </div>

            <div className="form_input_wp">
                <label>{adminLanguageData?.banner_sliders_edit_modal?.slug_label?.value}</label>
                <input name="slug" type="text" className="form_input" autoComplete="off" value={sliderSlug} onChange={(event) => setSliderSlug(event.target.value)} />
            </div>

            <p className="error-msg" style={{ display: errorMessage && "block" }}>
                {errorMessage}
            </p>
            <p className="success-msg" style={{ display: successMessage && "block" }}>
                {successMessage}
            </p>

            {action?.action === "add" && !successMessage && (
                <button type="button" className="sec_btn" onClick={handleAddSlider}>
                    {adminLanguageData?.banner_sliders_page?.add_button?.value}
                </button>
            )}

            {action?.action === "edit" && !successMessage && (
                <button type="button" className="sec_btn" onClick={handleUpdateSlider}>
                    {adminLanguageData?.banner_sliders_page?.update_button?.value}
                </button>
            )}
        </AdminModal>
    );
};

export default SliderModal;
