import ShopCard from "../components/ShopCard"
import Navbar from "../components/Navbar"
import useServiceStore from "../stores/serviceStore"
import userStore from "../stores/userStore"
import useCarStore from "../stores/carStore"
import { useEffect } from 'react'


export default function Home() {

  const { user } = userStore()
  const { services, fetchShops } = useServiceStore()
  const { fetchCars } = useCarStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userLocation = await getUserLocation()
        fetchShops(userLocation)
      } catch (error) {
        console.warn(error)
        fetchShops(undefined)
      }
      fetchCars()
    }
    
    fetchData()
  }, [fetchShops, fetchCars])

  const serviceCoordinates = services.map( (service) => {
    id: service.id;
    lat: service.lat;
    lng: service.lng;
  })

  const getUserLocation = (): Promise<{ lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if(!navigator.geolocation){
        reject("Geolocation not supported")
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve ({ lat: pos.coords.latitude, lng: pos.coords.longitude}),
          (err) => reject(err.message)
        )
      }
    })
  }

  return (
    <main className="min-h-screen bg-[#f8f9f4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-contrast-primary mb-6">Auto Shops Near You</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      </div>
    </main>
  )
}
