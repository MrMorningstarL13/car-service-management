import { MapPin, Star, Car } from "lucide-react"
import { useState } from "react"
import BookingMenu from "./BookingMenu"

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
        image: string,
        lat: string,
        lng: string
    }
}

export default function ShopCard({ shop }: ShopProps) {
    const [isBookingMenuOpen, setIsBookingMenuOpen] = useState(false)
    const [bookingKey, setBookingKey] = useState(0)
    
    const openBookingMenu = () => {
        setIsBookingMenuOpen(true)
    }
    
    const closeBookingMenu = () => {
        setIsBookingMenuOpen(false)
        setBookingKey(prevKey => prevKey + 1)
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
                    <div className="flex items-center bg-[rgba(119,150,109,0.2)] px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 text-[rgba(86,40,45,1)] mr-1" />
                        <span className="font-medium text-[rgba(84,67,67,1)]">{shop.rating}</span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex items-center mb-4">
                        <div className="relative h-20 w-32 rounded-md overflow-hidden">
                            {shop.image ?
                                <img src={shop.image} alt={shop.name} className="object-cover w-full h-full" />
                                :
                                <Car className="w-full h-full bg-primary" strokeWidth={1.25} />
                            }
                        </div>
                        <div className="ml-4">
                            <div className="text-sm text-tertiary">{shop.service_types.length} services available</div>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-[rgba(189,198,103,0.1)] flex justify-between">
                    <button className="px-4 py-2 border border-secondary text-tertiary rounded-md hover:bg-[rgba(119,150,109,0.2)] hover:text-[rgba(84,67,67,1)]">
                        View Details
                    </button>
                    <button 
                        className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-tertiary"
                        onClick={openBookingMenu}
                    >
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
        </>
    )
}