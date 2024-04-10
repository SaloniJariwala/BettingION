import AdminModal from "@/components/admin/AdminModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Col, Row } from "react-bootstrap";

const SliderInfoModal = ({ show, setShow, sliderType }) => {
    const { adminLanguageData } = AdminLanguageState();

    const handleClose = () => {
        setShow(false);
    };

    return (
        <AdminModal show={show} closeModal={handleClose} size="md">
            <h3 className="h3-title modal_title">
                {adminLanguageData?.banner_slug_infomation_modal?.banner_slug_infomation_modal_title?.value}
            </h3>

            <div className="slider_info_modal_content">
                <p>{adminLanguageData?.banner_slug_infomation_modal?.slug_message?.value}</p>
                <ul className="user_info_list">
                    <li>
                        <label>
                            <span>{adminLanguageData?.banner_slug_infomation_modal?.pages?.value}</span>
                        </label>
                        <label>
                            <span>{adminLanguageData?.banner_slug_infomation_modal?.slugs?.value}</span>
                        </label>
                    </li>
                    {"offer" === sliderType && (
                        <li>
                            <span>{adminLanguageData?.banner_slug_infomation_modal?.main_page?.value}</span>
                            <span>{adminLanguageData?.banner_slug_infomation_modal?.main_page?.value}</span>
                        </li>
                    )}
                    <li>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.casino?.value}</span>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.casino?.value}</span>
                    </li>
                    <li>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.live_dealer?.value}</span>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.live_dealer?.value}</span>
                    </li>
                    <li>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.virtual_sports?.value}</span>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.virtual_sports?.value}</span>
                    </li>
                    <li>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.single_provider?.value}</span>
                        <span>{adminLanguageData?.banner_slug_infomation_modal?.provider?.value}</span>
                    </li>
                </ul>
            </div>
        </AdminModal>
    );
};

export default SliderInfoModal;
