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
import { Euro, TrendingUp } from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import useUserStore from "../stores/userStore"

const COLORS = [
    "rgba(119,150,109,1)",
    "rgba(189,198,103,1)",
    "rgba(98,109,88,1)",
    "rgba(169,160,131,1)",
    "rgba(142,155,136,1)",
]

const transformStats = (api: any) => {
    const yearsSet = new Set<string>()
    Object.values<Record<string, number>>(api.spendingByCar).forEach(obj =>
        Object.keys(obj).forEach(y => yearsSet.add(y)),
    )
    const years = Array.from(yearsSet).sort()

    const spentByCarPerYear = years.map(year => {
        const row: any = { year }
        for (const [car, perYear] of Object.entries<Record<string, number>>(
            api.spendingByCar,
        )) {
            row[car] = perYear[year] ?? 0
        }
        return row
    })

    const avgCostByCar = Object.entries(api.averageCostByCar).map(([car, avg]) => ({
        car,
        average: avg as number,
    }))

    const spentByCar = Object.entries(api.costByCar).map(([car, value], i) => ({
        name: car,
        value,
        color: COLORS[i % COLORS.length],
    }))

    return {
        totalSpent: api.totalCost,
        averageAppointmentCost: api.averageCost,
        spentByCarPerYear,
        avgCostByCar,
        spentByCar,
    }
}

const BarTooltip = ({ active, payload, label }: any) =>
    active && payload?.length ? (
        <div className="bg-white p-3 border border-[rgba(189,198,103,0.3)] rounded-lg shadow-lg">
            <p className="font-medium text-[rgba(84,67,67,1)] mb-1">{`Year: ${label}`}</p>
            {payload.map((e: any) => (
                <p key={e.dataKey} style={{ color: e.fill }}>
                    {`${e.dataKey}: $${e.value.toLocaleString()}`}
                </p>
            ))}
        </div>
    ) : null

const PieTooltip = ({ active, payload, total }: any) =>
    active && payload?.length ? (
        <div className="bg-white p-3 border border-[rgba(189,198,103,0.3)] rounded-lg shadow-lg">
            <p className="font-medium text-[rgba(84,67,67,1)] mb-1">{payload[0].name}</p>
            <p className="text-sm text-[rgba(84,67,67,0.8)]">${payload[0].value.toLocaleString()}</p>
            <p className="text-xs text-[rgba(84,67,67,0.6)]">
                {((payload[0].value / total) * 100).toFixed(1)}%
            </p>
        </div>
    ) : null

export default function StatsDashboard() {
    const { getStatistics } = useUserStore()
    const [stats, setStats] = useState<ReturnType<typeof transformStats> | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const api = await getStatistics()
                setStats(transformStats(api))
            } catch (e) {
                console.error("Failed to load statistics", e)
            }
        })()
    }, [getStatistics])

    const barKeys = useMemo(
        () => (stats ? Object.keys(stats.spentByCarPerYear[0]).filter(k => k !== "year") : []),
        [stats],
    )

    if (!stats) return <div className="p-6">Loading…</div>

    return (
        <div className="space-y-6 bg-[#f8f9f4] min-h-full pb-6">
            <div className="mb-8">
                <p className="text-[rgba(84,67,67,0.7)]">
                    Overview of your car service expenses and trends
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">
                                Total Money Spent
                            </h3>
                            <p className="text-2xl font-bold text-[rgba(119,150,109,1)]">
                                ${stats.totalSpent.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-3 bg-[rgba(119,150,109,0.1)] rounded-full">
                            <Euro size={24} className="text-[rgba(119,150,109,1)]" />
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">
                                Avg. Appointment Cost
                            </h3>
                            <p className="text-2xl font-bold text-[rgba(189,198,103,1)]">
                                ${stats.averageAppointmentCost.toFixed(2)}
                            </p>
                        </div>
                        <div className="p-3 bg-[rgba(189,198,103,0.1)] rounded-full">
                            <TrendingUp size={24} className="text-[rgba(189,198,103,1)]" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">
                        Money Spent by Car per Year
                    </h3>
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
                            <Tooltip content={<BarTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "14px" }} />
                            {barKeys.map((car, i) => (
                                <Bar
                                    key={car}
                                    dataKey={car}
                                    name={car}
                                    fill={stats.spentByCar.find(d => d.name === car)?.color ?? COLORS[i]}
                                    radius={[2, 2, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                    <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">
                        Spending Distribution by Car
                    </h3>
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
                                {stats.spentByCar.map(entry => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                content={props => <PieTooltip {...props} total={stats.totalSpent} />}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
                <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">
                    Average Appointment Cost by Car
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        layout="vertical"
                        data={stats.avgCostByCar}
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                    >
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
                            formatter={(v: any) => [`$${v}`, "Average Cost"]}
                            labelStyle={{ color: "rgba(84,67,67,1)" }}
                            contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid rgba(189,198,103,0.3)",
                                borderRadius: "8px",
                            }}
                        />
                        <Bar dataKey="average" fill="rgba(119,150,109,1)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}