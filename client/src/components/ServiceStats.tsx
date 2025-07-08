import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
} from "recharts"
import { TrendingUp, DollarSign, Users, Calendar, Award } from "lucide-react"

const profitData = [
    { year: "2021", income: 145000, expenses: 98000, profit: 47000 },
    { year: "2022", income: 168000, expenses: 112000, profit: 56000 },
    { year: "2023", income: 195000, expenses: 128000, profit: 67000 },
    { year: "2024", income: 220000, expenses: 145000, profit: 75000 },
]

const monthlyData = [
    { month: "Jan", appointments: 45, revenue: 18500 },
    { month: "Feb", appointments: 52, revenue: 21200 },
    { month: "Mar", appointments: 48, revenue: 19800 },
    { month: "Apr", appointments: 61, revenue: 24500 },
    { month: "May", appointments: 58, revenue: 23200 },
    { month: "Jun", appointments: 65, revenue: 26800 },
]

const serviceTypeData = [
    { name: "Oil Change", value: 30, color: "rgba(119, 150, 109, 1)" },
    { name: "Brake Service", value: 25, color: "rgba(189, 198, 103, 1)" },
    { name: "Tire Service", value: 20, color: "rgba(98, 109, 88, 1)" },
    { name: "Engine Repair", value: 15, color: "rgba(86, 40, 45, 1)" },
    { name: "Other", value: 5, color: "rgba(84, 67, 67, 0.5)" },
]

export default function ServiceStatistics() {
    const currentYear = new Date().getFullYear()
    const currentYearData = profitData.find((d) => d.year === currentYear.toString()) || profitData[profitData.length - 1]

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">Business Analytics</h2>
                <p className="text-[rgba(84,67,67,0.7)]">Track your service performance and financial metrics</p>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">All-time Revenue</h3>
                            <p className="text-2xl font-bold text-[rgba(119,150,109,1)]">
                                ${currentYearData.profit.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-[rgba(119,150,109,0.1)] rounded-full">
                            <TrendingUp size={24} className="text-[rgba(119,150,109,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Monthly Revenue</h3>
                            <p className="text-2xl font-bold text-[rgba(189,198,103,1)]">
                                ${monthlyData[monthlyData.length - 1].revenue.toLocaleString()}
                            </p>
                            <p className="text-xs text-[rgba(84,67,67,0.6)]">Current month</p>
                        </div>
                        <div className="p-3 bg-[rgba(189,198,103,0.1)] rounded-full">
                            <DollarSign size={24} className="text-[rgba(189,198,103,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Active Employees</h3>
                            <p className="text-2xl font-bold text-[rgba(98,109,88,1)]">12</p>
                        </div>
                        <div className="p-3 bg-[rgba(98,109,88,0.1)] rounded-full">
                            <Users size={24} className="text-[rgba(98,109,88,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Completed Appointments</h3>
                            <p className="text-2xl font-bold text-[rgba(86,40,45,1)]">
                                {monthlyData[monthlyData.length - 1].appointments}
                            </p>
                        </div>
                        <div className="p-3 bg-[rgba(86,40,45,0.1)] rounded-full">
                            <Calendar size={24} className="text-[rgba(86,40,45,1)]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Service Distribution */}
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Service Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={serviceTypeData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={120}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {serviceTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`${value}%`, "Percentage"]}
                                contentStyle={{
                                    backgroundColor: "white",
                                    border: "1px solid rgba(189,198,103,0.3)",
                                    borderRadius: "8px",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                        {serviceTypeData.map((item, index) => (
                            <div key={index} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-[rgba(84,67,67,0.8)]">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Monthly Performance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,198,103,0.3)" />
                        <XAxis dataKey="month" tick={{ fill: "rgba(84,67,67,0.8)" }} />
                        <YAxis yAxisId="left" tick={{ fill: "rgba(84,67,67,0.8)" }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fill: "rgba(84,67,67,0.8)" }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid rgba(189,198,103,0.3)",
                                borderRadius: "8px",
                            }}
                        />
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="appointments"
                            stroke="rgba(119, 150, 109, 1)"
                            strokeWidth={3}
                            name="Appointments"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            stroke="rgba(189, 198, 103, 1)"
                            strokeWidth={3}
                            name="Revenue ($)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
