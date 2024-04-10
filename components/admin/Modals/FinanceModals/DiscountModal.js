import AdminModal from "@/components/admin/AdminModal";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import Image from "next/image";
import { useState } from "react";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import axios from "axios";
import sha1 from "sha1";
import { BalanceState } from "@/context/BalanceProvider";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const DiscountModal = ({ show, setShow, userDetails, type, renderData }) => {
    const { userDefaultCurrency } = BalanceState();
    const { adminLanguageData } = AdminLanguageState();
    const [uploadImage, setUploadImage] = useState(false);
    const [isComment, setIsComment] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [image, setImage] = useState();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState();
    const [comment, setComment] = useState("");
    const [amount, setAmount] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");

    const previewHandleClose = () => {
        setImage(false);
        setUploadImage(false);
    };

    const handleClose = () => {
        setShow(false);
        setAmount(0);
        setErrorMessage("");
        setComment("");
        setIsComment("");
        setSuccessMessage("");
        previewHandleClose();
    };

    const incrementCounter = (e) => {
        e.preventDefault();
        setAmount((Number(amount) + 50).toFixed(2));
    };

    const decrementCounter = (e) => {
        e.preventDefault();
        if (amount > 50) {
            setAmount((Number(amount) - 50).toFixed(2));
        }
    };

    const handleSpecific = (e) => {
        e.preventDefault();
        setAmount(e.target.value);
    };

    const handleFileChange = (event) => {
        setErrorMessage("");
        const file = event.target.files[0];
        if (file?.type === "image/jpg" || file?.type === "image/png" || file?.type === "image/jpeg") {
            if (file.size > 4194304) {
                setErrorMessage("File is too large");
                return;
            }
            setImageFile(file);
            setUploadImage(true);
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            setErrorMessage("Only accepts JPG, PNG or JPEG");
            return;
        }
    };

    const handleSubmit = async (event) => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `remoteId=${userDetails?.userId}&action=finance-user-list`);

        setErrorMessage("");
        setSuccessMessage("");
        event.preventDefault();

        let collectPost;
        const collectPostUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/finance-user/actions?action=finance-user-list&type=${type === "agent" ? "agent-operation" : "player-operation"}&token=${
            process.env.NEXT_PUBLIC_TOKEN
        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${userDetails?.userId}&operation_type=discount&amount=${amount}&auth_id=${
            JSON.parse(localStorage.getItem("User"))?.remoteId
        }&comment=${comment}&authKey=${authKey}`;

        if (image) {
            collectPost = [
                collectPostUrl,
                {
                    file: imageFile,
                },
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "multipart/form-data",
                    },
                },
            ];
        } else {
            collectPost = [collectPostUrl];
        }

        setLoading(true);

        await axios
            .post(...collectPost)
            .then((response) => {
                if (response.data?.status === 200) {
                    handleClose();
                    renderData();
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                if (error?.response?.status === 500) {
                    setErrorMessage(500);
                } else {
                    setErrorMessage(error.message);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <AdminModal show={show} closeModal={handleClose}>
            <h3 className="h3-title modal_title">{adminLanguageData?.common_finance_module?.discount_modal_title?.value}</h3>
            <form className="add_credit_form" onSubmit={handleSubmit}>
                <div className="form_input_group">
                    <div className="input-group-prepend">
                        <span className="input-group-text input-modal-addon">
                            <i className="fas fa-user" aria-hidden="true"></i>
                        </span>
                    </div>
                    <input type="text" className="form_input" name="user_name" readOnly={userDetails?.username} defaultValue={userDetails?.username} />
                    <input
                        type="text"
                        className="form_input"
                        name="user_current_balance"
                        readOnly={renderAmountWithCurrency(userDetails?.balance, userDefaultCurrency?.currencyAbrv)}
                        defaultValue={renderAmountWithCurrency(userDetails?.balance, userDefaultCurrency?.currencyAbrv)}
                    />
                </div>

                <div className="form_input_group balance_input_group">
                    <div className="d-flex">
                        <div className="input-group-prepend">
                            <span className="input-group-text input-modal-addon">
                                <i className="fas fa-coins" aria-hidden="true"></i>
                            </span>
                        </div>
                        <input
                            type="number"
                            className="form_input user_balanace_input"
                            name="user_balance"
                            aria-label="amount"
                            autoComplete="off"
                            step=".01"
                            placeholder="0.00"
                            value={amount ?? amount}
                            onInput={(e) => {
                                if (e.target.value.indexOf(".") !== -1) {
                                    const decimals = e.target.value.length - e.target.value.indexOf(".");
                                    if (decimals > 3) e.target.value = e.target.value.slice(0, e.target.value.indexOf(".") + 3);
                                }
                            }}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    <div className="table_btn_group form_right_group">
                        <ul>
                            <li>
                                <NextTooltip title={adminLanguageData?.common_finance_module?.modals_increase_tooltip?.value}>
                                    <button
                                        type="button"
                                        className="sec_btn icon_btn balance_action"
                                        onClick={(e) => {
                                            incrementCounter(e);
                                        }}
                                    >
                                        <i className="far fa-plus"></i>
                                    </button>
                                </NextTooltip>
                            </li>
                            <li>
                                <NextTooltip title={adminLanguageData?.common_finance_module?.modals_decrease_tooltip?.value}>
                                    <button
                                        type="button"
                                        className="sec_btn icon_btn balance_action"
                                        onClick={(e) => {
                                            decrementCounter(e);
                                        }}
                                    >
                                        <i className="far fa-minus"></i>
                                    </button>
                                </NextTooltip>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="add_coin_group">
                    <ul>
                        <li>
                            <button type="button" className="sec_btn sm_btn" value="100" onClick={(e) => handleSpecific(e)}>
                                <i className="far fa-plus"></i> 100
                            </button>
                        </li>
                        <li>
                            <button type="button" className="sec_btn sm_btn" value="1000" onClick={(e) => handleSpecific(e)}>
                                <i className="far fa-plus"></i> 1,000
                            </button>
                        </li>
                        <li>
                            <button type="button" className="sec_btn sm_btn" value="10000" onClick={(e) => handleSpecific(e)}>
                                <i className="far fa-plus"></i> 10,000
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="attachment_items">
                    <div className="attachment_items_comment" style={{ display: isComment ? "block" : "none" }}>
                        <textarea
                            name="additional_finance_comment"
                            id=""
                            cols="30"
                            rows="10"
                            className="form_input"
                            placeholder={adminLanguageData?.common_finance_module?.modals_comment_textarea_placeholder?.value}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <ul>
                        <li>
                            <NextTooltip title={adminLanguageData?.common_finance_module?.modals_attach_image_tooltip?.value}>
                                <div className="sec_btn sm_btn">
                                    <input type="file" name="attach_proof" id="attach_proof" accept="image/jpg, image/png, image/jpeg" onChange={handleFileChange} />
                                    <label htmlFor="attach_proof">
                                        <i className="far fa-images"></i>
                                    </label>
                                </div>
                            </NextTooltip>
                        </li>
                        <li>
                            <NextTooltip title={adminLanguageData?.common_finance_module?.modals_add_a_comment_tooltip?.value}>
                                <button className="sec_btn sm_btn" type="button" onClick={() => setIsComment(!isComment)}>
                                    <i className="far fa-comment"></i>
                                </button>
                            </NextTooltip>
                        </li>
                    </ul>

                    <div className="attach_proof_preview_wp" style={{ display: uploadImage ? "block" : "none" }}>
                        <div className="attach_proof_preview">
                            {uploadImage && !errorMessage && (
                                <>
                                    <Image src={image} alt="attach proof" width={100} height={100} />
                                    <button type="button" className="finance-image-preview-close close" onClick={previewHandleClose}>
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                {(!uploadImage || errorMessage) && (
                    <p className="info_msg" style={{ display: "block" }}>
                        * {adminLanguageData?.common_finance_module?.modals_image_validation_message_1?.value} <br />*{" "}
                        {adminLanguageData?.common_finance_module?.modals_image_validation_message_2?.value}
                    </p>
                )}
                <p className="error-msg" style={{ display: errorMessage ? "block" : "none" }}>
                    {errorMessage}
                </p>
                <p className="success-msg" style={{ display: successMessage ? "block" : "none" }}>
                    {successMessage}
                </p>
                <div className="modal_footer">
                    <button type="submit" className="sec_btn">
                        {adminLanguageData?.common_date_time_label?.submit_button_text?.value}
                    </button>
                    <span className="load-more" style={{ display: loading ? "inline-block" : "none" }}>
                        <i className="fad fa-spinner-third fa-spin ajax-loader"></i>
                    </span>
                </div>
            </form>
        </AdminModal>
    );
};

export default DiscountModal;
