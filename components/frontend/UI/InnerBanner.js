import Image from "next/image";
import CasinoShape from "@/frontend/images/casino_banner_bg.jpg";

const InnerBanner = (props) => {
    return (
        <div className="casino_banner">
            <div className="casino_banner_text">
                <h1
                    dangerouslySetInnerHTML={{
                        __html: props.title,
                    }}
                ></h1>
                <p
                    dangerouslySetInnerHTML={{
                        __html: props.content,
                    }}
                ></p>
            </div>
            <div className="casino_banner_img">
                <Image loading="lazy" src={CasinoShape} alt="Casino Shape" />
            </div>
        </div>
    );
};

export default InnerBanner;
