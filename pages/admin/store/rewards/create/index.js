import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { FormProvider, useForm } from "react-hook-form";
import axios from "axios";
import sha1 from "sha1";
import AdminLayout from "@/components/admin/AdminLayout";
import Title from "@/components/admin/UI/Title";
import StartDateContainer from "@/components/admin/FormField/StartDateContainer";
import EndDateContainer from "@/components/admin/FormField/EndDateContainer";
import NextTooltip from "@/components/admin/UI/NextTooltip";
import { useRouter } from "next/router";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";
import useGetConfig from "@/hooks/use-getConfig";

const CreateRewards = (props) => {
	const getConfig = useGetConfig();
	const methods = useForm();
	const router = useRouter();
	const {
		formState: { errors },
	} = methods;
	const { adminLanguageData } = AdminLanguageState();
	const [uploadImage, setUploadImage] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [imageErrorMessage, setImageErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [imageFile, setImageFile] = useState();
	const [image, setImage] = useState();
	const [currencies, setCurrencies] = useState();
	const [categories, setCategories] = useState();
	const [loading, setLoading] = useState(false);
	const [isNotAccessible, setIsNotAccessible] = useState(true);

	const languages = [{ value: "en", label: "English" }];

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
		axios
			.get(
				`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/get-category-list?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}`
			)
			.then((response) => {
				if (response.data?.status === 200) {
					let availableCategories = [];

					response.data?.categoryList.map((category) => {
						availableCategories = [
							...availableCategories,
							{
								value: category.id,
								label: category.name,
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

	const handleFileChange = (event) => {
		setImageErrorMessage("");
		const file = event.target.files[0];
		if (file.size > 4194304) {
			setImageErrorMessage("File is too large");
			return;
		}
		setImageFile(file);
		setUploadImage(true);
		const reader = new FileReader();
		reader.onload = (event) => {
			setImage(event.target.result);
		};
		reader.readAsDataURL(file);
	};

	const gettingDates = () => {
		let startDate = methods.getValues("startDate");
		let endDate = methods.getValues("endDate");
		let startDateTime, endDateTime;

		if (startDate) {
			startDateTime = `${startDate?.getFullYear()}-${startDate?.getMonth() + 1 > 9 ? startDate?.getMonth() + 1 : "0" + (startDate?.getMonth() + 1)
				}-${startDate?.getDate() > 9 ? startDate?.getDate() : "0" + startDate?.getDate()}`;
		} else {
			startDateTime = "";
		}

		if (endDate) {
			endDateTime = `${endDate?.getFullYear()}-${endDate?.getMonth() + 1 > 9 ? endDate?.getMonth() + 1 : "0" + (endDate?.getMonth() + 1)
				}-${endDate?.getDate() > 9 ? endDate?.getDate() : "0" + endDate?.getDate()}`;
		} else {
			endDateTime = "";
		}

		return {
			startDateTime,
			endDateTime,
		};
	};

	const previewHandleClose = () => {
		setImage(false);
		setUploadImage(false);
	};

	const dateToDateFormate = (date) => {
		const dateISO = new Date(date);
		return `${dateISO?.getFullYear()}-${dateISO?.getMonth() + 1 > 9 ? dateISO?.getMonth() + 1 : "0" + (dateISO?.getMonth() + 1)
			}-${dateISO?.getDate() > 9 ? dateISO?.getDate() : "0" + dateISO?.getDate()}`;
	};

	const handleSubmit = async () => {
		setLoading(true);
		setErrorMessage("");
		setSuccessMessage("");

		let payload = {
			name: methods.getValues("name"),
			currency: methods.getValues("currency")?.value,
			description: methods.getValues("description"),
			quantity: methods.getValues("quantity"),
			amount: methods.getValues("amount"),
			startDate: methods.getValues("startDate")
				? dateToDateFormate(methods.getValues("startDate"))
				: "",
			endDate: methods.getValues("endDate") ? dateToDateFormate(methods.getValues("endDate")) : "",
			language: methods.getValues("language")?.value,
			status: methods.getValues("status"),
			category: methods.getValues("category")?.value,
			reward: methods.getValues("reward"),
			rewardType: methods.getValues("currencyType"),
			file: imageFile,
		};

		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `name=${methods.getValues("name")}`);
		const rewardPostUrl = `${process.env.NEXT_PUBLIC_API_DOMAIN}/api/reward/create?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`;
		let rewardPost;

		if (image) {
			rewardPost = [
				rewardPostUrl,
				payload,
				{
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Content-Type": "multipart/form-data",
					},
				},
			];
		} else {
			rewardPost = [rewardPostUrl];
		}

		await axios
			.post(...rewardPost)
			.then((response) => {
				if (response.data?.status === 200) {
					setSuccessMessage("Reward created successfully");
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
									<Title>
										{
											adminLanguageData?.store_rewards_create_page
												?.store_rewards_create_page_title?.value
										}
									</Title>
								</div>
							</Col>
						</Row>
					</div>

					<Row>
						<Col md={12} xl={9} className="order-xl-1 order-2">
							<FormProvider {...methods}>
								<form
									method="POST"
									className="create_rewards_form create_rewards_box"
									onSubmit={methods.handleSubmit(handleSubmit)}>
									<div className="create_rewards_form_title">
										<h5 className="h5_title">
											{
												adminLanguageData?.store_rewards_create_page
													?.store_rewards_create_reward_details?.value
											}
										</h5>
									</div>

									<Row>
										<Col lg={6}>
											<div className="form_input_wp">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_name?.value
													}
												</label>
												<input
													name="name"
													type="text"
													className={`form_input ${errors?.name ? "input_error" : ""
														}`}
													autoComplete="off"
													{...methods.register("name", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_name_error?.value,
													})}
												/>
												{errors?.name && (
													<p className="player-bet-loss">{errors?.name?.message}</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp form-element">
												<label htmlFor="currency_type">
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_currency_type?.value
													}
												</label>
												<div className="position-relative">
													<select
														name="currencyType"
														className={`form_input ${errors?.currencyType ? "input_error" : ""
															}`}
														{...methods.register("currencyType", {
															required: "Currency Type is required",
														})}>
														<option value="points">
															{
																adminLanguageData?.store_rewards_create_page
																	?.store_rewards_create_currency_type_option_point
																	?.value
															}
														</option>
														<option value="money">
															{
																adminLanguageData?.store_rewards_create_page
																	?.store_rewards_create_currency_type_option_money
																	?.value
															}
														</option>
													</select>
													<i className="far fa-angle-down"></i>
													{errors?.currencyType && (
														<p className="player-bet-loss">
															{errors?.currencyType?.message}
														</p>
													)}
												</div>
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_description?.value
													}
												</label>
												<textarea
													cols="30"
													rows="20"
													className={`form_input ${errors?.description ? "input_error" : ""
														}`}
													{...methods.register("description", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_description_error?.value,
													})}></textarea>
												{errors?.description && (
													<p className="player-bet-loss">
														{errors?.description?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<label htmlFor="currency">
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_currency?.value
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
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_available_quantity?.value
													}
												</label>
												<input
													name="available_quantity"
													type="number"
													step={1}
													min={0}
													className={`form_input ${errors?.quantity ? "input_error" : ""
														}`}
													autoComplete="off"
													{...methods.register("quantity", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_quantity_error?.value,
													})}
												/>
												{errors?.quantity && (
													<p className="player-bet-loss">
														{errors?.quantity?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_amount_needed_to_get_reward
															?.value
													}
												</label>
												<input
													name="amount_needed"
													type="number"
													className={`form_input ${errors?.amount ? "input_error" : ""
														}`}
													autoComplete="off"
													{...methods.register("amount", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_amount_error?.value,
													})}
												/>
												{errors?.amount && (
													<p className="player-bet-loss">
														{errors?.amount?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_amount_will_deliver_as_prize
															?.value
													}
												</label>
												<input
													name="reward_prize"
													type="number"
													className={`form_input ${errors?.reward ? "input_error" : ""
														}`}
													autoComplete="off"
													{...methods.register("reward", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_reward_error?.value,
													})}
												/>
												{errors?.reward && (
													<p className="player-bet-loss">
														{errors?.reward?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<StartDateContainer
													title="Start date"
													methods={methods}
													{...methods.register("startDate")}
												/>
												{errors?.startDate && (
													<p className="player-bet-loss">
														{errors?.startDate?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={6}>
											<div className="form_input_wp">
												<EndDateContainer
													title="Finish date"
													methods={methods}
													{...methods.register("endDate")}
												/>
												{errors?.endDate && (
													<p className="player-bet-loss">
														{errors?.endDate?.message}
													</p>
												)}
											</div>
										</Col>
										<Col lg={4}>
											<div className="form_input_wp">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_language?.value
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
													{...methods.register("language", {
														required:
															adminLanguageData?.store_rewards_create_page
																?.store_language_error?.value,
													})}
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
										</Col>
										<Col lg={4}>
											<div className="form_input_wp form-element">
												<label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_status?.value
													}
												</label>
												<div className="position-relative">
													<select
														name="status"
														className={`form_input ${errors?.status ? "input_error" : ""
															}`}
														{...methods.register("status", {
															required: "Status is required",
														})}>
														<option value={true}>
															{
																adminLanguageData?.store_rewards_create_page
																	?.store_rewards_create_status_option_active
																	?.value
															}
														</option>
														<option value={false}>
															{
																adminLanguageData?.store_rewards_create_page
																	?.store_rewards_create_status_option_not_active
																	?.value
															}
														</option>
													</select>
													<i className="far fa-angle-down"></i>
													{errors?.status && (
														<p className="player-bet-loss">
															{errors?.status?.message}
														</p>
													)}
												</div>
											</div>
										</Col>
										<Col lg={4}>
											<div className="form_input_wp form-element">
												<label>
													{" "}
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_category?.value
													}
												</label>
												<div className="position-relative">
													<Select
														className={`select_box form_input ${errors?.category ? "input_error" : ""
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
														{...methods.register("category")}
														onChange={(value) => {
															methods.setValue("category", value);
															methods.clearErrors("category");
														}}
														options={categories}
													/>
												</div>
											</div>
										</Col>
										<Col lg={12}>
											<div className="text_right">
												{loading && (
													<span
														className="load-more"
														style={{
															display: loading ? "inline-block" : "none",
														}}>
														<i className="fad fa-spinner-third fa-spin"></i>
													</span>
												)}
												<p
													className={errorMessage && "player-bet-loss"}
													style={{
														display: errorMessage ? "inline-block" : "none",
													}}>
													{errorMessage}
												</p>
												<p
													className={successMessage && "player-bet-won"}
													style={{
														display: successMessage ? "inline-block" : "none",
													}}>
													{successMessage}
												</p>
												&emsp;
												<button
													className="sec_btn"
													onClick={() => {
														if (!image || !imageFile) {
															setImageErrorMessage(
																adminLanguageData?.store_rewards_create_page
																	?.store_image_error?.value
															);
														}
													}}>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_add_reward_button?.value
													}
												</button>
											</div>
										</Col>
									</Row>
								</form>
							</FormProvider>
						</Col>

						<Col md={4} xl={3} className="mx-auto order-xl-2 order-1">
							<div className="reward_preview create_rewards_box">
								<div className="create_rewards_form_title">
									<h5 className="h5_title">Reward Image</h5>
								</div>
								<div
									className="attach_proof_preview_wp"
									style={{ display: uploadImage ? "block" : "none" }}>
									<div className="attach_proof_preview">
										{uploadImage && (
											<>
												<div className="reward_img">
													<Image
														src={image}
														alt="Reward Image"
														width={350}
														height={350}
													/>
												</div>
												<button
													type="button"
													className="finance-image-preview-close close"
													onClick={previewHandleClose}>
													<span aria-hidden="true">×</span>
												</button>
											</>
										)}
									</div>
								</div>
								<div className="attachment_items">
									<ul>
										<li>
											<NextTooltip
												title={
													adminLanguageData?.common_finance_module
														?.modals_attach_image_tooltip?.value
												}>
												<div className="sec_btn">
													<input
														type="file"
														name="attach_proof"
														id="attach_proof"
														accept="image/jpg, image/png, image/jpeg"
														onChange={handleFileChange}
													/>
													<label htmlFor="attach_proof">
														<i className="far fa-images"></i>
													</label>
													{
														adminLanguageData?.store_rewards_create_page
															?.store_rewards_create_image_upload_button?.value
													}
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
				</div>
			</AdminLayout>
		</>
	);
};

export async function getServerSideProps() {
	return {
		props: {
			title: "Create rewards",
			description: "Create rewards",
		},
	};
}

export default CreateRewards;
