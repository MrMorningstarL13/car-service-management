import ShopCard from "../components/ShopCard"
import Navbar from "../components/Navbar"
import useServiceStore from "../stores/serviceStore"
import { useEffect } from 'react'

export default function Home() {

  const { services, fetchShops } = useServiceStore()
  useEffect(() => {
    fetchShops()
    console.warn(services)
  }, [fetchShops])

  return (
    <main className="min-h-screen bg-[#f8f9f4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-6">Auto Shops Near You</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </main>
  )
}
