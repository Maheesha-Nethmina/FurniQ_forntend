import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import Index from './Pages/User/Index'
import Furniture from './Pages/User/Furniture'
import Homedeco from './Pages/User/Homedeco'
import About from './Pages/User/About'
import Contact from './Pages/User/Contact'
import Profile from './Pages/User/Profile'
import Cart from './Pages/User/Cart'

import AdminDashboard from './Pages/Admin/AdminDashboard'

function App() {
  return (
    <>
      
      <AuthProvider>
        <BrowserRouter>
          <Routes>
          
            <Route path='/' element={<Index />} />
            <Route path='/furniture' element={<Furniture />} />
            <Route path='/homedeco' element={<Homedeco />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/cart' element={<Cart />} />
            
            <Route path='/admin' element={<AdminDashboard />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App