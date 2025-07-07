import type React from "react"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import useServiceTypeStore from "../stores/useServiceTypeStore"
import userStore from "../stores/userStore"

interface ServiceType {
    id: number
    name: string
    description: string
    baseCost: number
}

interface ServiceTypeDialogProps {
    isOpen: boolean
    onClose: () => void
    onSave: (serviceType: Omit<ServiceType, "id">) => void
    serviceType?: ServiceType | null
}

export default function ServiceTypeDialog({ isOpen, onClose, onSave, serviceType }: ServiceTypeDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        baseCost: 0,
    })
    const { create } = useServiceTypeStore()

    const currentUser: any = userStore.getState().user
    const serviceId = currentUser.employee.serviceId

    useEffect(() => {
        if (serviceType) {
            setFormData({
                name: serviceType.name,
                description: serviceType.description,
                baseCost: serviceType.baseCost,
            })
        } else {
            setFormData({
                name: "",
                description: "",
                baseCost: 0,
            })
        }
    }, [serviceType, isOpen])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        create(formData, serviceId)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target
        setFormData({
            ...formData,
            [name]: type === "number" ? Number.parseFloat(value) : value,
        })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex justify-between items-center p-6 border-b border-[rgba(189,198,103,0.3)]">
                    <h2 className="text-xl font-semibold text-[rgba(84,67,67,1)]">
                        {serviceType ? "Edit Service Type" : "Add Service Type"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-[rgba(189,198,103,0.1)] text-[rgba(84,67,67,0.7)]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">Service Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none resize-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">Base Cost ($)</label>
                            <input
                                type="number"
                                name="baseCost"
                                value={formData.baseCost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
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
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
                        >
                            {serviceType ? "Update" : "Add"} Service Type
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
