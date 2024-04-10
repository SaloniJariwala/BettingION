import FrontLayout from "@/components/frontend/FrontLayout";
import Image from "next/image";
import BannerImage from "@/frontend/images/casino_banner_bg.jpg";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import sha1 from "sha1";
import Loader from "@/components/admin/UI/Loader";
import { LanguageState } from "@/context/FrontLanguageProvider";

const BlogSingle = () => {
    const { languageData } = LanguageState();
    const [postData, setPostData] = useState();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const slug = window.location.pathname.split("/")[2];
        const authkey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);
        setLoading(true);
        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/blog-post/get-blog-post?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${
                    JSON.parse(localStorage.getItem("User"))?.remoteId
                }&authKey=${authkey}&slug=${slug}`
            )
            .then((response) => {
                if (response.data?.status) {
                    setPostData(response.data?.data);
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
    }, []);

    const getFormattedDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        date = date?.split("T")[0];
        const newDate = new Date(date);
        return `${newDate?.getDate()} ${months[newDate?.getMonth()]} ${newDate?.getFullYear()}`;
    };

    return (
        <FrontLayout>
            <section className="blog_single">
                <Container>
                    <Row>
                        {errorMessage ? (
                            <div className="error-msg player-bet-won mt_20" style={{ display: errorMessage && "block" }}>
                                {errorMessage}
                            </div>
                        ) : loading ? (
                            <div className="blog_loader">
                                <Loader />
                            </div>
                        ) : (
                            <Col lg={10} className="m-auto">
                                <div className="blog_single_content_top_info">
                                    <div className="blog_post_on">{postData?.blogImage && getFormattedDate(postData?.publishDate)}</div>
                                    <h1 className="h2_title">{postData?.title}</h1>
                                    <div className="blog_post_category">
                                        <ul>
                                            {postData?.categories?.map((item) => (
                                                <li key={item?.id}>
                                                    <Link href={`/blogs/category/${item?.slug}`} title={item?.name}>
                                                        {item?.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="blog_single_image">{postData?.blogImage && <Image src={postData?.blogImage} alt="Blog Title" width={1095} height={545} />}</div>
                                <div className="blog_single_content">
                                    <p dangerouslySetInnerHTML={{ __html: postData?.content }}></p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </Container>
            </section>
        </FrontLayout>
    );
};

export default BlogSingle;
