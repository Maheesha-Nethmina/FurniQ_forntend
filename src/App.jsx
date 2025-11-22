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
import FurnitureDetail from './Pages/User/FurnitureDetail'

import AdminDashboard from './Pages/Admin/AdminDashBoard'
import Oder_Furniture from './Pages/Admin/Oder_Furniture'
import Oder_Homedeco from './Pages/Admin/Oder_Homedeco'
import AddItem from './Pages/Admin/AddItem'
import AddDeco from './Pages/Admin/AddDeco'

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
            <Route path='/furnitureDetail/:id' element={<FurnitureDetail/>}/>
            
            <Route path='/admin' element={<AdminDashboard />} />
            <Route path='/order-furniture' element={<Oder_Furniture />} />
            <Route path='/order-homedeco' element={<Oder_Homedeco />} />
            <Route path='/add-item' element={<AddItem />} />
            <Route path='/add-deco' element={<AddDeco />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App