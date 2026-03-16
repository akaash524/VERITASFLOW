import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <Sidebar />
      <main className="ml-60 mt-16 p-6 min-h-[calc(100vh-64px)]">
        {children}
      </main>
    </div>
  )
}