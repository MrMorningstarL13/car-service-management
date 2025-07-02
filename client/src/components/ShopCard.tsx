"use client"

import { MapPin, Car } from "lucide-react"
import { useEffect, useState } from "react"
import BookingMenu from "./BookingMenu"
import ServiceDetailsDialog from "./ServiceDetailsDialog"
import useFavouriteStore from "../stores/useFavouriteStore"
import useUserStore from "../stores/userStore"
import toast from "react-hot-toast"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import useFeedbackStore from "../stores/useFeedbackStore"

type service_type = {
    id: number
    name: string
    description: string
    baseCost: number
}

interface ShopProps {
    shop: {
        id: number
        name: string
        address: string
        rating: number
        distance: string
        service_types: service_type[]
        image: string
        lat: string
        lng: string
    }
}

export default function ShopCard({ shop }: ShopProps) {
    const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false)
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [bookingKey, setBookingKey] = useState(0)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isFavourite, setIsFavourite] = useState(false)

    const { favourites, add, remove } = useFavouriteStore()
    const { user } = useUserStore()
    const { reset } = useFeedbackStore();
    const currentUser: any = user

    useEffect(() => {
        let favourite = favourites.find(
            (fav) => Number(fav.serviceId) === Number(shop.id)
        )
        console.log('fav', favourite)
        setIsFavourite(favourite)
    }, [favourites, shop.id])

    const toggleFavourite = async () => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        
        try {
            if (isFavourite) {
                await remove(currentUser.id, String(shop.id))
                toast.success("Service removed from favourites!")
            } else {
                await add(currentUser.id, String(shop.id))
                console.log("serviceCard", favourites)
                toast.success("Service added to favourites!")
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to update favourites")
        } finally {
            setIsUpdating(false);
        }
    }

    const openBookingMenu = () => {
        setIsBookingMenuOpen(true)
    }

    const closeBookingMenu = () => {
        setIsBookingMenuOpen(false)
        setBookingKey((prevKey) => prevKey + 1)
    }

    const openDetailsDialog = () => {
        setIsDetailsDialogOpen(true)
    }

    const closeDetailsDialog = () => {
        setIsDetailsDialogOpen(false)
        reset();
    }

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-[rgba(119,150,109,0.5)] hover:shadow-md transition-shadow duration-300 bg-white">
                <div className="p-4 flex flex-row items-center space-x-4 bg-[rgba(189,198,103,0.2)]">
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)]">{shop.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-tertiary">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{shop.address}</span>
                        </div>
                    </div>

                    <div
                        className={`flex items-center justify-center bg-[rgba(119,150,109,0.2)] px-2 py-1 rounded-full cursor-pointer ${
                            isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[rgba(119,150,109,0.3)]'
                        }`}
                        onClick={toggleFavourite}
                    >
                        {isFavourite ? (
                            <AiFillHeart className="h-6 w-6 text-[rgba(86,40,45,1)]" />
                        ) : (
                            <AiOutlineHeart className="h-6 w-6 text-[rgba(86,40,45,1)]" />
                        )}
                        <span className="font-medium text-[rgba(84,67,67,1)]">{shop.rating}</span>
                    </div>
                </div>

                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <div className="relative h-20 w-32 rounded-md overflow-hidden">
                            {shop.image ? (
                                <img src={shop.image || "/placeholder.svg"} alt={shop.name} className="object-cover w-full h-full" />
                            ) : (
                                <Car className="w-full h-full bg-primary" strokeWidth={1.25} />
                            )}
                        </div>

                        <div className="ml-4">
                            <div className="text-sm text-tertiary">{shop.service_types.length} services available</div>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-[rgba(189,198,103,0.1)] flex justify-between">
                    <button
                        className="px-4 py-2 border border-secondary text-tertiary rounded-md hover:bg-[rgba(119,150,109,0.2)] hover:text-[rgba(84,67,67,1)]"
                        onClick={openDetailsDialog}
                    >
                        View Details
                    </button>
                    <button className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-tertiary" onClick={openBookingMenu}>
                        Book Service
                    </button>
                </div>
            </div>

            {isBookingMenuOpen && (
                <BookingMenu
                    key={bookingKey}
                    isOpen={isBookingMenuOpen}
                    onClose={closeBookingMenu}
                    shopId={shop.id}
                    shopName={shop.name}
                    serviceTypes={shop.service_types}
                />
            )}

            {isDetailsDialogOpen && (
                <ServiceDetailsDialog isOpen={isDetailsDialogOpen} onClose={closeDetailsDialog} shop={shop} />
            )}
        </>
    )
}