"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "./ui/Dialog"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { Calendar } from "./ui/Calendar"
import { format } from "date-fns"
import { Car, CalendarIcon, Wrench, CheckCircle2, ChevronRight, ChevronLeft, X, Clock3 } from "lucide-react"

import carStore from "../stores/carStore"
import useAppointmentStore from "../stores/appointmentStore"

interface Vehicle {
    id: string
    brand: string;
    model: string;
    yearOfProduction: string;
    engineType: string;
    kilometrage: string;
    isInsured: boolean;
}

type service_type = {
    id: number
    name: string
    description: string
    baseCost: number
}

interface BookingWizardProps {
    isOpen: boolean
    onClose: () => void
    shopId: number
    shopName: string
    serviceTypes: service_type[]
}

export default function BookingWizard({ isOpen, onClose, shopId, shopName, serviceTypes }: BookingWizardProps) {
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedServices, setSelectedServices] = useState<string[]>([])

    const { cars } = carStore();
    const { create } = useAppointmentStore();

    const vehicles: Vehicle[] = cars.map((car: any) => ({
        id: String(car.id),
        brand: car.brand ?? "",
        model: car.model ?? "",
        engineType: car.engineType ?? "",
        kilometrage: car.kilometrage ?? "",
        isInsured: car.isInsured ?? false,
        yearOfProduction: car.year ?? car.yearOfProduction ?? "",
    }));

    const services: service_type[] = serviceTypes

    const timeSlots = [
        "9:00 AM",
        "9:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
        "1:00 PM",
        "1:30 PM",
        "2:00 PM",
        "2:30 PM",
        "3:00 PM",
        "3:30 PM",
        "4:00 PM",
    ]

    const toggleVehicle = (id: string) => {
        if (selectedVehicles.includes(id)) {
            setSelectedVehicles(selectedVehicles.filter((v) => v !== id))
        } else {
            setSelectedVehicles([...selectedVehicles, id])
        }
    }

    const toggleService = (id: string) => {
        if (selectedServices.includes(id)) {
            setSelectedServices(selectedServices.filter((s) => s !== id))
        } else {
            setSelectedServices([...selectedServices, id])
        }
    }

    const nextStep = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = async () => {
        let priority = "normal"
        for(let service of services){
            if(service.name.toLowerCase().includes(`premium service`))
                priority = 'premium'
        }

        let date = selectedDate;
        

        const appointmentData = {priority, date}

        for (const vehicleId of selectedVehicles) {
            console.log({
                shopId,
                vehicleId,
                vehicles: selectedVehicles,
                date: selectedDate,
                time: selectedTime,
                services: selectedServices,
            })
            // const result = await create(vehicleId, shopId, appointmentData)
            // console.log(result)
        }


        onClose()
    }

    const isNextDisabled = () => {
        switch (currentStep) {
            case 1:
                return selectedVehicles.length === 0
            case 2:
                return !selectedDate || !selectedTime
            case 3:
                return selectedServices.length === 0
            default:
                return false
        }
    }

    const calculateTotal = () => {
        return (
            selectedServices.reduce((total, serviceId) => {
                const service = services.find((s) => s.id === Number(serviceId))
                return total + (service?.baseCost || 0)
            }, 0) * selectedVehicles.length
        )
    }

    const getSelectedVehicles = () => {
        return vehicles.filter((v) => selectedVehicles.includes(v.id))
    }

    const getSelectedServiceNames = () => {
        return services.filter((s) => selectedServices.includes(String(s.id))).map((s) => s.name)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open: any) => !open && onClose()}>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden" title="Book a service appointment">
                <div className="bg-primary/20 p-6 border-b border-secondary/20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-contrast-primary">Book Service</h2>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8">
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-secondary text-white" : "bg-secondary/20 text-tertiary"
                                    }`}
                            >
                                <Car className="h-5 w-5" />
                            </div>
                            <span className={`text-xs mt-1 ${currentStep >= 1 ? "text-contrast-primary" : "text-tertiary"}`}>
                                Vehicles
                            </span>
                        </div>

                        <div
                            className={`h-0.5 flex-1 self-center mt-[-10px] ${currentStep >= 2 ? "bg-secondary" : "bg-secondary/20"}`}
                        />

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-secondary text-white" : "bg-secondary/20 text-tertiary"
                                    }`}
                            >
                                <CalendarIcon className="h-5 w-5" />
                            </div>
                            <span className={`text-xs mt-1 ${currentStep >= 2 ? "text-contrast-primary" : "text-tertiary"}`}>
                                Schedule
                            </span>
                        </div>

                        <div
                            className={`h-0.5 flex-1 self-center mt-[-10px] ${currentStep >= 3 ? "bg-secondary" : "bg-secondary/20"}`}
                        />

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-secondary text-white" : "bg-secondary/20 text-tertiary"
                                    }`}
                            >
                                <Wrench className="h-5 w-5" />
                            </div>
                            <span className={`text-xs mt-1 ${currentStep >= 3 ? "text-contrast-primary" : "text-tertiary"}`}>
                                Services
                            </span>
                        </div>

                        <div
                            className={`h-0.5 flex-1 self-center mt-[-10px] ${currentStep >= 4 ? "bg-secondary" : "bg-secondary/20"}`}
                        />

                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 4 ? "bg-secondary text-white" : "bg-secondary/20 text-tertiary"
                                    }`}
                            >
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <span className={`text-xs mt-1 ${currentStep >= 4 ? "text-contrast-primary" : "text-tertiary"}`}>
                                Confirm
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content area */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Step 1: Vehicle Selection */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-contrast-primary">Select Your Vehicles</h3>
                                <p className="text-sm text-tertiary mt-1">Choose one or more vehicles for service at {shopName}</p>
                            </div>

                            <div className="grid gap-4">
                                {vehicles.map((vehicle) => (
                                    <div
                                        key={vehicle.id}
                                        onClick={() => toggleVehicle(vehicle.id)}
                                        className={`p-4 rounded-lg cursor-pointer transition-all ${selectedVehicles.includes(vehicle.id)
                                            ? "bg-primary/20 border-2 border-secondary"
                                            : "bg-white border border-secondary/20 hover:border-secondary/50"
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="bg-secondary/10 rounded-lg p-3 mr-4">
                                                <Car className="h-6 w-6 text-secondary" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-contrast-primary">
                                                    {vehicle.yearOfProduction} {vehicle.brand} {vehicle.model}
                                                </h4>
                                            </div>
                                            <div
                                                className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedVehicles.includes(vehicle.id) ? "bg-secondary border-secondary" : "border-tertiary"
                                                    }`}
                                            >
                                                {selectedVehicles.includes(vehicle.id) && <CheckCircle2 className="h-4 w-4 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time Selection */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-contrast-primary">Schedule Your Appointment</h3>
                                <p className="text-sm text-tertiary mt-1">Select a date and time for your service</p>
                            </div>

                            <div className="flex flex-col space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-contrast-primary mb-2">Select Date</h4>
                                    <div className="border border-secondary/20 rounded-lg p-3">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            disabled={(date: any) => {
                                                return date < new Date() || date.getDay() === 0
                                            }}
                                        />
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div>
                                        <h4 className="text-sm font-medium text-contrast-primary mb-2">Select Time</h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            {timeSlots.map((time) => (
                                                <Button
                                                    key={time}
                                                    variant="outline"
                                                    onClick={() => setSelectedTime(time)}
                                                    className={`h-10 ${selectedTime === time
                                                        ? "bg-secondary text-white border-secondary"
                                                        : "border-secondary/20 text-tertiary hover:border-secondary/50"
                                                        }`}
                                                >
                                                    {time}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedDate && selectedTime && (
                                    <div className="bg-primary/20 p-4 rounded-lg">
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-5 w-5 text-secondary mr-2" />
                                            <div>
                                                <p className="text-sm font-medium text-contrast-primary">
                                                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                                </p>
                                                <p className="text-sm text-tertiary">{selectedTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Service Selection */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-contrast-primary">Select Services</h3>
                                <p className="text-sm text-tertiary mt-1">Choose the services you need</p>
                            </div>

                            <div className="grid gap-4">
                                {services.map((service) => (
                                    <div
                                        key={service.id}
                                        onClick={() => toggleService(String(service.id))}
                                        className={`p-4 rounded-lg cursor-pointer transition-all ${selectedServices.includes(String(service.id))
                                            ? "bg-primary/20 border-2 border-secondary"
                                            : "bg-white border border-secondary/20 hover:border-secondary/50"
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    <h4 className="font-medium text-contrast-primary">{service.name}</h4>
                                                    <Badge className="ml-2 bg-secondary/10 text-tertiary border-0">
                                                        ${service.baseCost.toFixed(2)}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-tertiary mt-1">{service.description}</p>
                                            </div>
                                            <div
                                                className={`w-6 h-6 rounded-full border flex items-center justify-center ${selectedServices.includes(String(service.id)) ? "bg-secondary border-secondary" : "border-tertiary"
                                                    }`}
                                            >
                                                {selectedServices.includes(String(service.id)) && <CheckCircle2 className="h-4 w-4 text-white" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-contrast-primary">Confirm Your Booking</h3>
                                <p className="text-sm text-tertiary mt-1">Review your appointment details</p>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-contrast-primary mb-2 flex items-center">
                                        <Car className="h-4 w-4 mr-2 text-secondary" />
                                        Vehicles ({selectedVehicles.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {getSelectedVehicles().map((vehicle) => (
                                            <div key={vehicle.id} className="text-sm text-tertiary pl-6">
                                                {vehicle.yearOfProduction} {vehicle.brand} {vehicle.model}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-contrast-primary mb-2 flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-2 text-secondary" />
                                        Appointment Time
                                    </h4>
                                    <div className="text-sm text-tertiary pl-6">
                                        {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at {selectedTime}
                                    </div>
                                </div>

                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <h4 className="text-sm font-medium text-contrast-primary mb-2 flex items-center">
                                        <Wrench className="h-4 w-4 mr-2 text-secondary" />
                                        Services ({selectedServices.length})
                                    </h4>
                                    <div className="space-y-2">
                                        {services
                                            .filter((s) => selectedServices.includes(String(s.id)))
                                            .map((service) => (
                                                <div key={service.id} className="flex justify-between text-sm pl-6">
                                                    <span className="text-tertiary">{service.name}</span>
                                                    <span className="text-contrast-primary font-medium">${service.baseCost.toFixed(2)}</span>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="bg-secondary/10 p-4 rounded-lg mt-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-contrast-primary">Total Estimate</h4>
                                            <p className="text-xs text-tertiary mt-1">
                                                For {selectedVehicles.length} vehicle{selectedVehicles.length > 1 ? "s" : ""}
                                            </p>
                                        </div>
                                        <div className="text-xl font-bold text-contrast-primary">${calculateTotal().toFixed(2)}</div>
                                    </div>
                                </div>

                                <p className="text-xs text-tertiary italic">
                                    Note: Payment will be collected at the shop after service completion.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-secondary/20 flex justify-between">
                    {currentStep > 1 ? (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="border-secondary/30 text-tertiary hover:bg-secondary/10"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                    ) : (
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-secondary/30 text-tertiary hover:bg-secondary/10"
                        >
                            Cancel
                        </Button>
                    )}

                    {currentStep < 4 ? (
                        <Button
                            onClick={nextStep}
                            disabled={isNextDisabled()}
                            className="bg-secondary text-white hover:bg-tertiary"
                        >
                            Continue
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} className="bg-secondary text-white hover:bg-tertiary">
                            Confirm Booking
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
