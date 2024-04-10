import { useState } from "react";
import SliderModal from "../Modals/SliderModal";
import sha1 from "sha1";
import axios from "axios";
import SlideAccrordion from "./Slide";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const SliderAccordion = ({ slider, refreshList, sliderType }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [accordion, setAccordion] = useState(false);
    const [sliderModal, setSliderModal] = useState(false);
    const [sliderAction, setSliderAction] = useState("");

    const sliderActionHandler = (action, sliderId = 0, slider = {}) => {
        const sliderAction = {
            action: action,
            sliderId: sliderId,
            slider: slider,
        };
        setSliderAction(sliderAction);
        setSliderModal(true);
    };

    const handleDeleteSlider = (slider) => {
        const confirmStatus = confirm(`Are you sure, ${slider?.name} slider will be deleted!`);
        if (!confirmStatus) return;

        const authKey = sha1(
            process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId}`
        );

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/admin-slider/delete-slider?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&sliderId=${slider?.id}&type=${sliderType}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    refreshList();
                } else {
                    alert(response.data?.message);
                }
            })
            .catch((error) => {
                alert(error.message);
            })
            .finally();
    };

    return (
        <>
            <div className={`slider_main_accordion ${accordion ? "active_accordion" : ""}`}>
                <div className="table_btn_group">
                    <ul>
                        <li>
                            <button
                                type="button"
                                onClick={() => sliderActionHandler("edit", slider?.id, slider)}>
                                <i className="far fa-pencil-alt"></i>{" "}
                                {adminLanguageData?.banner_sliders_page?.edit?.value}
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={() => handleDeleteSlider(slider)}>
                                <i className="far fa-trash-alt"></i>{" "}
                                {adminLanguageData?.banner_sliders_page?.remove?.value}
                            </button>
                        </li>
                    </ul>
                </div>

				<div className="h5_title slider_main_accordion_title" onClick={() => setAccordion(!accordion)}>
					<b>
						<span>{slider?.name}
							<span>
								<i className="far fa-link"></i>
								{slider?.slug}
							</span>
						</span>
					</b>

                    <span>
                        <i className="fal fa-chevron-right"></i>
                    </span>
                </div>

                <SlideAccrordion key={`${slider?.id}-accordion`} slider={slider} sliderType={sliderType} />
            </div>
            <SliderModal
                setShow={setSliderModal}
                show={sliderModal}
                refreshList={refreshList}
                action={sliderAction}
                sliderType={sliderType}
            />
        </>
    );
};

export default SliderAccordion;
