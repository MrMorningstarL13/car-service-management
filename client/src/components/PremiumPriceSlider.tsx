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
  { name: "Oil Change", value: 35, color: "rgba(119, 150, 109, 1)" },
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
              <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Annual Profit</h3>
              <p className="text-2xl font-bold text-[rgba(119,150,109,1)]">
                ${currentYearData.profit.toLocaleString()}
              </p>
              <p className="text-xs text-[rgba(84,67,67,0.6)]">+12% from last year</p>
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
              <p className="text-xs text-[rgba(84,67,67,0.6)]">Certified technicians</p>
            </div>
            <div className="p-3 bg-[rgba(98,109,88,0.1)] rounded-full">
              <Users size={24} className="text-[rgba(98,109,88,1)]" />
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-[rgba(84,67,67,0.7)]">Monthly Appointments</h3>
              <p className="text-2xl font-bold text-[rgba(86,40,45,1)]">
                {monthlyData[monthlyData.length - 1].appointments}
              </p>
              <p className="text-xs text-[rgba(84,67,67,0.6)]">+8% from last month</p>
            </div>
            <div className="p-3 bg-[rgba(86,40,45,0.1)] rounded-full">
              <Calendar size={24} className="text-[rgba(86,40,45,1)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profit Analysis */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
          <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Annual Profit Analysis</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(189,198,103,0.3)" />
              <XAxis dataKey="year" tick={{ fill: "rgba(84,67,67,0.8)" }} />
              <YAxis tick={{ fill: "rgba(84,67,67,0.8)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid rgba(189,198,103,0.3)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="income" fill="rgba(119, 150, 109, 0.7)" name="Income" />
              <Bar dataKey="expenses" fill="rgba(86, 40, 45, 0.7)" name="Expenses" />
              <Bar dataKey="profit" fill="rgba(189, 198, 103, 1)" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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

      {/* Performance Insights */}
      <div className="bg-white shadow-md rounded-lg p-6 border border-[rgba(189,198,103,0.3)]">
        <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)] mb-4">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[rgba(119,150,109,0.05)] rounded-lg border border-[rgba(119,150,109,0.2)]">
            <div className="flex items-center mb-2">
              <Award size={20} className="text-[rgba(119,150,109,1)] mr-2" />
              <h4 className="font-medium text-[rgba(84,67,67,1)]">Top Service</h4>
            </div>
            <p className="text-sm text-[rgba(84,67,67,0.8)]">Oil changes account for 35% of all services</p>
          </div>
          <div className="p-4 bg-[rgba(189,198,103,0.05)] rounded-lg border border-[rgba(189,198,103,0.2)]">
            <div className="flex items-center mb-2">
              <TrendingUp size={20} className="text-[rgba(189,198,103,1)] mr-2" />
              <h4 className="font-medium text-[rgba(84,67,67,1)]">Growth Rate</h4>
            </div>
            <p className="text-sm text-[rgba(84,67,67,0.8)]">Revenue increased by 12% compared to last year</p>
          </div>
          <div className="p-4 bg-[rgba(98,109,88,0.05)] rounded-lg border border-[rgba(98,109,88,0.2)]">
            <div className="flex items-center mb-2">
              <Users size={20} className="text-[rgba(98,109,88,1)] mr-2" />
              <h4 className="font-medium text-[rgba(84,67,67,1)]">Efficiency</h4>
            </div>
            <p className="text-sm text-[rgba(84,67,67,0.8)]">Average 5.4 appointments per employee per day</p>
          </div>
        </div>
      </div>
    </div>
  )
}
