import Navbar from "../components/Navbar"
import ServiceCard from "../components/ServiceCard"

const Homepage = () => {

    return(
        <>
            <Navbar/>
            <ServiceCard /> 
            <ServiceCard /> 
            <ServiceCard /> 
            <ServiceCard /> 
            <div className='text-4xl'>da ma da!</div>
        </>
    )
}

export default Homepage;