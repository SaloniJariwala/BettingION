import Title from "@/components/admin/UI/Title";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import { Col, Row } from "react-bootstrap";

const UserHeader = ({ setUserTreeModal, setShow, setShowRefferalModal }) => {
    const { adminLanguageData } = AdminLanguageState();

    return (
        <div className="title_bar">
            <Row className="align-items-center">
                <Col lg={4}>
                    <div className="title">
                        <Title>{adminLanguageData?.users_page?.users_page_title?.value}</Title>
                        <button
                            className="sec_btn modal-html-btn agent-tree-modal-btn"
                            onClick={() => setUserTreeModal(true)}>
                            Agent Tree
                        </button>
                    </div>
                </Col>
                <Col lg={8} className="text-lg-end">
                    <div className="button_group">
                        <button className="sec_btn modal-html-btn" onClick={() => setShow(true)}>
                            {adminLanguageData?.users_page?.user_button?.value}{" "}
                            <i className="far fa-plus-circle"></i>
                        </button>

                        <button className="sec_btn modal-html-btn" onClick={() => setShowRefferalModal(true)}>
                            {adminLanguageData?.users_page?.get_referral_link?.value}{" "}
                            <i className="far fa-plus-circle"></i>
                        </button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default UserHeader;
