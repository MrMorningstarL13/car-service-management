import { CheckCircle, Home } from "lucide-react"
import { useNavigate } from "react-router"

export default function SuccessPayment() {
    const navigate = useNavigate()
    console.log("SuccessPayment component rendered")

    const handleClick = () => {
        navigate("/")
    }

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
                
                <button
                    onClick={handleClick}
                    className="w-full px-4 py-2 bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white rounded-md transition-colors duration-200 flex items-center justify-center"
                >
                    <Home size={18} className="mr-2" />
                    Return to Home
                </button>
            </div>
        </main>
    )
}