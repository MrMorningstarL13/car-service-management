import ShopCard from "../components/ShopCard"
import Navbar from "../components/Navbar"
import useServiceStore from "../stores/serviceStore"
import {useEffect} from 'react'

export default function Home() {

  const {services, fetchShops} = useServiceStore()
  useEffect(() => {
    fetchShops()
    console.warn(services)
  }, [fetchShops])

  const shops = services.length > 0 ? services : [
    {
      id: 1,
      name: "Downtown Auto Care",
      address: "123 Main St, Downtown",
      rating: 4.8,
      distance: "0.8 miles",
      availableServices: ["oil-can", "refresh-cw", "alert-octagon", "settings", "thermometer", "battery-charging"],
      image: "https://placehold.co/120x80",
    },
    {
      id: 2,
      name: "Westside Mechanics",
      address: "456 West Ave, Westside",
      rating: 4.5,
      distance: "1.2 miles",
      availableServices: ["oil-can", "refresh-cw", "alert-octagon", "settings"],
      image: "https://placehold.co/120x80",
    },
    {
      id: 3,
      name: "Northside Car Care",
      address: "321 North St, Northside",
      rating: 4.2,
      distance: "3.1 miles",
      availableServices: ["oil-can", "settings", "thermometer"],
      image: "https://placehold.co/120x80",
    },
  ]

  return (
    <main className="min-h-screen bg-[#f8f9f4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-6">Auto Shops Near You</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </main>
  )
}
