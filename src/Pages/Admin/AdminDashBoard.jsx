import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import AdminNavbar from '../../Components/Navbar/Adminnavbar'

function AdminDashBoard() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="flex pt-16">
                <AdminNavbar />
        <main className="flex-1 p-10">
          <h1 className="text-3xl font-bold text-gray-800">
            This is Admin Dashboard
          </h1>
          {/* main content here */}
        </main>
      </div>
    </div>
  )
}

export default AdminDashBoard