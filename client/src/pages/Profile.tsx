"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar"

import useCarStore from "../stores/carStore"
import CarCard from "../components/CarCard"

export default function Profile() {
    const [carData, setCarData] = useState({
        brand: "",
        model: "",
        yearOfProduction: "",
        engineType: "",
        kilometrage: "",
        plateNumber: "",
        isInsured: false,
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement
        const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

        setCarData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const { cars, addCar, fetchCars, deleteCar } = useCarStore()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Car data submitted:", carData)

        addCar(carData)

        setCarData({
            brand: "",
            model: "",
            yearOfProduction: "",
            engineType: "",
            kilometrage: "",
            plateNumber: "",
            isInsured: false,
        })
    }

    const handleDelete = (id: number) => {
        deleteCar(id)
    }

    useEffect(() => {
        fetchCars();
    }, [fetchCars])

    return (
        <main className="min-h-screen bg-[#f8f9f4]">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-contrast-primary mb-6">Profile</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-[rgba(189,198,103,0.3)]">
                            <h2 className="text-xl font-semibold text-contrast-primary mb-4">Add a Car</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="brand" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                                            Brand
                                        </label>
                                        <input
                                            type="text"
                                            id="brand"
                                            name="brand"
                                            value={carData.brand}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="model" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                                            Model
                                        </label>
                                        <input
                                            type="text"
                                            id="model"
                                            name="model"
                                            value={carData.model}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="yearOfProduction"
                                            className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1"
                                        >
                                            Year of Production
                                        </label>
                                        <input
                                            type="number"
                                            id="yearOfProduction"
                                            name="yearOfProduction"
                                            value={carData.yearOfProduction}
                                            onChange={handleChange}
                                            min="1900"
                                            max={new Date().getFullYear()}
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="plateNumber"
                                            className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1"
                                        >
                                            Plate Number
                                        </label>
                                        <input
                                            type="text"
                                            id="plateNumber"
                                            name="plateNumber"
                                            value={carData.plateNumber}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="engineType" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                                            Engine Type
                                        </label>
                                        <select
                                            id="engineType"
                                            name="engineType"
                                            value={carData.engineType}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        >
                                            <option value="">Select engine type</option>
                                            <option value="gasoline">Gasoline</option>
                                            <option value="diesel">Diesel</option>
                                            <option value="electric">Electric</option>
                                            <option value="hybrid">Hybrid</option>
                                            <option value="plugin_hybrid">Plug-in Hybrid</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="kilometrage" className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-1">
                                            Kilometrage
                                        </label>
                                        <input
                                            type="number"
                                            id="kilometrage"
                                            name="kilometrage"
                                            value={carData.kilometrage}
                                            onChange={handleChange}
                                            min="0"
                                            className="w-full px-3 py-2 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isInsured"
                                            name="isInsured"
                                            checked={carData.isInsured}
                                            onChange={handleChange}
                                            className="h-4 w-4 border-secondary rounded focus:ring-primary"
                                        />
                                        <label htmlFor="isInsured" className="ml-2 block text-sm text-[rgba(84,67,67,0.9)]">
                                            Is Insured
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full mt-2 py-2 px-4 bg-secondary hover:bg-tertiary text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                                    >
                                        Add Car
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="w-full md:w-2/3">
                        <div className="bg-white rounded-lg shadow-md p-6 border border-[rgba(189,198,103,0.3)]">

                            {cars.length > 0 ?
                                (<>
                                    <h2 className="text-xl font-semibold text-contrast-primary mb-4">Your registered cars</h2>
                                    {
                                        cars.map((car) => {

                                            return (
                                                <div className="mb-4" key={car.id}>
                                                    <CarCard car={car}
                                                    onDelete={() => handleDelete(car.id)} />
                                                </div>
                                            )
                                        })
                                    }
                                </>)
                                :
                                (<h2 className="text-xl font-semibold text-contrast-primary mb-4">You have no registered cars. Consider adding one using the form.</h2>)
                            }

                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
