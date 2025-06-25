"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { DollarSign, TrendingUp, Car } from "lucide-react"

const stats = {
    totalSpent: 19200,
    averageAppointmentCost: 480,
    totalAppointments: 40,
    // Restructured data for grouped bar chart
    spentByCarPerYear: [
        { year: "2022", Toyota: 2500, Honda: 1800, BMW: 0 },
        { year: "2023", Toyota: 2900, Honda: 3100, BMW: 2200 },
        { year: "2024", Toyota: 3200, Honda: 2800, BMW: 2700 },
    ],
    avgCostByCar: [
        { car: "Toyota", average: 500 },
        { car: "Honda", average: 460 },
        { car: "BMW", average: 520 },
    ],
    // Additional data for pie chart
    spentByCar: [
        { name: "Toyota", value: 8600, color: "rgba(119, 150, 109, 1)" },
        { name: "Honda", value: 7700, color: "rgba(189, 198, 103, 1)" },
        { name: "BMW", value: 2900, color: "rgba(98, 109, 88, 1)" },
    ],
}

// Custom tooltip for the grouped bar chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 border border-[rgba(189,198,103,0.3)] rounded-lg shadow-lg">
                <p className="text-[rgba(84,67,67,1)] font-medium">{`Year: ${label}`}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} style={{ color: entry.color }} className="text-sm">
                        {`${entry.dataKey}: $${entry.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        )
    }
    return null
}

// Custom tooltip for pie chart
const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0]
        return (
            <div className="bg-white p-3 border border-[rgba(189,198,103,0.3)] rounded-lg shadow-lg">
                <p className="text-[rgba(84,67,67,1)] font-medium">{data.name}</p>
                <p className="text-sm text-[rgba(84,67,67,0.8)]">{`$${data.value.toLocaleString()}`}</p>
                <p className="text-xs text-[rgba(84,67,67,0.6)]">{`${((data.value / stats.totalSpent) * 100).toFixed(1)}%`}</p>
            </div>
        )
    }
    return null
}

export default function StatsDashboard() {
    return (
        <div className="space-y-6 bg-[#f8f9f4] min-h-full pb-6">
            {/* Header */}
            <div className="mb-8">
                <p className="text-[rgba(84,67,67,0.7)]">Overview of your car service expenses and trends</p>
            </div>

            {/* Top stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Total Money Spent</h3>
                            <p className="text-2xl font-bold text-[rgba(119,150,109,1)]">${stats.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-[rgba(119,150,109,0.1)] rounded-full">
                            <DollarSign size={24} className="text-[rgba(119,150,109,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Avg. Appointment Cost</h3>
                            <p className="text-2xl font-bold text-[rgba(189,198,103,1)]">${stats.averageAppointmentCost}</p>
                        </div>
                        <div className="p-3 bg-[rgba(189,198,103,0.1)] rounded-full">
                            <TrendingUp size={24} className="text-[rgba(189,198,103,1)]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Money spent by car per year - Grouped Bar Chart */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Money Spent by Car per Year</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart
                            data={stats.spentByCarPerYear}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barCategoryGap="20%"
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,198,103,0.3)" />
                            <XAxis
                                dataKey="year"
                                tick={{ fill: "rgba(84,67,67,0.8)", fontSize: 12 }}
                                axisLine={{ stroke: "rgba(189,198,103,0.5)" }}
                            />
                            <YAxis
                                tick={{ fill: "rgba(84,67,67,0.8)", fontSize: 12 }}
                                axisLine={{ stroke: "rgba(189,198,103,0.5)" }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: "20px",
                                    fontSize: "14px",
                                    color: "rgba(84,67,67,1)",
                                }}
                            />
                            <Bar dataKey="Toyota" fill="rgba(119, 150, 109, 1)" name="Toyota" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="Honda" fill="rgba(189, 198, 103, 1)" name="Honda" radius={[2, 2, 0, 0]} />
                            <Bar dataKey="BMW" fill="rgba(98, 109, 88, 1)" name="BMW" radius={[2, 2, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Spending distribution pie chart */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Spending Distribution by Car</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={stats.spentByCar}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.spentByCar.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                wrapperStyle={{
                                    fontSize: "14px",
                                    color: "rgba(84,67,67,1)",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Average cost by car - Horizontal Bar Chart */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Average Appointment Cost by Car</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart layout="vertical" data={stats.avgCostByCar} margin={{ top: 20, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,198,103,0.3)" />
                        <XAxis
                            type="number"
                            tick={{ fill: "rgba(84,67,67,0.8)", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(189,198,103,0.5)" }}
                        />
                        <YAxis
                            type="category"
                            dataKey="car"
                            tick={{ fill: "rgba(84,67,67,0.8)", fontSize: 12 }}
                            axisLine={{ stroke: "rgba(189,198,103,0.5)" }}
                        />
                        <Tooltip
                            formatter={(value: any) => [`$${value}`, "Average Cost"]}
                            labelStyle={{ color: "rgba(84,67,67,1)" }}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid rgba(189,198,103,0.3)",
                                borderRadius: "8px",
                            }}
                        />
                        <Bar dataKey="average" fill="rgba(119, 150, 109, 1)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary insights */}
            {/* <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Key Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-[rgba(119,150,109,0.05)] rounded-lg border border-[rgba(119,150,109,0.2)]">
                        <h4 className="font-medium text-[rgba(84,67,67,1)] mb-2">Most Expensive Car</h4>
                        <p className="text-sm text-[rgba(84,67,67,0.8)]">
                            BMW has the highest average cost per appointment at $520
                        </p>
                    </div>
                    <div className="p-4 bg-[rgba(189,198,103,0.05)] rounded-lg border border-[rgba(189,198,103,0.2)]">
                        <h4 className="font-medium text-[rgba(84,67,67,1)] mb-2">Spending Trend</h4>
                        <p className="text-sm text-[rgba(84,67,67,0.8)]">Overall spending has increased by 15% from 2022 to 2023</p>
                    </div>
                    <div className="p-4 bg-[rgba(98,109,88,0.05)] rounded-lg border border-[rgba(98,109,88,0.2)]">
                        <h4 className="font-medium text-[rgba(84,67,67,1)] mb-2">Most Serviced</h4>
                        <p className="text-sm text-[rgba(84,67,67,0.8)]">Toyota accounts for 45% of your total service spending</p>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
