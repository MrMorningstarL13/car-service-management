"use client"

import { useEffect, useState } from "react"
import { XCircle, Home, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router"

export default function CancelPayment() {
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

    const handleRetryPayment = () => {
        navigate(-1)
    }

    return (
        <main className="min-h-screen bg-[#f8f9f4] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 text-center border border-[rgba(189,198,103,0.3)]">
                <div className="mb-6">
                    <div className="w-20 h-20 bg-[rgba(86,40,45,0.1)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle size={48} className="text-[rgba(86,40,45,1)]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgba(84,67,67,1)] mb-2">Payment Cancelled</h1>
                    <p className="text-[rgba(84,67,67,0.7)]">
                        Your payment was cancelled. No charges have been made to your account.
                    </p>
                </div>

                <div className="bg-[rgba(86,40,45,0.05)] rounded-lg p-4 mb-6 border border-[rgba(86,40,45,0.2)]">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[rgba(84,67,67,0.7)]">Status:</span>
                            <span className="font-medium text-[rgba(86,40,45,1)]">Cancelled</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[rgba(84,67,67,0.7)]">Transaction:</span>
                            <span className="font-medium text-[rgba(84,67,67,1)]">Not processed</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <button
                        onClick={handleRetryPayment}
                        className="w-full px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                    >
                        <RefreshCw size={18} className="mr-2" />
                        Try Payment Again
                    </button>
                </div>

                {/* Countdown and Redirect */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2 text-[rgba(84,67,67,0.7)]">
                        <Home size={16} />
                        <span className="text-sm">Redirecting to home page in</span>
                        <span className="font-bold text-[rgba(86,40,45,1)] text-lg">{countdown}</span>
                        <span className="text-sm">seconds</span>
                    </div>

                    <div className="w-full bg-[rgba(189,198,103,0.2)] rounded-full h-2">
                        <div
                            className="bg-[rgba(86,40,45,1)] h-2 rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                        ></div>
                    </div>

                    <button
                        onClick={() => navigate("/")}
                        className="w-full px-4 py-2 border border-[rgba(189,198,103,1)] text-[rgba(84,67,67,1)] rounded-md hover:bg-[rgba(189,198,103,0.1)] transition-colors duration-200 flex items-center justify-center"
                    >
                        <Home size={18} className="mr-2" />
                        Go to Home Now
                    </button>
                </div>
            </div>
        </main>
    )
}
