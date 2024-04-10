import React from "react";
import { Pie } from "react-chartjs-2";
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

const TopAgents = ({ commission, isLoading, netIncomeError }) => {
    const { adminLanguageData } = AdminLanguageState();

    // Top Agents of the Month
    const TopAgentsPieChart = {
        datasets: [
            {
                data: [commission],
                backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(255, 159, 64, 1)"],
                borderWidth: 1,
            },
        ],
        tooltips: {
            callbacks: {
                label: function (a, e) {
                    return Intl.NumberFormat().format(e.datasets[a.datasetIndex].data[a.index]);
                },
            },
        },
        labels: ["apiagent"],
    };

    const options = {
        responsive: !0,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    padding: 20,
                },
            },
            title: {
                id: "TopAgentsPieChart",
            },
        },
    };

    return (
        <>
            <div className="dashboard_box">
                <h3 className="h3-title">
                    {adminLanguageData?.dashboard_page?.top_agents_of_the_month?.value}
                </h3>
                {isLoading ? (
                    <Loader />
                ) : netIncomeError ? (
                    netIncomeError === 500 ? (
                        <>No Data Found</>
                    ) : (
                        <p className="error-msg" style={{ display: netIncomeError ? "block" : "none" }}>
                            {netIncomeError}
                        </p>
                    )
                ) : (
                    <Pie data={TopAgentsPieChart} options={options} />
                )}
            </div>
        </>
    );
};

export default TopAgents;
