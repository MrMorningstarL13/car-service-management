"use client"

import { useState, useEffect } from "react"
import { X, MapPin, Star, DollarSign, Wrench, Send, User, Calendar } from "lucide-react"
import useFeedbackStore from "../stores/useFeedbackStore"
import useUserStore from "../stores/userStore"
import toast from "react-hot-toast"

interface ServiceType {
    id: number
    name: string
    description: string
    baseCost: number
}

interface Feedback {
    id: number
    rating: number
    comment: string
    author: string
    createdAt: string
}

interface ServiceDetailsDialogProps {
    isOpen: boolean
    onClose: () => void
    shop: {
        id: number
        name: string
        address: string
        rating: number
        service_types: ServiceType[]
    }
}

export default function ServiceDetailsDialog({ isOpen, onClose, shop }: ServiceDetailsDialogProps) {
    const [activeTab, setActiveTab] = useState("services")
    const [newFeedback, setNewFeedback] = useState({ rating: 0, comment: "" })
    const [hoveredStar, setHoveredStar] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { feedbacks, getAll, create } = useFeedbackStore()
    const { user } = useUserStore()
    const currentUser: any = user

    useEffect(() => {
        if (isOpen) {
            loadFeedbacks()
        }
    }, [isOpen, shop.id])

    const loadFeedbacks = async () => {
        try {
            await getAll(shop.id)
        } catch (error) {
            console.error("Error loading feedbacks:", error)
        }
    }

    const handleSubmitFeedback = async () => {
        if (!newFeedback.rating || !newFeedback.comment.trim()) {
            toast.error("Please provide both rating and comment")
            return
        }

        setIsSubmitting(true)
        try {
            await create(currentUser.id, shop.id, {
                rating: newFeedback.rating,
                comment: newFeedback.comment.trim(),
            })

            setNewFeedback({ rating: 0, comment: "" })
            toast.success("Feedback submitted successfully!")
            await loadFeedbacks()
        } catch (error) {
            console.error("Error submitting feedback:", error)
            toast.error("Failed to submit feedback. Please make sure you have an appointment at this service.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const renderStars = (rating: number, interactive = false, size = 20) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${star <= (interactive ? hoveredStar || newFeedback.rating : rating)
                            ? "fill-contrast-primary text-contrast-primary"
                            : "text-contrast-primary"
                            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
                        onClick={interactive ? () => setNewFeedback({ ...newFeedback, rating: star }) : undefined}
                        onMouseEnter={interactive ? () => setHoveredStar(star) : undefined}
                        onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
                    />
                ))}
            </div>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    console.log(feedbacks)

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-[rgba(189,198,103,0.3)] bg-[rgba(189,198,103,0.1)]">
                    <div>
                        <h2 className="text-2xl font-bold text-[rgba(84,67,67,1)]">{shop.name}</h2>
                        <div className="flex items-center mt-1 text-[rgba(84,67,67,0.7)]">
                            <MapPin size={16} className="mr-1" />
                            <span>{shop.address}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-[rgba(189,198,103,0.2)] text-[rgba(84,67,67,0.7)] transition-colors duration-150"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="flex border-b border-[rgba(189,198,103,0.2)]">
                    {[
                        { id: "services", label: "Services", icon: Wrench },
                        { id: "reviews", label: "Reviews", icon: Star },
                        { id: "location", label: "Location", icon: MapPin },
                    ].map((tab) => {
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
                                {tab.id === "reviews" && feedbacks.length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[rgba(119,150,109,0.2)] text-[rgba(119,150,109,1)]">
                                        {feedbacks.length}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {/* Services Tab */}
                    {activeTab === "services" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)] mb-4">Available Services</h3>
                            {shop.service_types.length === 0 ? (
                                <div className="items-center text-contrast-primary">
                                    <p>There are no service types available at the moment. Please check back again soon!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {shop.service_types.map((service) => (
                                        <div
                                            key={service.id}
                                            className="p-4 border border-[rgba(189,198,103,0.3)] rounded-lg hover:shadow-md transition-shadow duration-200"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-semibold text-[rgba(84,67,67,1)]">{service.name}</h4>
                                                <div className="flex items-center text-[rgba(119,150,109,1)] font-bold">
                                                    <DollarSign size={16} />
                                                    <span>{service.baseCost}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-[rgba(84,67,67,0.7)]">{service.description}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "reviews" && (
                        <div className="space-y-6">
                            <div className="bg-[rgba(189,198,103,0.05)] p-4 rounded-lg border border-[rgba(189,198,103,0.2)]">
                                <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)] mb-4">Leave a Review</h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">
                                            Rating (1-10 stars)
                                        </label>
                                        {renderStars(newFeedback.rating, true, 24)}
                                        {newFeedback.rating > 0 && (
                                            <span className="ml-2 text-sm text-[rgba(84,67,67,0.7)]">{newFeedback.rating}/10</span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[rgba(84,67,67,0.9)] mb-2">Your Review</label>
                                        <textarea
                                            value={newFeedback.comment}
                                            onChange={(e) => setNewFeedback({ ...newFeedback, comment: e.target.value })}
                                            placeholder="Share your experience with this service..."
                                            rows={3}
                                            className="w-full px-3 py-2 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSubmitFeedback}
                                        disabled={isSubmitting || !newFeedback.rating || !newFeedback.comment.trim()}
                                        className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${isSubmitting || !newFeedback.rating || !newFeedback.comment.trim()
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-[rgba(119,150,109,1)] hover:bg-[rgba(98,109,88,1)] text-white"
                                            }`}
                                    >
                                        <Send size={16} className="mr-2" />
                                        {isSubmitting ? "Submitting..." : "Submit Review"}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)] mb-4">
                                    Customer Reviews ({feedbacks.length})
                                </h3>

                                {feedbacks.length === 0 ? (
                                    <div className="text-center py-8 text-[rgba(84,67,67,0.6)]">
                                        <Star size={48} className="mx-auto mb-4 text-[rgba(189,198,103,0.3)]" />
                                        <p>No reviews yet. Be the first to leave a review!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {feedbacks.map((feedback) => (
                                            <div key={feedback.id} className="p-4 border border-[rgba(189,198,103,0.2)] rounded-lg bg-white">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-[rgba(119,150,109,0.1)] rounded-full mr-3">
                                                            <User size={16} className="text-[rgba(119,150,109,1)]" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-[rgba(84,67,67,1)]">{feedback.author}</p>
                                                            <div className="flex items-center">
                                                                {renderStars(feedback.rating, false, 14)}
                                                                <span className="ml-2 text-xs text-[rgba(84,67,67,0.6)]">{feedback.rating}/10</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-xs text-[rgba(84,67,67,0.5)]">
                                                        <Calendar size={12} className="mr-1" />
                                                        {formatDate(feedback.createdAt)}
                                                    </div>
                                                </div>
                                                <p className="text-[rgba(84,67,67,0.8)] text-sm leading-relaxed">{feedback.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "location" && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[rgba(84,67,67,1)] mb-4">Location</h3>

                            <div className="bg-[rgba(189,198,103,0.1)] border-2 border-dashed border-[rgba(189,198,103,0.3)] rounded-lg p-12 text-center">
                                <MapPin size={64} className="mx-auto mb-4 text-[rgba(119,150,109,1)]" />
                                <h4 className="text-lg font-medium text-[rgba(84,67,67,1)] mb-2">Interactive Map</h4>
                                <p className="text-[rgba(84,67,67,0.7)]">Map integration coming soon</p>
                                <p className="text-sm text-[rgba(84,67,67,0.6)] mt-2">{shop.address}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
