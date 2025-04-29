import Navbar from "../components/Navbar"

export default function History() {
  return (
    <main className="min-h-screen bg-[#f8f9f4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[rgba(84,67,67,1)] mb-6">Profile</h1>
        <p className="text-[rgba(84,67,67,0.9)]">This is the profile page.</p>
      </div>
    </main>
  )
}
