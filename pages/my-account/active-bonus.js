import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import FrontLayout from "@/components/frontend/FrontLayout";
import Button from "@/components/frontend/UI/Button";
import sha1 from 'sha1';
import BonusCodeSection from "@/components/frontend/ActiveBonus/BonusCode";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import BonusInfoModal from "@/components/frontend/Modal/BonusInfoModal";
import { LanguageState } from "@/context/FrontLanguageProvider";

const ActiveBonus = () => {
    const router = useRouter();
    const { languageData } = LanguageState();
    const [loadingData, setLoadingData] = useState(true);
    const [bonuses, setBonuses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('Required Data Missing');
    const [refresh, setRefresh] = useState(false);
    const [show, setShow] = useState(false);
    const [bonus, setBonus] = useState();

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/list-activate-bonus-code-user?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&remoteId=${JSON.parse(localStorage.getItem("User"))?.remoteId}&authKey=${authKey}`)
            .then((response) => {
                if (response.data?.status === 200) {
                    setBonuses(response.data?.data);
                }
            })
            .catch((error) => {
                console.log(error?.message);
            })
            .finally(() => {
                setLoadingData(false);
            });
    }, [refresh]);

    /**
     * Refresh data on load
     */
    const refreshData = () => {
        setRefresh(prev => !prev);
    };

    /**
     * View bonus information
     */
    const bonusInformationHandler = (bonus) => {
        setBonus(bonus);
        setShow(true);
    }

    /**
     * Get language wise translation data
     * 
     * @param {*} bonus 
     * @returns Object
     */
    const languageTranslations = (bonus) => {
        let bonusLanguages = {};
        console.log(bonus)
        if (bonus?.translation) {
            bonus?.translation?.map((lang) => {
                bonusLanguages = {
                    ...bonusLanguages,
                    [lang?.language]: lang
                };
            });
        }

        // set available translation locale
        if (router?.locale in bonusLanguages) {
            return bonusLanguages?.[router?.locale];
        } else {
            if (router?.locale === 'en') {
                return bonusLanguages?.es;
            } else if (router?.locale === 'es') {
                return bonusLanguages?.en;
            }
        }
    }

    return (
        <FrontLayout>
            <div className="inner-page-text">
                <Container>
                    <Row className="m-auto justify-content-center">
                        <Col lg={12}>
                            <h2 className="h2_title text_center">{languageData?.active_bonus_page?.active_bonus_page_title?.value || "Active Bonus"}</h2>

                            <div className="active_bonus">
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="active_bonus_box">
                                            <h2 className="text_center">
                                                {languageData?.active_bonus_page?.bonus?.value} <i className="far fa-percentage"></i>
                                            </h2>

                                            <div className="casino-table-wp">
                                                <table className="custom_table">
                                                    <thead>
                                                        <tr>
                                                            <th>{languageData?.active_bonus_page?.table_cell_promocode?.value || "Promocode"}</th>
                                                            <th>{languageData?.active_bonus_page?.table_cell_Title?.value || "Title"}</th>
                                                            <th>{languageData?.active_bonus_page?.table_cell_status?.value || "Status"}</th>
                                                            <th>{languageData?.active_bonus_page?.table_cell_details?.value || "Details"}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {bonuses?.length !== 0 ? (
                                                            <tr>
                                                                <td>{bonuses?.code}</td>
                                                                <td>{languageTranslations(bonuses)?.title}</td>
                                                                <td style={{ textTransform: "capitalize" }}>{bonuses?.status ? "active" : "expired"}</td>
                                                                <td className="text_center">
                                                                    <i className="far fa-external-link" onClick={() => {
                                                                        bonusInformationHandler(bonus);
                                                                    }}></i>
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            <tr>
                                                                <td className="text_center" colSpan={4}>
                                                                    {loadingData ? (
                                                                        <span
                                                                            className="load-more"
                                                                            style={{
                                                                                display: loadingData ? "block" : "none",
                                                                                textAlign: "center",
                                                                                margin: 0,
                                                                                fontSize: "25px",
                                                                            }}>
                                                                            <i className="fad fa-spinner-third fa-spin"></i>
                                                                        </span>
                                                                    ) : (
                                                                        'No active bonus found'
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        <BonusInfoModal show={show} setShow={setShow} bonus={bonuses} modalFor='active' />

                                        {/* <BonusCodeSection refreshData={refreshData} /> */}
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </FrontLayout>
    );
};

export default ActiveBonus;
