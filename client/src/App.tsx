import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router"
import Home from "./pages/Homepage"
import Profile from "./pages/Profile"
import Appointments from "./pages/Appointments"
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'
import AuthGate from './components/AuthGate'
import Employees from './pages/Employees'
import Service from './pages/Service'
import SuccessPayment from './pages/SuccessPayment'
import CancelPayment from './pages/CancelPayment'
import { Toaster } from 'react-hot-toast'

function App() {
    return (
        <>
            <Toaster />
            <Router>
                <Routes>
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    <Route element={<AuthGate />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/success-payment" element={<SuccessPayment />} />
                        <Route path="/cancel-payment" element={<CancelPayment />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/appointments" element={<Appointments />} />
                        <Route path='/employees' element={<Employees />} />
                        <Route path='/service' element={<Service />} />
                    </Route>

                </Routes>
            </Router>
        </>
    )
}

export default App