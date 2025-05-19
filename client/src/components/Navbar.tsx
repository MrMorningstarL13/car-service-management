"use client"

import { useState, useEffect } from "react"
import { Search, Home, User, Clock, Menu, X, LogOut } from "lucide-react"
import { useLocation, useNavigate } from "react-router"
import NavButton from "./NavButton"
import useUserStore from "../stores/userStore"

export default function Navbar() {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const location = useLocation()

    const isHomePage = location.pathname === "/"
    const isProfilePage = location.pathname === "/profile"
    const isHistoryPage = location.pathname === "/history"

    const { logOut } = useUserStore()

    const handleLogout = async () => {
        await logOut()
        navigate("/login")
    }

    return (
        <nav className="bg-primary shadow-md relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <span className="text-contrast-primary font-bold text-xl">CarService</span>
                    </div>

                    <div className="hidden md:block flex-1 max-w-md mx-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-tertiary" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search auto shops near you..."
                                className="w-full pl-10 py-2 pr-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 relative">
                        <NavButton icon={Home} label="Home" href="/" isActive={isHomePage} />
                        <NavButton icon={User} label="Profile" href="/profile" isActive={isProfilePage} />
                        <NavButton icon={Clock} label="History" href="/history" isActive={isHistoryPage} />
                        <NavButton icon={LogOut} label="Log out" href="/login" isActive={false} onClick={handleLogout} />
                    </div>

                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-contrast-primary hover:bg-[rgba(189,198,103,0.8)]"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden pb-4">
                        <div className="pt-2 pb-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-tertiary" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search auto shops near you..."
                                    className="w-full pl-10 py-2 pr-3 rounded-md border border-secondary focus:border-tertiary text-contrast-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <NavButton
                                icon={Home}
                                label="Home"
                                href="/"
                                isActive={isHomePage}
                                isMobile={true}
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <NavButton
                                icon={User}
                                label="Profile"
                                href="/profile"
                                isActive={isProfilePage}
                                isMobile={true}
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <NavButton
                                icon={Clock}
                                label="History"
                                href="/history"
                                isActive={isHistoryPage}
                                isMobile={true}
                                onClick={() => setIsMenuOpen(false)}
                            />
                            <NavButton
                                icon={LogOut}
                                label="Log out"
                                href="/login"
                                isActive={false}
                                isMobile={true}
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    handleLogout()
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
