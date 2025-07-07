import { useEffect, useState } from "react"
import { Plus, Edit, Trash2, Wrench, DollarSign } from "lucide-react"

import ServiceTypeDialog from "./ServiceTypeDialog"
import DeleteConfirmDialog from "./DeleteConfirmDialog"

import useServiceTypeStore from "../stores/useServiceTypeStore"
import userStore from "../stores/userStore"

interface ServiceType {
    id: number
    name: string
    description: string
    baseCost: number
}

export default function ServiceTypeManagement() {
    const {
        serviceTypes,
        getByShop,
        create,
        update,
        deleteServiceType,
    } = useServiceTypeStore()

    const currentUser: any = userStore.getState().user
    const serviceId = currentUser?.employee?.serviceId

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null)
    const [deletingServiceType, setDeletingServiceType] = useState<ServiceType | null>(null)

    useEffect(() => {
        if (!serviceId) return
        getByShop(serviceId)
    }, [serviceId, getByShop])

    console.log('serviceTypes', serviceTypes)

    const handleAddServiceType = () => {
        setEditingServiceType(null)
        setIsDialogOpen(true)
    }

    const handleEditServiceType = (serviceType: ServiceType) => {
        setEditingServiceType(serviceType)
        setIsDialogOpen(true)
    }

    const handleDeleteServiceType = (serviceType: ServiceType) => {
        setDeletingServiceType(serviceType)
        setIsDeleteDialogOpen(true)
    }

    const handleSaveServiceType = async (serviceTypeData: Omit<ServiceType, "id">) => {
        if (!serviceId) return

        try {
            if (editingServiceType) {
                await update(editingServiceType.id, serviceTypeData)
            } else {
                create(serviceId, serviceTypeData)
            }

            await getByShop(serviceId)
        } finally {
            setIsDialogOpen(false)
            setEditingServiceType(null)
        }
    }

    const confirmDelete = async () => {
        if (!deletingServiceType) return
        await deleteServiceType(deletingServiceType.id)
        setIsDeleteDialogOpen(false)
        setDeletingServiceType(null)
        if (serviceId) await getByShop(serviceId)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">Service Types</h2>
                    <p className="text-[rgba(84,67,67,0.7)]">Manage the services your business offers</p>
                </div>
                <button
                    onClick={handleAddServiceType}
                    className="flex items-center px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200"
                >
                    <Plus size={18} className="mr-2" />
                    Add Service Type
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {serviceTypes.map(serviceType => (
                    <div key={serviceType.id} className="bg-white rounded-lg shadow-md border border-[rgba(189,198,103,0.3)] p-6 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-[rgba(119,150,109,0.1)] rounded-lg mr-3">
                                    <Wrench size={20} className="text-[rgba(119,150,109,1)]" />
                                </div>
                                <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)]">
                                    {serviceType.name}
                                </h3>
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    onClick={() => handleEditServiceType(serviceType)}
                                    className="p-1.5 text-[rgba(119,150,109,1)] hover:bg-[rgba(119,150,109,0.1)] rounded-md transition-colors duration-150"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteServiceType(serviceType)}
                                    className="p-1.5 text-[rgba(86,40,45,1)] hover:bg-[rgba(86,40,45,0.1)] rounded-md transition-colors duration-150"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <p className="text-[rgba(84,67,67,0.7)] text-sm mb-4">
                            {serviceType.description}
                        </p>

                        <div className="flex items-center">
                            <DollarSign size={16} className="text-[rgba(119,150,109,1)] mr-2" />
                            <div>
                                <p className="text-sm font-medium text-[rgba(84,67,67,1)]">
                                    ${serviceType.baseCost}
                                </p>
                                <p className="text-xs text-[rgba(84,67,67,0.6)]">Base Price</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {serviceTypes.length === 0 && (
                <div className="text-center py-12">
                    <Wrench size={48} className="mx-auto text-[rgba(84,67,67,0.4)] mb-4" />
                    <h3 className="text-lg font-medium text-[rgba(84,67,67,1)] mb-2">
                        No service types yet
                    </h3>
                    <p className="text-[rgba(84,67,67,0.6)] mb-4">
                        Add your first service type to get started
                    </p>
                    <button
                        onClick={handleAddServiceType}
                        className="px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md"
                    >
                        Add Service Type
                    </button>
                </div>
            )}

            {isDialogOpen && (
                <ServiceTypeDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSave={handleSaveServiceType}
                    serviceType={editingServiceType}
                />
            )}

            {isDeleteDialogOpen && deletingServiceType && (
                <DeleteConfirmDialog
                    isOpen={isDeleteDialogOpen}
                    onClose={() => setIsDeleteDialogOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Service Type"
                    message={`Are you sure you want to delete "${deletingServiceType.name}"? This action cannot be undone.`}
                />
            )}
        </div>
    )
}
