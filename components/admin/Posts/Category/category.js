import { useState } from "react";
import sha1 from "sha1";
import axios from "axios";
import CategoryModal from "../../Modals/CategoryModal";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

const CategoryList = ({ category, refreshList }) => {
    const { adminLanguageData } = AdminLanguageState();
    const [categoryModal, setCategoryModal] = useState(false);
    const [categoryAction, setCategoryAction] = useState("");

    const categoryActionHandler = (action, categoryId = 0, category = {}) => {
        const categoryAction = {
            action: action,
            categoryId: categoryId,
            category: category,
        };
        setCategoryAction(categoryAction);
        setCategoryModal(true);
    };

    const handleDeleteCategory = (category) => {
        const confirmStatus = confirm(`Are you sure, ${category?.name} category will be deleted!`);
        if (!confirmStatus) return;

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .put(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/delete-category?token=${
                    process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${
                    JSON.parse(localStorage?.getItem("User"))?.userId
                }&categoryId=${category?.id}`
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
            <div className={`slider_main_accordion`}>
                <div className="table_btn_group">
                    <ul>
                        <li>
                            <button
                                type="button"
                                onClick={() => categoryActionHandler("edit", category?.id, category)}>
                                <i className="far fa-pencil-alt"></i>{" "}
                                {adminLanguageData?.category_page?.edit?.value}
                            </button>
                        </li>
                        <li>
                            <button type="button" onClick={() => handleDeleteCategory(category)}>
                                <i className="far fa-trash-alt"></i>{" "}
                                {adminLanguageData?.category_page?.delete?.value}
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="h5_title slider_main_accordion_title">
                    <b>
                        <span>
                            {category?.name}
                            <span>
                                <i className="far fa-link"></i>
                                {category?.slug}
                            </span>
                        </span>
                    </b>
                </div>
            </div>
            <CategoryModal
                setShow={setCategoryModal}
                show={categoryModal}
                refreshList={refreshList}
                action={categoryAction}
            />
        </>
    );
};

export default CategoryList;
