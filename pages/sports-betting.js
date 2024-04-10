import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import sha1 from 'sha1';
import FrontLayout from '@/components/frontend/FrontLayout';
import { BalanceState } from '@/context/BalanceProvider';

const SportsBetting = () => {
	const { userDefaultCurrency } = BalanceState();
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		window.addEventListener(
			'message',
			(event) => {
				if (event.data.type === 'deposit') {
					window.location.href = `${process.env.NEXT_PUBLIC_SITE_URL}/my-account/deposit/`;
				}
			},
			false
		);
	}, []);

	useEffect(() => {
		(async () => {
			let oddsTypeData,
				sportsBookLayoutData = '';

			const authkey = sha1(
				process.env.NEXT_PUBLIC_AUTH_KEY +
					`casino=${process.env.NEXT_PUBLIC_CASINO}`
			);

			/**
			 * Get oddsType & sportBookLayout
			 */
			await axios
				.get(
					`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/casinos/sports-layout?token=${process.env.NEXT_PUBLIC_TOKEN}&casino=${process.env.NEXT_PUBLIC_CASINO}&authKey=${authkey}`
				)
				.then((response) => {
					if (response?.data?.status === 200) {
						Object.entries(response?.data?.data?.oddsType).forEach(
							([key, value]) => {
								if (value) oddsTypeData = key;
							}
						);
						Object.entries(response?.data?.data?.sportsBookLayout).forEach(
							([key, value]) => {
								if (value) sportsBookLayoutData = key;
							}
						);
					} else {
						setErrorMessage(response.data?.message);
					}
				})
				.catch((error) => {
					setErrorMessage(error.data?.message);
				});

			/**
			 * Add script
			 */
			await axios
				.get(
					`${
						process.env.NEXT_PUBLIC_API_DOMAIN
					}/providers/betconstruct-423539527853/?token=${
						process.env.NEXT_PUBLIC_TOKEN
					}&currency=${
						userDefaultCurrency?.currencyAbrv
							? userDefaultCurrency?.currencyAbrv
							: 'USD'
					}&action=gameLoad&casino=${
						process.env.NEXT_PUBLIC_CASINO
					}&remote_id=${
						JSON.parse(localStorage.getItem('User'))?.userId
					}&language=en`
				)
				.then((response) => {
					if (response.data?.status === 200) {
						let sportDomain, sportLink;
						const token = response.data?.result;
						const lang = response.data?.language;

						if (window.innerHeight > window.innerWidth) {
							sportDomain = 'https://mobile.urgentgames.com';
							sportLink = `${sportDomain}/js/partnerinit.js?containerID=bcsportsbookcontainer&callbackName=bettingCB&oddsType=${oddsTypeData}&type=prematch&UserId=${
								JSON.parse(localStorage.getItem('User'))?.userId || 0
							}&AuthToken=${token}&lang=${lang}&sport=852&sportsBookLayout=${sportsBookLayoutData}`;
						} else {
							sportDomain = 'https://sportsbook.urgentgames.com';
							sportLink = `${sportDomain}/js/partnerinit.js?containerID=bcsportsbookcontainer&callbackName=bettingCB&oddsType=${oddsTypeData}&type=prematch&UserId=${
								JSON.parse(localStorage.getItem('User'))?.userId || 0
							}&AuthToken=${token}&lang=${lang}&sport=852&region=327693&sportsBookLayout=${sportsBookLayoutData}`;
						}

						document.domain = process.env.NEXT_PUBLIC_MAIN_DOMAIN;
						let script = document.createElement('script');
						script?.setAttribute('src', sportLink);
						script?.setAttribute('id', 'bcsportsbook');
						document?.body?.appendChild(script);
					}
				})
				.catch((error) => {
					setErrorMessage(error?.message);
				});
		})();
	}, []);

	return (
		<>
			<Head></Head>
			<FrontLayout>
				<p
					className='error-msg mt_20'
					style={{ display: errorMessage && 'block' }}
				>
					{errorMessage}
				</p>

				<div
					id='bcsportsbookcontainer'
					style={{ height: 'calc(100vh - 190px)' }}
				></div>
			</FrontLayout>
		</>
	);
};

export default SportsBetting;
