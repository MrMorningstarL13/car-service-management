import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import Home from "./pages/Homepage"
import Profile from "./pages/Profile"
import History from "./pages/History"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  )
}

export default App
