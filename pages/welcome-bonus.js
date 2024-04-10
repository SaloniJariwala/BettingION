import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import sha1 from "sha1";
import axios from "axios";
import FrontLayout from "@/components/frontend/FrontLayout";
import Button from "@/components/frontend/UI/Button";
import OfferSlider from "@/components/frontend/common/OfferSlider";
import { useRouter } from "next/router";
import BonusInfoModal from "@/components/frontend/Modal/BonusInfoModal";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { LanguageState } from "@/context/FrontLanguageProvider";

const WelcomeBonus = () => {
    const { languageData } = LanguageState();
    const router = useRouter();
    const [slidesList, setSlidesList] = useState([]);
    const [offerLoading, setOfferLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [bonus, setBonus] = useState();
    const [bonuses, setBonuses] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/bonus-code/get-campaign?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&limit=100&status=true`
            )
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
    }, []);

    /**
     * Get Slider
     */
    useEffect(() => {
        const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

        axios
            .get(
                `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/slider-slide/get-slides-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}&slug=main_page&status=true`
            )
            .then((response) => {
                if (response.data?.status === 200) {
                    setSlidesList(response.data?.data);
                } else {
                    setSlidesList([]);
                }
            })
            .catch((error) => {
                setSlidesList([]);
            })
            .finally(() => {
                setOfferLoading(false);
            });
    }, []);

    /**
     * View bonus information
     */
    const bonusInformationHandler = (bonus) => {
        setBonus(bonus);
        setShow(true);
    };

    const getUrl = () => {
        if (window.localStorage.getItem("User")) {
            router.push("/my-account/deposit");
        } else {
            router.push("/login");
        }
    };

    return (
        <FrontLayout>
            <OfferSlider slides={slidesList} loading={offerLoading} />

            <div className="inner_page_text">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <div className="rich-text-body-content">
                                <p>
                                    <br></br>
                                    {languageData?.welcome_bonus_page?.welcome_bonus_page_message1?.value}
                                </p>
                                <p>{languageData?.welcome_bonus_page?.welcome_bonus_page_message2?.value}</p>

                                <div className="casino-table-wp">
                                    <table className="custom_table">
                                        <thead>
                                            <tr>
                                                <th>
                                                    {" "}
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_bonus_name?.value
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_bonus_promocode?.value
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_bonus_bonusamount?.value
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_rollover_requirements?.value
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_bonus_status?.value
                                                    }
                                                </th>
                                                <th>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_bonus_details?.value
                                                    }
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bonuses?.length !== 0 ? (
                                                bonuses?.map((bonus, index) => {
                                                    const bonusStatus = bonus?.status ? "active" : "expired";
                                                    return (
                                                        <tr key={index}>
                                                            <td>{bonus?.name}</td>
                                                            <td>{bonus?.code}</td>
                                                            <td>
                                                                {renderAmountWithCurrency(
                                                                    bonus?.bonusData?.limitToAwarded,
                                                                    bonus?.bonusData?.currency
                                                                )}
                                                            </td>
                                                            <td>
                                                                {bonus?.rolloverData?.rolloverMultiplier}X
                                                            </td>
                                                            <td style={{ textTransform: "capitalize" }}>
                                                                <span
                                                                    className={`bonus-status-${bonusStatus}`}>
                                                                    {bonusStatus}
                                                                </span>
                                                            </td>
                                                            <td className="text_center">
                                                                <i
                                                                    className="far fa-external-link"
                                                                    onClick={() => {
                                                                        bonusInformationHandler(bonus);
                                                                    }}></i>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td rowSpan={4}>
                                                        {
                                                            languageData?.welcome_bonus_page
                                                                ?.table_cell_no_active_bonus_found?.value
                                                        }
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* <div className="table-responsive mb-5 mt-5">
                                    <table className="custom_table" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr>
                                                <th>Bonus Code</th>
                                                <th>Bonus Amount</th>
                                                <th>Number of Redemptions</th>
                                                <th>Rollover Requirements</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>WELCOME100</td>
                                                <td>100% Match Bonus up to $1,000</td>
                                                <td>1X </td>
                                                <td>25X </td>
                                            </tr>
                                            <tr>
                                                <td>BTC100 </td>
                                                <td>100% Reload Bonus up to $1000</td>
                                                <td>2X</td>
                                                <td>25X</td>
                                            </tr>

                                            <tr>
                                                <td>RELOAD </td>
                                                <td>25% Reload Bonus up to $1000</td>
                                                <td>2X</td>
                                                <td>10X</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div> */}
                                <ol>
                                    <li
                                        dangerouslySetInnerHTML={{
                                            __html: languageData?.welcome_bonus_page?.general_point1?.value,
                                        }}></li>
                                    <li>{languageData?.welcome_bonus_page?.general_point2?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.general_point3?.value}</li>
                                </ol>
                                <p>{languageData?.welcome_bonus_page?.general_message?.value}</p>
                                <h3 className="h3-heading">
                                    {languageData?.welcome_bonus_page?.terms_and_conditions?.value}
                                </h3>
                                <p>
                                    {languageData?.welcome_bonus_page?.terms_and_conditions_message1?.value}
                                </p>
                                <p>
                                    {languageData?.welcome_bonus_page?.terms_and_conditions_message2?.value}
                                </p>
                                <ul>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_1?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_2?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_3?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_4?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_5?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_6?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_7?.value}</li>
                                    <li>{languageData?.welcome_bonus_page?.terms_and_conditions_8?.value}</li>
                                </ul>
                                <h3 className="h3-heading">
                                    {languageData?.welcome_bonus_page?.general_terms_and_conditions?.value}
                                </h3>
                                <ul>
                                    <li
                                        dangerouslySetInnerHTML={{
                                            __html: languageData?.welcome_bonus_page
                                                ?.general_terms_and_conditions_1?.value,
                                        }}>
                                        {/* The general rules and policies of{" "}
                                        <Link href="/" target="_self" rel="noopener">
                                            Betting Ion
                                        </Link>{" "}
                                        shall also apply to the Promotion. */}
                                    </li>
                                    <li>
                                        {
                                            languageData?.welcome_bonus_page?.general_terms_and_conditions_2
                                                ?.value
                                        }
                                    </li>
                                </ul>
                                <div className="btn-wp text_center m-4">
                                    <Button onClick={getUrl} type="button">
                                        {languageData?.welcome_bonus_page?.deposit_now_button?.value}
                                    </Button>
                                </div>

                                <p>{languageData?.welcome_bonus_page?.deposit_information_1?.value}</p>

                                <p>{languageData?.welcome_bonus_page?.deposit_information_2?.value}</p>

                                <p>{languageData?.welcome_bonus_page?.deposit_information_3?.value}</p>

                                <p>{languageData?.welcome_bonus_page?.deposit_information_4?.value}</p>

                                <div className="table-responsive mt-5">
                                    <table className="custom_table" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr>
                                                <th colSpan="2" style={{ textAlign: "center" }}>
                                                    <b>
                                                        {
                                                            languageData?.welcome_bonus_page
                                                                ?.bonus_contribution_table_title?.value
                                                        }
                                                    </b>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_game_types?.value
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_percent_contribution_to_bonus_rollover
                                                            ?.value
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    {
                                                        languageData?.welcome_bonus_page
                                                            ?.table_cell_slot_games?.value
                                                    }
                                                </td>
                                                <td>100%</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page?.table_cell_roulette
                                                            ?.value
                                                    }
                                                </td>
                                                <td>20%</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page?.table_cell_baccarat
                                                            ?.value
                                                    }
                                                </td>
                                                <td>10%</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page?.table_cell_pirate
                                                            ?.value
                                                    }
                                                </td>
                                                <td>5%</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {
                                                        languageData?.welcome_bonus_page?.table_cell_craps
                                                            ?.value
                                                    }
                                                </td>
                                                <td>0%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <BonusInfoModal show={show} setShow={setShow} bonus={bonus} modalFor="welcome" />
        </FrontLayout>
    );
};

export default WelcomeBonus;
