import { MapPin, Star, AlertOctagon, BatteryCharging, Droplet, RefreshCw, Settings, Thermometer } from "lucide-react"

interface ShopProps {
  shop: {
    id: number
    name: string
    address: string
    rating: number
    distance: string
    availableServices: string[]
    image: string
  }
}

export default function ShopCard({ shop }: ShopProps) {
  // Function to render service icons
  const renderServiceIcon = (iconName: string, index: number) => {
    const iconSize = "h-5 w-5"
    const iconClass = "text-[rgba(98,109,88,1)]"

    switch (iconName) {
      case "oil-can":
        return <Droplet key={index} className={`${iconSize} ${iconClass}`} >
          <title>Oil Change</title>
        </Droplet>
      case "refresh-cw":
        return <RefreshCw key={index} className={`${iconSize} ${iconClass}`} >
          <title>Tire Rotation</title>
        </RefreshCw>
      case "alert-octagon":
        return <AlertOctagon key={index} className={`${iconSize} ${iconClass}`} >
          <title>Brake Service</title>
        </AlertOctagon>
      case "settings":
        return <Settings key={index} className={`${iconSize} ${iconClass}`} >
          <title>Engine Tune-Up</title>
        </Settings>
      case "thermometer":
        return <Thermometer key={index} className={`${iconSize} ${iconClass}`} >
          <title>A/C Service</title>
        </Thermometer>
      case "battery-charging":
        return <BatteryCharging key={index} className={`${iconSize} ${iconClass}`} >
          <title>Battery Replacement</title>
        </BatteryCharging>
      default:
        return null
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[rgba(119,150,109,0.5)] hover:shadow-md transition-shadow duration-300 bg-white">
      <div className="p-4 flex flex-row items-center space-x-4 bg-[rgba(189,198,103,0.2)]">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-[rgba(84,67,67,1)]">{shop.name}</h3>
          <div className="flex items-center mt-1 text-sm text-[rgba(98,109,88,1)]">
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
            <img src={shop.image || "/placeholder.svg"} alt={shop.name} className="object-cover w-full h-full" />
          </div>
          <div className="ml-4">
            <div className="text-[rgba(84,67,67,0.9)] mb-1">Distance: {shop.distance}</div>
            <div className="text-sm text-[rgba(98,109,88,1)]">{shop.availableServices.length} services available</div>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="text-sm font-medium text-[rgba(84,67,67,1)] mb-2">Available Services:</h4>
          <div className="flex flex-wrap gap-3">
            {shop.availableServices.map((service, index) => renderServiceIcon(service, index))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-[rgba(189,198,103,0.1)] flex justify-between">
        <button className="px-4 py-2 border border-[rgba(119,150,109,1)] text-[rgba(98,109,88,1)] rounded-md hover:bg-[rgba(119,150,109,0.2)] hover:text-[rgba(84,67,67,1)]">
          View Details
        </button>
        <button className="px-4 py-2 bg-[rgba(119,150,109,1)] text-white rounded-md hover:bg-[rgba(98,109,88,1)]">
          Book Service
        </button>
      </div>
    </div>
  )
}
