"use client"

import { useEffect, useState } from "react"
import { CheckCircle, Home } from "lucide-react"
import { useNavigate } from "react-router"

export default function SuccessPayment() {
    const [countdown, setCountdown] = useState(5)
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    navigate("/")
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [navigate])

    return (
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center border border-[rgba(189,198,103,0.3)]">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-[rgba(119,150,109,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={48} className="text-[rgba(119,150,109,1)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-2">Payment Successful!</h1>
                    <p className="text-[rgba(84,67,67,0.7)]">
                        Your payment has been processed successfully. Thank you for your business!
                    </p>
                </div>

                <div className="bg-[rgba(119,150,109,0.05)] rounded-lg p-4 mb-6 border border-[rgba(119,150,109,0.2)]">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[rgba(84,67,67,0.7)]">Status:</span>
                            <span className="font-medium text-[rgba(119,150,109,1)]">Completed</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[rgba(84,67,67,0.7)]">Transaction:</span>
                            <span className="font-medium text-[rgba(84,67,67,1)]">Confirmed</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-[rgba(84,67,67,0.7)]">
                        <Home size={16} />
                        <span className="text-sm">Redirecting to home page in</span>
                        <span className="font-bold text-[rgba(119,150,109,1)] text-lg">{countdown}</span>
                        <span className="text-sm">seconds</span>
                    </div>

                    <div className="w-full bg-[rgba(189,198,103,0.2)] rounded-full h-2">
                        <div
                            className="bg-[rgba(119,150,109,1)] h-2 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                        ></div>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                        <Home size={18} className="mr-2" />
                        Go to Home Now
                    </button>
                </div>
            </div>
        </main>
    )
}
