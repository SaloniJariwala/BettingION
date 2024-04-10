import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { BalanceState } from "@/context/BalanceProvider";
import sha1 from 'sha1';

/**
 * Get site payment configurations
 * 
 * @returns Object
 */
const useGetConfig = () => {
	const { userDefaultCurrency } = BalanceState();
	const [isLoading, setIsLoading] = useState(true);
	const [data, setData] = useState([]);
	const [bankAccounts, setBankAccounts] = useState([]);
	const [paymentCurrencies, setPaymentCurrencies] = useState([]);
	const [paymentMethods, setPaymentMethods] = useState({});
	const [optionsData, setOptionsData] = useState([]);
	const [error, setError] = useState('');

	/**
	 * Get payment config
	 */
	const getConfig = useCallback(async () => {
		setIsLoading(true);

		const authKey = sha1(process.env.NEXT_PUBLIC_AUTH_KEY + `casino=${process.env.NEXT_PUBLIC_CASINO}`);

		axios.get(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/players/get-config-info?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authKey}`)
			.then((response) => {
				if (response.data?.status === 200) {
					const data = response.data?.data;

					setData(data);
					setBankAccounts(data?.bankAccounts);
					setPaymentCurrencies(data?.paymentCurrencies);
					setPaymentMethods(data?.paymentMethods);

					const bankAccountsOptions = data?.bankAccounts?.map((bank) => {
						return {
							label: bank?.bankName,
							value: bank?.accountNumber,
						};
					});

					const paymentCurrenciesOptions = response.data?.data?.paymentCurrencies?.map((currency) => {
						return {
							label: `${currency?.currencyName} (${currency?.currencyAbrv})`,
							value: currency?.currencyAbrv
						};
					});

					const paymentCurrenciesOptionsWithUserCurrency = [
						{
							label: `${userDefaultCurrency?.currencyName} (${userDefaultCurrency?.currencyAbrv})`,
							value: userDefaultCurrency?.currencyAbrv,
						},
						...paymentCurrenciesOptions
					];

					setOptionsData({
						bankAccountsOptions,
						paymentCurrenciesOptions,
						paymentCurrenciesOptionsWithUserCurrency
					});
				} else {
					setError(response.data?.message);
				}
			})
			.catch((error) => {
				setError(error.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, []);

	useEffect(() => {
		getConfig();
	}, [getConfig]);

	return {
		isLoading,
		data,
		bankAccounts,
		paymentCurrencies,
		paymentMethods,
		optionsData,
		error
	};
};

export default useGetConfig;