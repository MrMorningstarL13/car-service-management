"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MapPin, Building, Save, Edit, Calendar } from "lucide-react"
import useServiceStore from "../stores/serviceStore"
import { toast } from "react-hot-toast"
import userStore from "../stores/userStore"

interface ServiceInfo {
    name: string
    address: string
    city: string
    max_no_appointments: number
}

export default function ServiceInfoEditor() {
    const { currentService, getById, update } = useServiceStore()

    const currentUser: any = userStore.getState().user
    const serviceId = currentUser?.employee?.serviceId

    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        getById(serviceId).then((service) => {
            setServiceInfo({
                name: service.name || "",
                address: service.address || "",
                city: service.city || "",
                max_no_appointments: service.max_no_appointments || 0,
            })
        })
    }, [getById])

    const [serviceInfo, setServiceInfo] = useState<ServiceInfo>({
        name: currentService.name || "",
        address: currentService.address || "",
        city: currentService.city || "",
        max_no_appointments: currentService.max_no_appointments || 0,
    })

    const [editData, setEditData] = useState<ServiceInfo>(serviceInfo)

    console.log(currentService)
    console.log(serviceId)

    useEffect(() => {
        if (currentService && currentService.name) {
            setServiceInfo({
                name: currentService.name || "",
                address: currentService.address || "",
                city: currentService.city || "",
                max_no_appointments: currentService.max_no_appointments || 0,
            })
        }
    }, [currentService])

    const handleEdit = () => {
        setEditData(serviceInfo)
        setIsEditing(true)
    }

    const handleSave = async () => {
        try {
            await update(serviceId, {
                name: editData.name,
                address: editData.address,
                city: editData.city,
                max_no_appointments: editData.max_no_appointments,
            })
            setIsEditing(false)
            toast.success("Service information updated successfully!")
        } catch (error) {
            toast.error("Failed to update service information.")
        }
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
            <div className="flex justify-center items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">Service Information</h2>
                    <p className="text-[rgba(84,67,67,0.7)]">Manage your business details and contact information</p>
                </div>
            </div>
            <div className="flex justify-center items-center">
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
                                    name="address"
                                    value={editData.address}
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
                        <div>
                            <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Max Daily Appointments</label>
                            <input
                                type="number"
                                name="max_no_appointments"
                                value={editData.max_no_appointments}
                                onChange={handleChange}
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                            />
                            <p className="text-xs text-[rgba(84,67,67,0.6)] mt-1">
                                Maximum number of appointments that can be scheduled per day
                            </p>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-center">
                                    <MapPin size={20} className="text-[rgba(119,150,109,1)] mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-[rgba(84,67,67,1)]">Address</p>
                                        <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.address}</p>
                                        <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.city}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start justify-center">
                                    <Calendar size={20} className="text-[rgba(119,150,109,1)] mr-3 mt-1" />
                                    <div>
                                        <p className="font-medium text-[rgba(84,67,67,1)]">Daily Capacity</p>
                                        <p className="text-[rgba(84,67,67,0.7)]">{serviceInfo.max_no_appointments} appointments per day</p>
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
