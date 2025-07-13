import { useState } from "react"
import ServiceTypeManagement from "../components/ServiceTypeManagement"
import ServiceInfoEditor from "../components/ServiceInfo"
import ServiceStatistics from "../components/ServiceStats"
import { Settings, BarChart3, Wrench } from "lucide-react"
import Navbar from "../components/Navbar"
import useUserStore from "../stores/userStore"

export default function ServiceManagementPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const currentUser:any = useUserStore.getState().user
    console.log(currentUser)
    const currentServiceId = currentUser.employee.serviceId

    const tabs = [
        { id: "overview", label: "Overview", icon: BarChart3 },
        { id: "service-types", label: "Service Types", icon: Wrench },
        { id: "service-info", label: "Service Info", icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-[#f8f9f4]">
            <Navbar role="rep" />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-2">Service Management</h1>
                    <p className="text-[rgba(84,67,67,0.7)]">Manage business operations and analytics</p>
                </div>

                <div className="bg-white rounded-lg shadow-md border border-[rgba(189,198,103,0.3)] mb-8">
                    <div className="flex flex-wrap border-b border-[rgba(189,198,103,0.2)]">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors duration-200 border-b-2 ${activeTab === tab.id
                                            ? "border-[rgba(119,150,109,1)] text-[rgba(119,150,109,1)] bg-[rgba(119,150,109,0.05)]"
                                            : "border-transparent text-[rgba(84,67,67,0.7)] hover:text-[rgba(84,67,67,1)] hover:bg-[rgba(189,198,103,0.05)]"
                                        }`}
                                >
                                    <Icon size={18} className="mr-2" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    {activeTab === "overview" && <ServiceStatistics serviceId={currentServiceId}/>}
                    {activeTab === "service-types" && <ServiceTypeManagement />}
                    {activeTab === "service-info" && <ServiceInfoEditor />}
                </div>
            </div>
        </div>
    )
}
