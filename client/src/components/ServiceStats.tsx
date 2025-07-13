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
import { TrendingUp, Euro, Users, Calendar } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"

const COLORS = [
    "rgba(119,150,109,1)",
    "rgba(189,198,103,1)",
    "rgba(98,109,88,1)",
    "rgba(86,40,45,1)",
    "rgba(84,67,67,0.5)",
]

export default function ServiceStatistics({ serviceId }: { serviceId: number }) {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!serviceId) return

        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/service/getStats/${serviceId}`)
                setStats(response.data)
            } catch (err: any) {
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
    }, [serviceId])

    if (loading) return <p>Loading statistics...</p>
    if (error) return <p>Error loading statistics: {error.message}</p>
    if (!stats) return null

    const {
        allTimeRevenue,
        currentMonthRevenue,
        activeEmployees,
        completedAppointments,
        serviceTypeDistribution,
        monthlyTrends,
    } = stats

    const serviceTypeData = serviceTypeDistribution.map((item: any, index: number) => ({
        ...item,
        color: COLORS[index % COLORS.length],
    }))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">Business Analytics</h2>
                <p className="text-[rgba(84,67,67,0.7)]">Track your service performance and financial metrics</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">All-time Revenue</h3>
                            <p className="text-2xl font-bold text-[rgba(119,150,109,1)]">
                                ${allTimeRevenue?.toLocaleString() || "0"}
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
                                ${currentMonthRevenue?.toLocaleString() || "0"}
                            </p>
                            <p className="text-xs text-[rgba(84,67,67,0.6)]">Current month</p>
                        </div>
                        <div className="p-3 bg-[rgba(189,198,103,0.1)] rounded-full">
                            <Euro size={24} className="text-[rgba(189,198,103,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Active Employees</h3>
                            <p className="text-2xl font-bold text-[rgba(98,109,88,1)]">{activeEmployees}</p>
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
                                {completedAppointments ?? "0"}
                            </p>
                        </div>
                        <div className="p-3 bg-[rgba(86,40,45,0.1)] rounded-full">
                            <Calendar size={24} className="text-[rgba(86,40,45,1)]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
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
                                {serviceTypeData.map((entry: any, index: number) => (
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
                        {serviceTypeData.map((item: any, index: number) => (
                            <div key={index} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                                <span className="text-sm text-[rgba(84,67,67,0.8)]">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Monthly Performance Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyTrends}>
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
