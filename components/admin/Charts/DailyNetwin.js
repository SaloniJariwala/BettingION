import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Filler,
    Title,
} from "chart.js";
import Loader from "../UI/Loader";
import { AdminLanguageState } from "@/context/AdminLanguageProvider";

ChartJS.register({
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Filler,
});

const DailyNetwin = () => {
    const { adminLanguageData } = AdminLanguageState();
    const [dailyIncome, setDailyIncome] = useState();
    const [dailyDayChartLabel, setDailyDayChartLabel] = useState();
    const [dailyLoader, setDailyLoader] = useState(false);
    const [dailyNetwinError, setDailyNetwinError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("DailyNetwin")) {
            setDailyLoader(true);
            const dailyNetwin = JSON.parse(localStorage.getItem("DailyNetwin"));
            setDailyLoader(true);
            setDailyIncome(dailyNetwin?.dailyIncome);
            setDailyDayChartLabel(dailyNetwin?.dailyChartLabel);
            setDailyLoader(false);
        } else {
            const getDailyNetWin = async () => {
                const dailyIncomeArray = [];
                const dailyChartArray = [];
                setDailyLoader(true);
                await axios
                    .get(
                        `${
                            process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN
                        }/casinos/casino-admin-reports?action=daily-netwin&token=${
                            process.env.NEXT_PUBLIC_TOKEN
                        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${
                            JSON.parse(localStorage.getItem("User"))?.remoteId
                        }`
                    )
                    .then((response) => {
                        setDailyLoader(true);
                        if (response?.data?.data) {
                            const data = response?.data?.data;
                            data.forEach((item) => {
                                dailyIncomeArray?.push(item?.netwinIncome);
                                dailyChartArray?.push(
                                    `${new Date(item?.day).getDate()}-${new Date(
                                        item?.day
                                    ).toLocaleDateString("default", { month: "short" })}`
                                );
                            });
                            setDailyIncome(dailyIncomeArray.reverse());
                            setDailyDayChartLabel(dailyChartArray.reverse());
                            const dailyNetwin = {
                                dailyIncome: dailyIncomeArray.reverse(),
                                dailyChartLabel: dailyChartArray.reverse(),
                                expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
                            };
                            localStorage.setItem("DailyNetwin", JSON.stringify(dailyNetwin));
                            setDailyLoader(false);
                        }
                    })
                    .catch((error) => {
                        if (error.response?.status === 500) {
                            setDailyNetwinError(500);
                        } else {
                            setDailyNetwinError(error.message);
                        }
                    })
                    .finally(() => {
                        setDailyLoader(false);
                    });
            };
            getDailyNetWin();
        }
    }, []);

    // daily month chart
    const DailyMonthChartData = {
        labels: dailyDayChartLabel,
        datasets: [
            {
                labels: [],
                data: dailyIncome,
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1,
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                cubicInterpolationMode: "monotone",
                tension: 0.4,
            },
        ],
    };

    const dailyNetwinChartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            title: {
                id: "dailyNetwinChart",
            },
            filler: {
                propagate: true,
            },
        },
        scales: {
            y: {
                display: true,
            },
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem) {
                    return tooltipItem.datasetIndex == 2
                        ? ""
                        : Intl.NumberFormat().format(tooltipItem.yLabel);
                },
            },
        },
    };

    return (
        <>
            <div className="dashboard_box">
                <h3 className="h3-title">{adminLanguageData?.dashboard_page?.daily_netwin?.value}</h3>
                {dailyLoader ? (
                    <Loader />
                ) : dailyNetwinError ? (
                    dailyNetwinError === 500 ? (
                        <>No Data Found</>
                    ) : (
                        <p className="error-msg" style={{ display: dailyNetwinError ? "block" : "none" }}>
                            {dailyNetwinError}
                        </p>
                    )
                ) : (
                    <Line data={DailyMonthChartData} options={dailyNetwinChartOptions} />
                )}
            </div>
        </>
    );
};

export default DailyNetwin;
