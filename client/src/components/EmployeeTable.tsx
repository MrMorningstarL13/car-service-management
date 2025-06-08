import { useState } from "react"
import type { Employee } from "../pages/Employees"
import { ArrowUpDown, Edit, Trash2, Loader2 } from "lucide-react"

interface EmployeeTableProps {
  employees: Employee[]
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  isLoading: boolean
}

export default function EmployeeTable({ employees, onEdit, onDelete, isLoading }: EmployeeTableProps) {
  const [sortField, setSortField] = useState<keyof Employee>("lastName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Employee) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(salary)
  }

  const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  
  if (isNaN(date.getTime())) {
    return dateString // Return original if invalid
  }
  
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date)
}

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[rgba(189,198,103,0.3)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(189,198,103,0.1)] border-b border-[rgba(189,198,103,0.3)]">
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("firstName")}
              >
                <div className="flex items-center justify-center">
                  First Name
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("lastName")}
              >
                <div className="flex items-center justify-center">
                  Last Name
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center justify-center">
                  Email
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("hireDate")}
              >
                <div className="flex items-center justify-center">
                  Hire Date
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("position")}
              >
                <div className="flex items-center justify-center">
                  Position
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("experienceLevel")}
              >
                <div className="flex items-center justify-center">
                  Experience
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-sm font-semibold text-[rgba(84,67,67,1)] cursor-pointer"
                onClick={() => handleSort("salary")}
              >
                <div className="flex items-center justify-center">
                  Salary
                  <ArrowUpDown size={16} className="ml-1" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[rgba(84,67,67,1)]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(189,198,103,0.2)]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 size={24} className="animate-spin text-[rgba(119,150,109,1)] mr-2" />
                    <span className="text-[rgba(84,67,67,0.7)]">Loading employees...</span>
                  </div>
                </td>
              </tr>
            ) : sortedEmployees.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-[rgba(84,67,67,0.7)]">
                  No employees found. Add your first employee to get started.
                </td>
              </tr>
            ) : (
              sortedEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[rgba(189,198,103,0.05)] transition-colors duration-150">
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{employee.firstName}</td>
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{employee.lastName}</td>
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{employee.email}</td>
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{formatDate(employee.hireDate)}</td>
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{employee.position}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceBadgeColor(employee.experienceLevel)}`}
                    >
                      {employee.experienceLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[rgba(84,67,67,1)]">{formatSalary(employee.salary)}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onEdit(employee)}
                        className="p-1.5 text-[rgba(119,150,109,1)] hover:bg-[rgba(119,150,109,0.1)] rounded-md transition-colors duration-150"
                        title="Edit employee"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(employee)}
                        className="p-1.5 text-[rgba(86,40,45,1)] hover:bg-[rgba(86,40,45,0.1)] rounded-md transition-colors duration-150"
                        title="Delete employee"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function getExperienceBadgeColor(level: string) {
  switch (level) {
    case "Junior":
      return "bg-blue-100 text-blue-800"
    case "Mid-level":
      return "bg-[rgba(189,198,103,0.2)] text-[rgba(98,109,88,1)]"
    case "Senior":
      return "bg-[rgba(119,150,109,0.2)] text-[rgba(98,109,88,1)]"
    case "Lead":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
