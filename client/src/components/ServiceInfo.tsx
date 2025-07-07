"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Building, Save, Edit, Calendar } from "lucide-react"

interface ServiceInfo {
  name: string
  street: string
  city: string
  phone: string
  email: string
  description: string
  maxDailyAppointments: number
}

export default function ServiceInfoEditor() {
  const [isEditing, setIsEditing] = useState(false)
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
    name: "Premium Auto Service Center",
    street: "123 Main Street",
    city: "Springfield",
    phone: "(555) 123-4567",
    email: "info@premiumauto.com",
    description:
      "Your trusted partner for all automotive service needs. We provide quality repairs and maintenance with certified technicians.",
    maxDailyAppointments: 20,
  })

  const [editData, setEditData] = useState<ServiceInfo>(serviceInfo)

  const handleEdit = () => {
    setEditData(serviceInfo)
    setIsEditing(true)
  }

  const handleSave = () => {
    setServiceInfo(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData(serviceInfo)
    setIsEditing(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditData({ ...editData, [name]: value })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">Service Information</h2>
          <p className="text-[rgba(84,67,67,0.7)]">Manage your business details and contact information</p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
          >
            <Edit size={18} className="mr-2" />
            Edit Information
          </button>
        )}
      </div>

      {/* Service Info Card */}
      <div className="bg-white rounded-lg shadow-md border border-[rgba(189,198,103,0.3)] p-6">
        {isEditing ? (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Business Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Street Address</label>
                <input
                  type="text"
                  name="street"
                  value={editData.street}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">City</label>
                <input
                  type="text"
                  name="city"
                  value={editData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Max Daily Appointments</label>
              <input
                type="number"
                name="maxDailyAppointments"
                value={editData.maxDailyAppointments}
                onChange={handleChange}
                min="1"
                max="100"
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
              />
              <p className="text-xs text-[rgba(84,67,67,0.6)] mt-1">
                Maximum number of appointments that can be scheduled per day
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Business Description</label>
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none resize-none"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-[rgba(189,198,103,1)] text-[rgba(84,67,67,1)] rounded-md hover:bg-[rgba(189,198,103,0.1)] transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-4">{serviceInfo.name}</h3>
              <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin size={20} className="text-[rgba(119,150,109,1)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[rgba(84,67,67,1)]">Address</p>
                    <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.street}</p>
                    <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.city}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <Building size={20} className="text-[rgba(119,150,109,1)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[rgba(84,67,67,1)]">Contact Information</p>
                    <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.phone}</p>
                    <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar size={20} className="text-[rgba(119,150,109,1)] mr-3 mt-1" />
                  <div>
                    <p className="font-medium text-[rgba(84,67,67,1)]">Daily Capacity</p>
                    <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.maxDailyAppointments} appointments per day</p>
                    <p className="text-xs text-[rgba(84,67,67,0.6)]">Maximum booking capacity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
