import { LanguageState } from "@/context/FrontLanguageProvider";
import { renderAmountWithCurrency } from "@/utils/renderAmountWithCurrency";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

const ActiveBonusInfoModal = ({ show, setShow, bonus, modalFor }) => {
	const router = useRouter();
	// const data = modalFor === 'active' ? bonus?.bonusCode : modalFor === 'welcome' ? bonus : {};
	const data = bonus;
	const bonusStatus = data?.status ? "active" : "expired";
	const closeHandler = () => setShow(false);
    const [languageDataTranslate, setLanguageData] = useState({});
    const { languageData } = LanguageState();


	/**
	 * for translations data
	 */
	useEffect(() => {
		let bonusLanguages = {};
		if (data?.translation) {
			data?.translation?.map((lang) => {
				bonusLanguages = {
					...bonusLanguages,
					[lang?.language]: lang
				};
			});
		}

		// set available translation locale
		if (router?.locale in bonusLanguages) {
			setLanguageData(bonusLanguages?.[router?.locale]);
		} else {
			if (router?.locale === 'en') {
				setLanguageData(bonusLanguages?.es);
			} else if (router?.locale === 'es') {
				setLanguageData(bonusLanguages?.en);
			}
		}
	}, [show, bonus, router?.locale]);

	return (
		<Modal show={show} size="lg">
			<div
				className="close_modal_overlay"
				onClick={closeHandler}
			>
			</div>

			<Modal.Body>
				<div className="transfer_modal_box bonus_info_modal">
					<button type="button" className="close" onClick={closeHandler}>
						<i className="fal fa-times"></i>
					</button>

					<h4 className="modal-title">{languageData?.bonus_information_modal?.bonus_information_modal_title?.value}</h4>

					<div className="active_bonus_content">
						<ul>
							<li>
								<label>{languageData?.bonus_information_modal?.label_promocode?.value}</label>
								<b>{data?.code}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_title?.value}</label>
								<b>{languageDataTranslate?.title}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_description?.value}</label>
								<b>{languageDataTranslate?.description}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_type?.value}</label>
								<b>{data?.bonusType}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_currency?.value}</label>
								<b>{data?.currency}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_minimum_required_amount?.value}</label>
								<b>{renderAmountWithCurrency(data?.allocationInfo?.minimum, data?.allocationInfo?.currency)}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_deposit_amount?.value}</label>
								<b>{renderAmountWithCurrency(data?.depositAmount, data?.currency)}</b>
							</li>
							<li>
								<label>{languageData?.bonus_information_modal?.label_allocation_type?.value}</label>
								<b>{data?.allocationType}</b>
							</li>
							{data?.allocationType === 'deposits' && (
								<>
									<li>
                                        <label>{languageData?.bonus_information_modal?.label_deposit_type?.value}</label>
										<b>{data?.allocationInfo?.depositType}</b>
									</li>
									<li>
										<label>{languageData?.bonus_information_modal?.label_deposit_method?.value}</label>
										<b>{data?.allocationInfo?.includePaymentMethods?.join(', ')}</b>
									</li>
								</>
							)}
							{data?.type === "fixedBonus" && (
								<li>
									<label>{languageData?.bonus_information_modal?.label_bonus_amount?.value}</label>
									<b>{renderAmountWithCurrency(data?.bonusData?.bonusToBeAwarded, data?.bonusData?.currency)}</b>
								</li>
							)}
							{data?.type === "depositPercentage" && (
								<>
									<li>
										<label>{languageData?.bonus_information_modal?.label_bonus_percentage?.value || "Bonus percentage"}</label>
										<b>{renderAmountWithCurrency(data?.bonusData?.percentage, data?.bonusData?.currency)}</b>
									</li>
									<li>
                                        <label>{languageData?.bonus_information_modal?.label_bonus_amount?.value || "Bonus amount (Maximum)"}</label>
										<b>{renderAmountWithCurrency(data?.bonusData?.limitToAwarded, data?.bonusData?.currency)}</b>
									</li>
								</>
							)}
							<li>
								<label>{languageData?.bonus_information_modal?.label_maximum_amount_convert_to_balance?.value || " Maximum amount convert to balance"}</label>
								<b>{renderAmountWithCurrency(data?.bonusData?.maximumToBalance, data?.bonusData?.currency)}</b>
							</li>
							{/* {modalFor === 'active' && (
								<li>
									<label>Granted date</label>
									<b>{bonus?.bonusAddedDate?.replace(/T/i, ' ')?.substring(0, bonus?.bonusAddedDate?.indexOf('.'))}</b>
								</li>
							)} */}
							<li>
                                <label>{languageData?.bonus_information_modal?.label_minimum_required_amount?.value || "Minimum Required Amount"}</label>
								<b>{renderAmountWithCurrency(data?.minimumRequiredAmount, data?.bonusData?.currency)}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_initial_wagering_requirement?.value || "Initial Wagering Requirement"}</label>
								<b>{renderAmountWithCurrency(data?.initalWageringRequirement, data?.bonusData?.currency)}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_remaining_wagering_requirement?.value || "Remaining Wagering Requirement"}</label>
								<b>{data?.remainingWageringRequirement}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_rollover_amount?.value || "Rollover Amount"}</label>
								<b>{renderAmountWithCurrency(data?.currentRolloverAmount, data?.bonusData?.currency)}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_rollover_multiplier?.value || "Rollover Multiplier"}</label>
								<b>{data?.rolloverData?.rolloverMultiplier}X</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_rollover_rollover_to_complete?.value || "Rollover to complete"}</label>
								<b>{data?.rolloverData?.daysToComplete} Days</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_valid_from?.value || "Valid from"}</label>
								<b>{data?.validFrom?.replace(/T/i, ' ')?.substring(0, data?.validFrom?.indexOf('.'))}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_expiry_date?.value || "Expiry date"}</label>
								<b>{data?.validTo?.replace(/T/i, ' ')?.substring(0, data?.validTo?.indexOf('.'))}</b>
							</li>
							<li>
                                <label>{languageData?.bonus_information_modal?.label_status?.value || "Status"}</label>
								<b>
									<span
										className={`bonus-status-${bonusStatus}`}>
										{bonusStatus}
									</span>
								</b>
							</li>
						</ul>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}

export default ActiveBonusInfoModal;