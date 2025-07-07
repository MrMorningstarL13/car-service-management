"use client"

import { MapPin, Car, Star } from "lucide-react"
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
  const [averageRating, setAverageRating] = useState<number>(0)
  const [isLoadingRating, setIsLoadingRating] = useState(true)

  const { favourites, add, remove } = useFavouriteStore()
  const { user } = useUserStore()
  const { reset, getAverage } = useFeedbackStore()
  const currentUser: any = user

  useEffect(() => {
    const favourite = favourites.find((fav) => Number(fav.serviceId) === Number(shop.id))
    console.log("fav", favourite)
    setIsFavourite(favourite)
  }, [favourites, shop.id])

  // Load average rating when component mounts
  useEffect(() => {
    const loadAverageRating = async () => {
      setIsLoadingRating(true)
      try {
        const rating = await getAverage(shop.id)
        setAverageRating(rating || 0)
      } catch (error) {
        console.error("Error loading average rating:", error)
        setAverageRating(0)
      } finally {
        setIsLoadingRating(false)
      }
    }

    loadAverageRating()
  }, [shop.id, getAverage])

  const toggleFavourite = async () => {
    if (isUpdating) return

    setIsUpdating(true)

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
      setIsUpdating(false)
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
    reset()
  }

  // Function to render stars based on rating (out of 10, showing 5 stars)
  const renderStars = (rating: number) => {
    const starRating = rating / 2 // Convert 10-point scale to 5-point scale
    const fullStars = Math.floor(starRating)
    const hasHalfStar = starRating % 1 >= 0.5

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={`${
              star <= fullStars
                ? "fill-[rgba(189,198,103,1)] text-[rgba(189,198,103,1)]"
                : star === fullStars + 1 && hasHalfStar
                  ? "fill-[rgba(189,198,103,0.5)] text-[rgba(189,198,103,1)]"
                  : "text-[rgba(189,198,103,0.3)]"
            }`}
          />
        ))}
      </div>
    )
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
            {/* Rating Display */}
            <div className="flex items-center mt-2 space-x-2">
              {isLoadingRating ? (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-[rgba(189,198,103,0.3)] rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-[rgba(189,198,103,0.3)] rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-[rgba(189,198,103,0.3)] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[rgba(84,67,67,0.5)]">Loading...</span>
                </div>
              ) : averageRating > 0 ? (
                <>
                  {renderStars(averageRating)}
                  <span className="text-xs font-medium text-[rgba(84,67,67,0.8)]">{averageRating.toFixed(1)}/10</span>
                </>
              ) : (
                <span className="text-xs text-[rgba(84,67,67,0.5)]">No reviews yet</span>
              )}
            </div>
          </div>
          <div
            className={`flex items-center justify-center bg-[rgba(119,150,109,0.2)] px-2 py-1 rounded-full cursor-pointer ${
              isUpdating ? "opacity-50 cursor-not-allowed" : "hover:bg-[rgba(119,150,109,0.3)]"
            }`}
            onClick={toggleFavourite}
          >
            {isFavourite ? (
              <AiFillHeart className="h-6 w-6 text-[rgba(86,40,45,1)]" />
            ) : (
              <AiOutlineHeart className="h-6 w-6 text-[rgba(86,40,45,1)]" />
            )}
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
