import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
// import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Button, Col, Row } from "react-bootstrap";
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
import { convertToRaw, EditorState, convertFromHTML, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import useGetConfig from "@/hooks/use-getConfig";

const currentDateTime = () => {
    const now = new Date();
    const dateTime = `${now?.getFullYear()}-${now?.getMonth() + 1 > 9 ? now?.getMonth() + 1 : "0" + (now?.getMonth() + 1)
        }-${now?.getDate() > 9 ? now?.getDate() : "0" + now?.getDate()}T${now?.getHours() > 9 ? now?.getHours() : "0" + now?.getHours()
        }:${now?.getMinutes() > 9 ? now?.getMinutes() : "0" + now?.getMinutes()}:${now?.getSeconds() > 9 ? now?.getSeconds() : "0" + now?.getSeconds()
        }Z`;
    return dateTime;
};

const EditPost = (props) => {
    const getConfig = useGetConfig();
    const methods = useForm();
    const router = useRouter();
    const {
        formState: { errors },
    } = methods;

    const [data, setData] = useState([]);
    const [uploadImageBlog, setUploadImageBlog] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [imageErrorMessage, setImageErrorMessage] = useState("");
    const [blogImageFile, setBlogImageFile] = useState();
    const [imageBlog, setImageBlog] = useState();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currencyOption, setCurrencyOption] = useState([]);
    const [languageValue, setLanguageValue] = useState({});
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const [selectedCurrency, setSelectedCurrency] = useState();

    const languages = [{ value: "en", label: "English" }];

    useEffect(() => {
        if (!localStorage.getItem("User")) {
            router.push("/admin");
        }
    }, []);

    useEffect(() => {
        if (getConfig?.isLoading) {
            return;
        }

        setLoading(true);
        setErrorMessage("");

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/get-blog-post?token=${process.env.NEXT_PUBLIC_TOKEN
                }&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authKey}&postId=${props?.editId}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.blogImage) setUploadImageBlog(true);
                    setImageBlog(response.data?.data?.blogImage);
                    setBlogImageFile(response.data?.data?.blogImage);

                    const postData = response.data?.data;
                    setData(response.data?.data);

                    methods.setValue("title", postData?.title);
                    methods.setValue("slug", postData?.slug);
                    methods.setValue("content", postData?.content);

                    const sampleMarkup = postData?.content;
                    const blocksFromHTML = convertFromHTML(sampleMarkup);
                    const state = ContentState.createFromBlockArray(
                        blocksFromHTML.contentBlocks,
                        blocksFromHTML.entityMap,
                    );

                    setEditorState(EditorState.createWithContent(state));

                    methods.setValue("language", postData?.language);
                    methods.setValue("status", postData?.status ? 'true' : 'false');
                    methods.setValue("publish_date", postData?.publishDate?.substring(0, 16));

                    languages?.map((lang, index) => {
                        if (lang.value === postData?.language) {
                            setLanguageValue(lang);
                            methods.setValue("language", lang);
                        }
                    });

                    getConfig?.optionsData?.paymentCurrenciesOptions?.find((cur) => {
                        if (cur?.value === postData?.currency) {
                            setSelectedCurrency(cur);
                            methods.setValue("currency", cur);
                        }
                    });

                    let postCategories = Array.isArray(postData?.categories) ? postData?.categories?.map(category => category?.id) : [];

                    axios
                        .get(
                            `${process.env.NEXT_PUBLIC_API_DOMAIN
                            }/api/blog-category/blog-category-list?token=${process.env.NEXT_PUBLIC_TOKEN
                            }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
                            }`
                        )
                        .then(async (response) => {
                            if (response.data?.status === 200) {
                                let allCategories = [];

                                await response?.data?.data.map((category) => {
                                    allCategories = [
                                        ...allCategories,
                                        {
                                            value: category?.id,
                                            label: category?.name,
                                            isChecked: postCategories?.includes(category?.id)
                                        },
                                    ];
                                });

                                setCategories(allCategories);
                            } else {
                                setCategories([]);
                            }
                        })
                        .catch((error) => {
                            console.log(`Error: ${error}`);
                            setCategories([]);
                        })
                        .finally(() => { });
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
    }, [getConfig?.isLoading]);

    const handleFileChangeBlog = (event) => {
        setImageErrorMessage("");
        const file = event.target.files[0];
        if (file?.size > 4194304) {
            setImageErrorMessage("File is too large");
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
        const slug = methods.getValues("slug") ? methods.getValues("slug") : methods.getValues("title");

        let selectedCategories = [];
        categories.map(category => {
            if (category.isChecked) {
                selectedCategories = [...selectedCategories, category?.value];
            }
        });

        let payload = {
            postId: data?.id,
            title: methods.getValues("title"),
            slug: slug,
            currency: methods.getValues("currency")?.value,
            content: htmlContent,
            language: methods.getValues("language")?.value,
            status: methods.getValues("status") === 'true',
            categories: selectedCategories,
            blogImage: blogImageFile,
            publishDate: methods.getValues("publish_date"),
            // category: selectedCategories,
        };

        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        const blogPostUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/update-blog-post?token=${process.env.NEXT_PUBLIC_TOKEN
            }&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&remoteId=${JSON.parse(localStorage?.getItem("User"))?.userId
            }`;

        let blogPost = [
            blogPostUrl,
            payload,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "multipart/form-data",
                },
            },
        ];

        if (imageBlog === data?.blogImage) {
            delete payload.blogImage;
            blogPost.pop();
        } else if (imageBlog !== data?.blogImage && imageBlog === false) {
            blogPost.pop();
        }

        await axios
            .post(...blogPost)
            .then((response) => {
                if (response.data?.status === 200) {
                    setSuccessMessage("Post updated successfully!");
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

    const previewHandleCloseBlog = () => {
        setImageBlog((prev) => !prev);
        setUploadImageBlog(false);
        setImageBlog(false);
    };

    return (
        <>
            <div className="create_rewards_sec">
                <div className="title_bar">
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <div className="title">
                                <Title>Edit Post</Title>
                            </div>
                        </Col>
                        <Col lg={6} className="text-lg-end">
                            <Button href='/admin/posts' type="Button" className="sec_btn">
                                Go To Posts <i className="fal fa-list-alt"></i>
                            </Button>
                        </Col>
                    </Row>
                </div>

                <Row>
                    <FormProvider {...methods}>
                        <form
                            method="POST"
                            className="create_rewards_form create_rewards_box"
                            onSubmit={methods.handleSubmit(handleSubmit)}>
                            <Row>
                                <Col md={12} xl={9} className="order-xl-1 order-2">
                                    <div className="create_rewards_form_title">
                                        <h5 className="h5_title">Post Details</h5>
                                    </div>

                                    <Row>
                                        <Col lg={12}>
                                            <div className="form_input_wp">
                                                <label>Title</label>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    className={`form_input ${errors?.title ? "input_error" : ""
                                                        }`}
                                                    autoComplete="off"
                                                    {...methods.register("title", {
                                                        required: "Title is required",
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
                                                <label htmlFor="currency_type">Slug</label>
                                                <div className="position-relative">
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        className={`form_input ${errors?.slug ? "input_error" : ""
                                                            }`}
                                                        autoComplete="off"
                                                        {...methods.register("slug")}
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
                                                <label>Content</label>
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
                                                        convertToRaw(editorState.getCurrentContent())
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
                                            <label>Published on</label>
                                            <div className="position-relative">
                                                <input
                                                    type="datetime-local"
                                                    id="publish_time"
                                                    name="publish_time"
                                                    className="form_input"
                                                    {...methods.register("publish_date")}
                                                />
                                            </div>
                                        </div>

                                        <div className="form_input_wp form-element">
                                            <label>Status</label>
                                            <div className="position-relative">
                                                <select
                                                    name="status"
                                                    className={`form_input ${errors?.status ? "input_error" : ""}`}
                                                    {...methods.register("status")}>
                                                    <option value={'true'}>Publish</option>
                                                    <option value={'false'}>Draft</option>
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
                                                Update Post
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
                                        <label>Category</label>
                                        <div className="category_checkbox">
                                            {categories?.map((category, index) => {
                                                return (
                                                    <div className="form_checkbox" key={category?.value}>
                                                        <div className="form_input_wp">
                                                            <div key={category?.value}>
                                                                <input
                                                                    type="checkbox"
                                                                    name="transaction_checkbox"
                                                                    value={category?.value}
                                                                    className="form-check-input"
                                                                    id={category?.value + "-id"}
                                                                    checked={category?.isChecked}
                                                                    onChange={(event) => {
                                                                        categorySetHandler(index, event.target.checked);
                                                                    }}
                                                                />

                                                                <label
                                                                    className="form-check-label"
                                                                    htmlFor={category?.value + "-id"}>
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
                                            <label htmlFor="currency">Currency</label>

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
                                                    setSelectedCurrency(value);
                                                    methods.setValue("currency", value);
                                                    methods.clearErrors("currency");
                                                }}
                                                options={getConfig?.optionsData?.paymentCurrenciesOptions}
                                                value={selectedCurrency}
                                            />
                                            {errors?.currency && (
                                                <p className="player-bet-loss">{errors?.currency?.message}</p>
                                            )}
                                        </div>

                                        <div className="form_input_wp">
                                            <label>Language</label>

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
                                                value={languageValue}
                                                {...methods.register("language")}
                                                onChange={(value) => {
                                                    methods.setValue("language", value);
                                                    if (methods.getValues("language") !== "") {
                                                        methods.clearErrors("language");
                                                    }
                                                }}
                                                options={languages}
                                            />
                                            {errors?.language && (
                                                <p className="player-bet-loss">{errors?.language?.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="reward_preview create_rewards_box">
                                        <div className="create_rewards_form_title">
                                            <h5 className="h5_title">Blog Image</h5>
                                        </div>
                                        <div
                                            className="attach_proof_preview_wp"
                                            style={{ display: uploadImageBlog ? "block" : "none" }}>
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
                                                            Upload Image
                                                        </div>
                                                    </NextTooltip>
                                                </li>
                                            </ul>
                                            {imageErrorMessage && (
                                                <p
                                                    className="text-center player-bet-loss"
                                                    style={{ display: imageErrorMessage ? "block" : "none" }}>
                                                    {imageErrorMessage}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </form>
                    </FormProvider>
                </Row>
            </div>
        </>
    );
};

export default EditPost;
