import Navbar from "../components/Navbar"

export default function History() {
  return (
    <main className="min-h-screen bg-[#f8f9f4]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-contrast-primary mb-6">Service History</h1>
        <p className="text-[rgba(84,67,67,0.9)]">This is the service history page.</p>
      </div>
    </main>
  )
}
