import { useEffect, useState } from "react";
import AdminModal from "../AdminModal";
import sha1 from "sha1";
import axios from "axios";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const CategoryModal = ({ show, setShow, refreshList, action }) => {
    const { adminLanguageData } = AdminLanguageState();
    const modalTitle = {
        add: adminLanguageData?.category_page?.add_button?.value,
        edit: adminLanguageData?.category_page?.edit?.value,
    };
    const [categoryName, setCategoryName] = useState("");
    const [categorySlug, setCategorySlug] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!show || action?.action !== "edit") return;

        setCategoryName(action?.category?.name);
        setCategorySlug(action?.category?.slug);
    }, [show]);

    const handleClose = () => {
        if (successMessage) refreshList();

        setErrorMessage("");
        setSuccessMessage("");
        setCategoryName("");
        setCategorySlug("");
        setShow(false);
    };

    const handleUpdateCategory = () => {
        if (!categoryName) {
            setErrorMessage("Category Name is required");
            return;
        }

        setErrorMessage("");
        setSuccessMessage("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/update-blog-category?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&categoryId=${
                    action?.category?.id
                }&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&slug=${categorySlug}&name=${categoryName}`
            )

            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Category updated successfully!");
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally();
    };

    const handleAddCategory = (event) => {
        if (!categoryName) {
            setErrorMessage("Category Name is required");
            return;
        }
        setErrorMessage("");
        setSuccessMessage("");
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios
            .post(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/create-blog-category?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authKey}&name=${categoryName}&slug=${categorySlug}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Category added successfully!");
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
            <h3 className="h3-title modal_title">
                {modalTitle[action?.action]}{" "}
                {adminLanguageData?.create_post_page?.category_input_title?.value}
            </h3>
            <div className="form_input_wp">
                <label>{adminLanguageData?.category_page?.category_name?.value}</label>
                <input
                    name="title"
                    type="text"
                    className="form_input"
                    autoComplete="off"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                />
            </div>

            <div className="form_input_wp">
                <label>{adminLanguageData?.category_page?.slug?.value}</label>
                <input
                    name="slug"
                    type="text"
                    className="form_input"
                    autoComplete="off"
                    value={categorySlug}
                    onChange={(event) => setCategorySlug(event.target.value)}
                />
            </div>

            <p className="error-msg" style={{ display: errorMessage && "block" }}>
                {errorMessage}
            </p>
            <p className="success-msg" style={{ display: successMessage && "block" }}>
                {successMessage}
            </p>

            {action?.action === "add" && !successMessage && (
                <button type="button" className="sec_btn" onClick={handleAddCategory}>
                    {adminLanguageData?.category_page?.add_button?.value}
                </button>
            )}

            {action?.action === "edit" && !successMessage && (
                <button type="button" className="sec_btn" onClick={handleUpdateCategory}>
                    {adminLanguageData?.banner_sliders_page?.update_button?.value}
                </button>
            )}
        </AdminModal>
    );
};

export default CategoryModal;
