import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import type { Employee } from "../pages/Employees"

interface EmployeeFormData {
  firstName: string
  lastName: string
  hireDate: string
  position: string
  experienceLevel: string
  salary: number
  email?: string
}

interface AddEmployeeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormData) => void
  isLoading: boolean
  employee?: Employee // Optional employee for editing
}

export default function AddEmployeeDialog({ isOpen, onClose, onSubmit, isLoading, employee }: AddEmployeeDialogProps) {
  const isEditing = !!employee

  const [formData, setFormData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    hireDate: new Date().toISOString().split("T")[0],
    position: "",
    experienceLevel: "Junior",
    salary: 45000,
  })

  // Update form data when employee changes or dialog opens
  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        hireDate: employee.hireDate,
        position: employee.position,
        experienceLevel: employee.experienceLevel,
        salary: employee.salary,
        email: employee.email,
      })
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        hireDate: new Date().toISOString().split("T")[0],
        position: "",
        experienceLevel: "Junior",
        salary: 45000,
      })
    }
  }, [employee, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement

    setFormData({
      ...formData,
      [name]: type === "number" ? Number.parseFloat(value) : value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-[rgba(189,198,103,0.3)]">
          <h2 className="text-xl font-semibold text-[rgba(84,67,67,1)]">
            {isEditing ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[rgba(189,198,103,0.1)] text-[rgba(84,67,67,0.7)] transition-colors duration-150"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                  required
                />
              </div>
            </div>

            {isEditing && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ""}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 bg-gray-100 text-[rgba(84,67,67,0.7)] focus:outline-none cursor-not-allowed"
                  disabled
                />
                <p className="mt-1 text-xs text-[rgba(84,67,67,0.6)]">Email cannot be changed</p>
              </div>
            )}

            <div>
              <label htmlFor="hireDate" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                Hire Date
              </label>
              <input
                type="date"
                id="hireDate"
                name="hireDate"
                value={formData.hireDate}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="experienceLevel" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                required
              >
                <option value="Junior">Junior</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
              </select>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                Salary (€)
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[rgba(189,198,103,1)] text-[rgba(84,67,67,1)] rounded-md hover:bg-[rgba(189,198,103,0.1)] transition-colors duration-200"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200 flex items-center"
              disabled={isLoading}
            >
              {isLoading && <Loader2 size={18} className="animate-spin mr-2" />}
              {isEditing ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
