import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./pages/Homepage"
import Profile from "./pages/Profile"
import History from "./pages/History"
import LogIn from './pages/LogIn'
import SignUp from './pages/SignUp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
}

export default App
