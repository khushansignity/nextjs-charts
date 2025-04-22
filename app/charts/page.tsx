import { getChartData } from "@/lib/db/queries";
import { Component } from "./charts";

export default async function ChartsPage() {
    const chartData = await getChartData()
    return (
        <div className="p-4 text-center">
            <Component chartData={chartData} />
        </div>
    )
}