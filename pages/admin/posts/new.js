import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import sha1 from "sha1";
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { useRouter } from "next/router";
import slugify from "slugify";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("react-draft-wysiwyg").then((mod) => mod.Editor), { ssr: false });
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import useGetConfig from "@/hooks/use-getConfig";

const currentDateTime = () => {
    const now = new Date();
    const dateTime = `${now?.getFullYear()}-${now?.getMonth() + 1 > 9 ? now?.getMonth() + 1 : "0" + (now?.getMonth() + 1)
        }-${now?.getDate() > 9 ? now?.getDate() : "0" + now?.getDate()}T${now?.getHours() > 9 ? now?.getHours() : "0" + now?.getHours()
        }:${now?.getMinutes() > 9 ? now?.getMinutes() : "0" + now?.getMinutes()}:${now?.getSeconds() > 9 ? now?.getSeconds() : "0" + now?.getSeconds()
        }Z`;
    return dateTime;
};

const CreatePosts = (props) => {
    const getConfig = useGetConfig();
    const methods = useForm();
    const router = useRouter();
    const {
        formState: { errors },
    } = methods;
    const { adminLanguageData } = AdminLanguageState();
    const [uploadImage, setUploadImage] = useState(false);
    const [uploadImageBlog, setUploadImageBlog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [imageErrorMessage, setImageErrorMessage] = useState("");
    const [imageFile, setImageFile] = useState();
    const [blogImageFile, setBlogImageFile] = useState("");
    const [image, setImage] = useState();
    const [imageBlog, setImageBlog] = useState();
    const [currencies, setCurrencies] = useState();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [publishOnStatus, setPublishOnStatus] = useState(false);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [isNotAccessible, setIsNotAccessible] = useState(true);

    const languages = [{ value: "en", label: adminLanguageData?.create_post_page?.language_label?.value }];

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("User"));
        ["administrator"].includes(user?.accountType) ? setIsNotAccessible(true) : setIsNotAccessible(false);
    }, []);

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/blog-category-list?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                }`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    let availableCategories = [];

                    response?.data?.data.map((category) => {
                        availableCategories = [
                            ...availableCategories,
                            {
                                value: category.id,
                                label: category.name,
                                isChecked: false,
                            },
                        ];
                    });

                    setCategories(availableCategories);
                } else {
                    setCategories([]);
                }
            })
            .catch((error) => {
                console.log(`Error: ${error}`);
                setCategories([]);
            })
            .finally(() => { });
    }, []);

    const handleFileChangeBlog = (event) => {
        setImageErrorMessage("");
        const file = event.target.files[0];
        if (file?.size > 1000000) {
            setImageErrorMessage(adminLanguageData?.create_post_page?.file_error_message?.value);
            return;
        }
        setBlogImageFile(file);
        setUploadImageBlog(true);
        const reader = new FileReader();
        reader.onload = (event) => {
            setImageBlog(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const previewHandleCloseBlog = () => {
        setImage(false);
        setUploadImageBlog(false);
    };

    const categorySetHandler = (index, checked) => {
        const allCategories = [...categories];
        allCategories[index].isChecked = checked;
        setCategories(allCategories);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()));

        const publishOn = publishOnStatus
            ? methods.getValues("publish_date")
                ? methods.getValues("publish_date")
                : currentDateTime()
            : currentDateTime();
        const slug = methods.getValues("slug") ? methods.getValues("slug") : methods.getValues("title");

        let selectedCategories = [];
        categories.map((category) => {
            if (category.isChecked) {
                selectedCategories = [...selectedCategories, category?.value];
            }
        });

        let payload = {
            title: methods.getValues("title"),
            slug: slugify(slug, { lower: true }),
            currency: methods.getValues("currency")?.value,
            content: htmlContent,
            language: methods.getValues("language")?.value,
            status: methods.getValues("status") === "true",
            categories: selectedCategories,
            blogImage: blogImageFile,
            publishDate: publishOn,
            // coverImage: imageFile,
            // category: selectedCategories,
        };

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        const blogPostUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/create-blog-post?token=${process.env.NEXT_PUBLIC_TOKEN
            }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
            }`;

        let blogPost;

        if (/*image || */ imageBlog) {
            blogPost = [
                blogPostUrl,
                payload,
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type": "multipart/form-data",
                    },
                },
            ];
        } else {
            blogPost = [blogPostUrl, payload];
        }

        await axios
            .post(...blogPost)
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage(adminLanguageData?.create_post_page?.post_added_success_message?.value);
                } else {
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Head>
                <meta name="title" content={props.title} />
                <meta name="description" content={props.description} />
            </Head>
            <AdminLayout>
                <div className="create_rewards_sec">
                    <div className="title_bar">
                        <Row className="align-items-center">
                            <Col lg={6}>
                                <div className="title">
                                    <Title>{adminLanguageData?.create_post_page?.page_title?.value}</Title>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        {!isNotAccessible ? (
                            <Col lg={12}>
                                <div className="use_main_form">
                                    <p className="error-msg" style={{ display: "block" }}>
                                        {
                                            adminLanguageData?.common_restriction_message
                                                ?.page_not_accessible_message?.value
                                        }
                                    </p>
                                </div>
                            </Col>
                        ) : (
                            <>
                                <FormProvider {...methods}>
                                    <form
                                        method="POST"
                                        className="create_rewards_form create_rewards_box"
                                        onSubmit={methods.handleSubmit(handleSubmit)}>
                                        <Row>
                                            <Col md={12} xl={9} className="order-xl-1 order-2">
                                                <div className="create_rewards_form_title">
                                                    <h5 className="h5_title">
                                                        {
                                                            adminLanguageData?.create_post_page
                                                                ?.post_details_title?.value
                                                        }
                                                    </h5>
                                                </div>

                                                <Row>
                                                    <Col lg={12}>
                                                        <div className="form_input_wp">
                                                            <label>
                                                                {
                                                                    adminLanguageData?.create_post_page
                                                                        ?.title_input_label?.value
                                                                }
                                                            </label>
                                                            <input
                                                                name="name"
                                                                type="text"
                                                                className={`form_input ${errors?.title ? "input_error" : ""
                                                                    }`}
                                                                autoComplete="off"
                                                                {...methods.register("title", {
                                                                    required:
                                                                        adminLanguageData?.create_post_page
                                                                            ?.title_required_error?.value,
                                                                })}
                                                            />
                                                            {errors?.title && (
                                                                <p className="player-bet-loss">
                                                                    {errors?.title?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                    <Col lg={12}>
                                                        <div className="form_input_wp form-element">
                                                            <label htmlFor="currency_type">
                                                                {
                                                                    adminLanguageData?.create_post_page
                                                                        ?.slug_input_label?.value
                                                                }
                                                            </label>
                                                            <div className="position-relative">
                                                                <input
                                                                    name="name"
                                                                    type="text"
                                                                    className={`form_input ${errors?.slug ? "input_error" : ""
                                                                        }`}
                                                                    autoComplete="off"
                                                                    {...methods.register(
                                                                        "slug" /*, {
                                                                required: "Slug is required",
                                                            }*/
                                                                    )}
                                                                />
                                                                {errors?.slug && (
                                                                    <p className="player-bet-loss">
                                                                        {errors?.slug?.message}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    <Col lg={12}>
                                                        <div className="form_input_wp">
                                                            <label>
                                                                {
                                                                    adminLanguageData?.create_post_page
                                                                        ?.content_input_label?.value
                                                                }
                                                            </label>
                                                            <Editor
                                                                editorState={editorState}
                                                                onEditorStateChange={setEditorState}
                                                                toolbarClassName="toolbarClassName"
                                                                wrapperClassName="language_editor_wrapper"
                                                                editorClassName="language_editor"
                                                            />

                                                            <textarea
                                                                className="form_input mt_10"
                                                                disabled
                                                                value={draftToHtml(
                                                                    convertToRaw(
                                                                        editorState.getCurrentContent()
                                                                    )
                                                                )}
                                                            />
                                                            {errors?.content && (
                                                                <p className="player-bet-loss">
                                                                    {errors?.content?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </Col>

                                            <Col md={4} xl={3} className="mx-auto order-xl-2 order-1">
                                                <div className="reward_preview create_rewards_box mb_30 submit_box_container">
                                                    <div className="form_input_wp form-element date_input_wrapper">
                                                        {publishOnStatus ? (
                                                            <>
                                                                <label>
                                                                    {
                                                                        adminLanguageData?.create_post_page
                                                                            ?.publish_on_text?.value
                                                                    }{" "}
                                                                    &emsp;
                                                                    <u
                                                                        onClick={() => {
                                                                            setPublishOnStatus(false);
                                                                        }}>
                                                                        {
                                                                            adminLanguageData
                                                                                ?.create_post_page
                                                                                ?.cancel_text?.value
                                                                        }
                                                                    </u>
                                                                </label>
                                                                <div className="position-relative">
                                                                    <input
                                                                        type="datetime-local"
                                                                        id="publish_time"
                                                                        name="publish_time"
                                                                        className="form_input"
                                                                        {...methods.register("publish_date")}
                                                                    />
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <label className="mb_0">
                                                                    {
                                                                        adminLanguageData?.create_post_page
                                                                            ?.publish_immediately_text?.value
                                                                    }{" "}
                                                                    &emsp;
                                                                    <u
                                                                        onClick={() => {
                                                                            setPublishOnStatus(true);
                                                                        }}>
                                                                        {
                                                                            adminLanguageData
                                                                                ?.create_post_page?.edit_text
                                                                                ?.value
                                                                        }
                                                                    </u>
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>

                                                    <div className="form_input_wp form-element">
                                                        <label>
                                                            {
                                                                adminLanguageData?.create_post_page
                                                                    ?.status_label?.value
                                                            }
                                                        </label>
                                                        <div className="position-relative">
                                                            <select
                                                                name="status"
                                                                className={`form_input ${errors?.status ? "input_error" : ""
                                                                    }`}
                                                                {...methods.register("status", {
                                                                    required:
                                                                        adminLanguageData?.create_post_page
                                                                            ?.status_required_error?.value,
                                                                })}>
                                                                <option value={true}>
                                                                    {
                                                                        adminLanguageData?.create_post_page
                                                                            ?.publish_option_text?.value
                                                                    }
                                                                </option>
                                                                <option value={false}>
                                                                    {
                                                                        adminLanguageData?.create_post_page
                                                                            ?.draft_option_text?.value
                                                                    }
                                                                </option>
                                                            </select>
                                                            <i className="far fa-angle-down"></i>
                                                        </div>
                                                    </div>

                                                    <div className="submit_box_container_button">
                                                        <button
                                                            className="sec_btn"
                                                            onClick={() => {
                                                                if (/*!image || !imageFile || */ !imageBlog) {
                                                                    // setImageErrorMessage("Image is required");
                                                                }
                                                            }}>
                                                            {
                                                                adminLanguageData?.create_post_page
                                                                    ?.Upload_post_button?.value
                                                            }
                                                        </button>
                                                    </div>

                                                    <div className="mt_20">
                                                        {loading && (
                                                            <span
                                                                className="load-more"
                                                                style={{
                                                                    display: loading ? "block" : "none",
                                                                }}>
                                                                <i className="fad fa-spinner-third fa-spin"></i>
                                                            </span>
                                                        )}
                                                        <p
                                                            className={errorMessage && "error-msg mb_0"}
                                                            style={{
                                                                display: errorMessage ? "block" : "none",
                                                            }}>
                                                            {errorMessage}
                                                        </p>
                                                        <p
                                                            className={successMessage && "success-msg mb_0"}
                                                            style={{
                                                                display: successMessage ? "block" : "none",
                                                            }}>
                                                            {successMessage}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="reward_preview create_rewards_box mb_30">
                                                    <label>
                                                        {
                                                            adminLanguageData?.create_post_page
                                                                ?.category_input_title?.value
                                                        }
                                                    </label>
                                                    <div className="category_checkbox">
                                                        {categories?.map((category, index) => {
                                                            return (
                                                                <div
                                                                    className="form_checkbox"
                                                                    key={category?.value}>
                                                                    <div className="form_input_wp">
                                                                        <div key={category?.value}>
                                                                            <input
                                                                                type="checkbox"
                                                                                name="transaction_checkbox"
                                                                                value={category?.value}
                                                                                className="form-check-input"
                                                                                id={category?.value + "-id"}
                                                                                onChange={(event) => {
                                                                                    categorySetHandler(
                                                                                        index,
                                                                                        event.target.checked
                                                                                    );
                                                                                }}
                                                                            />

                                                                            <label
                                                                                className="form-check-label"
                                                                                htmlFor={
                                                                                    category?.value + "-id"
                                                                                }>
                                                                                {category?.label}
                                                                            </label>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="reward_preview create_rewards_box mb_30">
                                                    <div className="form_input_wp">
                                                        <label htmlFor="currency">
                                                            {
                                                                adminLanguageData?.create_post_page
                                                                    ?.currency_label?.value
                                                            }
                                                        </label>

                                                        <Select
                                                            className={`select_box form_input ${errors?.currency ? "input_error" : ""
                                                                }`}
                                                            classNamePrefix="react-select"
                                                            theme={(theme) => ({
                                                                ...theme,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    primary: "#fff",
                                                                    primary25: "#bd57fb",
                                                                    neutral0: "black",
                                                                },
                                                            })}
                                                            {...methods.register("currency")}
                                                            onChange={(value) => {
                                                                methods.setValue("currency", value);
                                                                methods.clearErrors("currency");
                                                            }}
                                                            options={getConfig?.optionsData?.paymentCurrenciesOptions}
                                                        />
                                                        {errors?.currency && (
                                                            <p className="player-bet-loss">
                                                                {errors?.currency?.message}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="form_input_wp">
                                                        <label>
                                                            {
                                                                adminLanguageData?.create_post_page
                                                                    ?.language_label?.value
                                                            }
                                                        </label>

                                                        <Select
                                                            className={`select_box form_input ${errors?.language ? "input_error" : ""
                                                                }`}
                                                            classNamePrefix="react-select"
                                                            theme={(theme) => ({
                                                                ...theme,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    primary: "#fff",
                                                                    primary25: "#bd57fb",
                                                                    neutral0: "black",
                                                                },
                                                            })}
                                                            {...methods.register(
                                                                "language" /*, {
                                                        required: "Language is required",
                                                    }*/
                                                            )}
                                                            onChange={(value) => {
                                                                methods.setValue("language", value);
                                                                if (methods.getValues("language") !== "") {
                                                                    methods.clearErrors("language");
                                                                }
                                                            }}
                                                            options={languages}
                                                        />
                                                        {errors?.language && (
                                                            <p className="player-bet-loss">
                                                                {errors?.language?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="reward_preview create_rewards_box">
                                                    <div className="create_rewards_form_title">
                                                        <h5 className="h5_title">
                                                            {
                                                                adminLanguageData?.create_post_page
                                                                    ?.blog_image_title?.value
                                                            }
                                                        </h5>
                                                    </div>
                                                    <div
                                                        className="attach_proof_preview_wp"
                                                        style={{
                                                            display: uploadImageBlog ? "block" : "none",
                                                        }}>
                                                        <div className="attach_proof_preview">
                                                            {uploadImageBlog && (
                                                                <>
                                                                    <div className="reward_img">
                                                                        <Image
                                                                            src={imageBlog}
                                                                            alt="Reward Image"
                                                                            width={350}
                                                                            height={350}
                                                                        />
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="finance-image-preview-close close"
                                                                        onClick={previewHandleCloseBlog}>
                                                                        <span aria-hidden="true">×</span>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="attachment_items">
                                                        <ul>
                                                            <li>
                                                                <NextTooltip title="Attach image">
                                                                    <div className="sec_btn">
                                                                        <input
                                                                            type="file"
                                                                            name="attach_proof"
                                                                            id="attach_proofBlog"
                                                                            accept="image/jpg, image/png, image/jpeg"
                                                                            onChange={handleFileChangeBlog}
                                                                        />
                                                                        <label htmlFor="attach_proofBlog">
                                                                            <i className="far fa-images"></i>
                                                                        </label>
                                                                        {
                                                                            adminLanguageData
                                                                                ?.create_post_page
                                                                                ?.upload_image_button?.value
                                                                        }
                                                                    </div>
                                                                </NextTooltip>
                                                            </li>
                                                        </ul>
                                                        {imageErrorMessage && (
                                                            <p
                                                                className="text-center player-bet-loss"
                                                                style={{
                                                                    display: imageErrorMessage
                                                                        ? "block"
                                                                        : "none",
                                                                }}>
                                                                {imageErrorMessage}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </FormProvider>
                            </>
                        )}
                    </Row>
                </div>
            </AdminLayout>
        </>
    );
};

export async function getServerSideProps() {
    return {
        props: {
            title: "Create Posts",
            description: "Create Posts",
        },
    };
}

export default CreatePosts;
