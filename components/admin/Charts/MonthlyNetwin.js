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

const MonthlyNetwin = () => {
    const { adminLanguageData } = AdminLanguageState();
    const [monthNetIncome, setMonthlyNetIncome] = useState();
    const [monthlyIncomeError, setMonthlyIncomeError] = useState("");
    const [chartLabel, setChartLabels] = useState();
    const [monthlyLoader, setMonthlyLoader] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("MonthlyNetwin")) {
            const monthlyNetwin = JSON.parse(localStorage.getItem("MonthlyNetwin"));
            setMonthlyLoader(true);
            setMonthlyNetIncome(monthlyNetwin?.monthlyIncome);
            setChartLabels(monthlyNetwin?.chartLabels);
            setMonthlyLoader(false);
        } else {
            const getMonthlyNetIncome = async () => {
                const monthArray = [];
                const chartMonthArray = [];
                setMonthlyLoader(true);
                await axios
                    .get(
                        `${
                            process.env.NEXT_PUBLIC_ADMIN_API_DOMAIN
                        }/casinos/casino-admin-reports?action=monthly-netwin&token=${
                            process.env.NEXT_PUBLIC_TOKEN
                        }&casino=${process.env.NEXT_PUBLIC_CASINO}&remote_id=${
                            JSON.parse(localStorage.getItem("User"))?.remoteId
                        }`
                    )
                    .then((response) => {
                        setMonthlyLoader(true);
                        if (response?.data?.data) {
                            const data = response?.data?.data;
                            data.forEach((item) => {
                                monthArray?.push(item?.netwinIncome);
                                chartMonthArray?.push(item?.monthName);
                            });
                            setMonthlyNetIncome(monthArray.reverse());
                            setChartLabels(chartMonthArray.reverse());
                            const monthlyNetwin = {
                                monthlyIncome: monthArray.reverse(),
                                chartLabels: chartMonthArray.reverse(),
                                expiry: new Date().getTime() + 24 * 60 * 60 * 1000,
                            };
                            localStorage.setItem("MonthlyNetwin", JSON.stringify(monthlyNetwin));
                            setMonthlyLoader(false);
                        } else {
                            setMonthlyIncomeError(response?.error?.message);
                        }
                    })
                    .catch((error) => {
                        if (error.response?.status === 500) {
                            setMonthlyIncomeError(500);
                        } else {
                            setMonthlyIncomeError(error.message);
                        }
                    })
                    .finally(() => {
                        setMonthlyLoader(false);
                    });
            };
            getMonthlyNetIncome();
        }
    }, []);

    // monthly netwinIncome
    const netIncomeChartData = {
        labels: chartLabel,
        datasets: [
            {
                data: monthNetIncome,
                backgroundColor: ["rgba(54, 162, 235, 0.2)"],
                borderColor: ["rgba(54, 162, 235, 1)"],
                borderWidth: 1,
                fill: true,
            },
        ],
    };

    const netIncomeChartOptions = {
        plugins: {
            legend: {
                display: false,
                // position: "bottom",
                // labels: {
                //     padding: 20,
                // },
            },
            title: {
                id: "netIncomeChart",
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
                <h3 className="h3-title">{adminLanguageData?.dashboard_page?.monthly_netwin?.value}</h3>
                {monthlyLoader ? (
                    <Loader />
                ) : monthlyIncomeError ? (
                    monthlyIncomeError === 500 ? (
                        <>No Data Found</>
                    ) : (
                        <p className="error-msg" style={{ display: monthlyIncomeError ? "block" : "none" }}>
                            {monthlyIncomeError}
                        </p>
                    )
                ) : (
                    <Line data={netIncomeChartData} options={netIncomeChartOptions} />
                )}
            </div>
        </>
    );
};

export default MonthlyNetwin;
