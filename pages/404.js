import Image from "next/image";
import FrontLayout from "@/components/frontend/FrontLayout";
import Button from "@/components/frontend/UI/Button";
import errorImage from "@/frontend/images/error.svg";
import { LanguageState } from "@/context/FrontLanguageProvider";

const ErrorPage = () => {
    const { languageData } = LanguageState();
    return (
        <FrontLayout>
            <section className="error_page">
                {/* <h1 className="h1_title">404</h1> */}
                <Image loading="lazy" src={errorImage} alt="404" />
                <h4 className="h4_title">{languageData?.not_found_page?.not_found_page_title?.value}</h4>
                <p>{languageData?.not_found_page?.not_found_message?.value}</p>
                <Button href="/" size="sm">
                    {languageData?.not_found_page?.back_to_home_button?.value || "Back To Home"}
                </Button>
            </section>
        </FrontLayout>
    );
};

export default ErrorPage;
