import { Calendar, Gauge, Fuel, Check, X, AlertTriangle, IdCard } from "lucide-react"
import useCarStore from "../stores/carStore";
import { useEffect, useState } from "react"

export interface CarData {
    id: number
    brand: string
    model: string
    yearOfProduction: string
    engineType: string
    kilometrage: string
    plateNumber: string
    isInsured: boolean
}

interface CarCardProps {
    car: CarData
    onDelete: (id: number) => void
}

export default function CarCard({ car, onDelete }: CarCardProps) {

    const getEngineDisplayName = (type: string) => {
        const types: Record<string, string> = {
            gasoline: "Gasoline",
            diesel: "Diesel",
            electric: "Electric",
            hydrid: "Hybrid",
            plugin_hybrid: "Plug-in Hybrid",
        }
        return types[type]
    }

    const getEngineTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            gasoline: "#E74C3C",
            diesel: "#34495E",
            electric: "#3498DB",
            hybrid: "#27AE60",
            plugin_hybrid: "#2ECC71",
        }
        return colors[type]
    }

    const { getImage } = useCarStore()
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    useEffect(() => {
        const fetchImage = async () => {
            const image = await getImage(car.brand, car.model, car.yearOfProduction);
            console.warn(image);
            setImageUrl(image.data.imageUrl);
        };
        fetchImage();
    }, [car.brand, car.model, car.yearOfProduction, getImage]);

    return (
        <div className="car-card overflow-hidden rounded-lg border border-[rgba(189,198,103,0.5)] transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 bg-[rgba(119,150,109,0.1)] flex items-center justify-center h-48 md:h-auto">
                    <div className="max-h-60 text-[rgba(119,150,109,0.7)]">
                        <img src={imageUrl!} />
                    </div>
                </div>

                <div className="w-full md:w-3/5 p-5">
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col items-start">
                            <h3 className="text-xl font-bold text-contrast-primary">
                                {car.brand} {car.model}
                            </h3>
                            <div
                                className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                    backgroundColor: `${getEngineTypeColor(car.engineType)}20`,
                                    color: getEngineTypeColor(car.engineType),
                                }}
                            >
                                {getEngineDisplayName(car.engineType)}
                            </div>
                        </div>

                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${car.isInsured ? "bg-[rgba(119,150,109,0.2)]" : "bg-[rgba(86,40,45,0.1)]"
                                }`}
                        >
                            {car.isInsured ? (
                                <Check size={16} className="text-secondary" />
                            ) : (
                                <AlertTriangle size={16} className="text-contrast-secondary" />
                            )}
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center">
                            <Calendar size={18} className="text-secondary mr-2" />
                            <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                <span className="font-medium">Year:</span> {car.yearOfProduction}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Gauge size={18} className="text-secondary mr-2" />
                            <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                <span className="font-medium">Kilometrage:</span> {car.kilometrage.toLocaleString()} km
                            </span>
                        </div>

                        <div className="flex items-center">
                            <Fuel size={18} className="text-secondary mr-2" />
                            <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                <span className="font-medium">Engine:</span> {getEngineDisplayName(car.engineType)}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <IdCard size={18} className="text-secondary mr-2" />
                            <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                <span className="font-medium">Plate Number:</span> {car.plateNumber}
                            </span>
                        </div>

                        <div className="flex items-center">
                            {car.isInsured ? (
                                <>
                                    <Check size={18} className="text-secondary mr-2" />
                                    <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                        <span className="font-medium">Insurance:</span> Active
                                    </span>
                                </>
                            ) : (
                                <>
                                    <X size={18} className="text-contrast-secondary mr-2" />
                                    <span className="text-sm text-[rgba(84,67,67,0.9)]">
                                        <span className="font-medium">Insurance:</span> Not Insured
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-2">
                        <button
                            onClick={() => onDelete(car.id)}
                            className="px-3 py-1 text-sm rounded border border-contrast-secondary text-contrast-secondary hover:bg-[rgba(86,40,45,0.1)] transition-colors duration-200"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}