import Modal from "react-bootstrap/Modal";

const AdminModal = ({ children, show, size, closeModal, ...props }) => {
    return (
        <>
            <Modal
                show={show}
                onHide={closeModal}
                size={size}
                className={props.className ? props.className : ""}
            >
                <button type="button" className="close" onClick={closeModal}>
                    <span aria-hidden="true">×</span>
                </button>

                <Modal.Body className="overflow-text">{children}</Modal.Body>
            </Modal>
        </>
    );
};

export default AdminModal;
