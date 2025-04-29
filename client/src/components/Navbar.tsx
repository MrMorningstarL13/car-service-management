"use client"

import { useState } from "react"
import { Search, Home, User, Clock, Menu, X } from "lucide-react"
import { useLocation } from "react-router"
import NavButton from "./NavButton"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  // Determine which page is active
  const isHomePage = location.pathname === "/"
  const isProfilePage = location.pathname === "/profile"
  const isHistoryPage = location.pathname === "/history"

  return (
    <nav className="bg-[rgba(189,198,103,1)] shadow-md relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-[rgba(84,67,67,1)] font-bold text-xl">CarService</span>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[rgba(98,109,88,1)]" />
              </div>
              <input
                type="text"
                placeholder="Search auto shops near you..."
                className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
              />
            </div>
          </div>

          {/* Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-2 relative">
            <NavButton icon={Home} label="Home" href="/" isActive={isHomePage} />
            <NavButton icon={User} label="Profile" href="/profile" isActive={isProfilePage} />
            <NavButton icon={Clock} label="History" href="/history" isActive={isHistoryPage} />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-[rgba(84,67,67,1)] hover:bg-[rgba(189,198,103,0.8)]"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="pt-2 pb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[rgba(98,109,88,1)]" />
                </div>
                <input
                  type="text"
                  placeholder="Search auto shops near you..."
                  className="w-full pl-10 py-2 pr-3 rounded-md border border-[rgba(119,150,109,1)] focus:border-[rgba(98,109,88,1)] text-[rgba(84,67,67,1)] focus:outline-none"
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
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
