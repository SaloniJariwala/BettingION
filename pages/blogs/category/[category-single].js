import { useRouter } from "next/router";
import FrontLayout from "@/components/frontend/FrontLayout";
import Image from "next/image";
import { Col, Row } from "react-bootstrap";
import BannerImage from "@/frontend/images/casino_banner_bg.jpg";
import Button from "@/components/frontend/UI/Button";
import Link from "next/link";
import { useState } from "react";
import searchIcon from "@/frontend/images/search.svg";
import closeIcon from "@/frontend/images/close_icon.svg";
import Loader from "@/components/admin/UI/Loader";
import axios from "axios";
import { useEffect } from "react";
import sha1 from "sha1";
import { htmlToText } from "html-to-text";
import { LanguageState } from "@/context/FrontLanguageProvider";

const CategorySingle = () => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const [notFound, setNotFound] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalPost, setTotalPost] = useState();
    const [blogData, setBlogData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [categoryErrorMessage, setCategoryErrorMessage] = useState("");
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState("");

    useEffect(() => {
        const categories = window.location.pathname?.split("/");
        const categorySlug = categories[categories?.length - 1];
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-category/blog-category-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${
                    process.env.NEXT_PUBLIC_CASINO
                }&authKey=${authkey}&remoteId=${JSON.parse(localStorage.getItem("User"))?.userId}`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setCategories(response.data?.data);

                    const currentCategory = response.data?.data?.filter((category) => category?.slug === categorySlug);
                    setCategory(currentCategory.at(0));
                } else {
                    setCategoryErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                setCategoryErrorMessage(error.message);
            });
    }, [router.asPath]);

    const getPosts = () => {
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        const categories = window.location.pathname?.split("/");
        const categorySlug = categories[categories?.length - 1];

        setLoading(true);

        let url = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/blog-post-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
            JSON.parse(localStorage.getItem("User"))?.remoteId
        }&authKey=${authkey}&page=${page}&limit=5&category=${categorySlug}`;
        axios
            .get(url)
            .then((response) => {
                if (response.data?.status === 200) {
                    if (response.data?.data?.length > 0) {
                        setBlogData((prev) => [...prev, ...response.data?.data]);
                        setTotalPost(response.data?.totalPosts);
                    } else {
                        setNotFound(languageData?.blog_page?.no_post_found_message?.value);
                    }
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

    const getFormattedDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = date?.split("T")[0];
        const newDate = new Date(date);
        return `${newDate?.getDate()} ${months[newDate?.getMonth()]} ${newDate?.getFullYear()}`;
    };

    useEffect(() => {
        if (!router.asPath?.includes("[category-single]")) {
            getPosts();
        }
    }, [page, router.asPath]);

    return (
        <FrontLayout>
            <section className="inner_banner">
                <div className="banner_bg">
                    <Image src={BannerImage} alt="Banner Image" fill objectFit="cover" />
                </div>
                <Row>
                    <Col lg={12}>
                        <div className="inner_banner_text">
                            <h1 className="h1_title">Category: {category?.name}</h1>
                        </div>
                    </Col>
                </Row>
            </section>

            <div className="blog_content blog_search_content">
                <div className="blog_listing">
                    {errorMessage ? (
                        <div className="error-msg player-bet-won mt_20" style={{ display: errorMessage && "block" }}>
                            {errorMessage}
                        </div>
                    ) : blogData?.length === 0 ? (
                        <div className="text_center">
                            <h2 className="text-center">{notFound}</h2>
                        </div>
                    ) : (
                        <>
                            {blogData?.map((item) => {
                                let content = htmlToText(item?.content).slice(0, 150);
                                if (htmlToText(item?.content)?.length > 150) {
                                    content += `...`;
                                }
                                if (content?.length > 0) {
                                    content += `<a href=/blogs/${item?.slug} className="button_link" title=${languageData?.blog_page?.read_more_text?.value}>${languageData?.blog_page?.read_more_text?.value}</a>`;
                                }
                                return (
                                    <div className="blog_listing_box" key={item?.id}>
                                        {item?.blogImage && (
                                            <div className="blog_listing_box_img">
                                                <Link href={`/blogs/${item?.slug}`}>
                                                    <Image src={item?.blogImage} alt={item?.title} width={1200} height={600} />
                                                </Link>
                                            </div>
                                        )}
                                        <div className="blog_listing_box_content">
                                            <div className="blog_post_on">{getFormattedDate(item?.publishDate)}</div>
                                            <Link href={`/blogs/${item?.slug}`}>
                                                <h2 className="h3_title">{item?.title}</h2>
                                            </Link>

                                            <p
                                                dangerouslySetInnerHTML={{
                                                    __html: content,
                                                }}
                                            ></p>
                                        </div>
                                    </div>
                                );
                            })}
                            {blogData?.length < totalPost && !loading && (
                                <div className="text_center">
                                    <Button size="sm" type="button" onClick={() => setPage((prev) => prev + 1)}>
                                        {languageData?.blog_page?.load_more_button?.value}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                    {loading && <Loader />}
                </div>
                {/* </div> */}

                <div className="blog_sidebar">
                    <form
                        className="search_form mb_20"
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.push(`/blog?search=${search}`);
                        }}
                    >
                        <div className="search_form_input_wp ">
                            <div className="search_form_input">
                                <input type="text" name="search" className="form_input" placeholder="Search" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} />
                                {search && (
                                    <button
                                        type="button"
                                        className="close_btn"
                                        onClick={() => {
                                            setSearch("");
                                        }}
                                    >
                                        <Image loading="lazy" quality={50} src={closeIcon} alt="Close" />
                                    </button>
                                )}
                                {/* {searchLoading && <Loader />} */}
                                <button type="submit" className="search_btn">
                                    <Image loading="lazy" quality={50} src={searchIcon} alt="Search" />
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="blog_sidebar_category">
                        <h3 className="h3_title">{languageData?.blog_page?.category?.value}</h3>

                        {categoryErrorMessage ? (
                            <div className="error-msg player-bet-won mt_20" style={{ display: errorMessage && "block" }}>
                                {errorMessage}
                            </div>
                        ) : (
                            <ul>
                                {categories?.map((item) => (
                                    <li key={item?.id}>
                                        <Link
                                            href={`/blogs/category/${item?.slug}`}
                                            onClick={() => {
                                                setBlogData([]);
                                            }}
                                            title={item?.name}
                                            className={`${item?.slug === category?.slug ? "active-category" : ""}`}
                                        >
                                            {item?.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </FrontLayout>
    );
};

export default CategorySingle;
