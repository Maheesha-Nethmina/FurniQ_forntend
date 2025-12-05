import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Import AuthProvider and useAuth from your context
import { AuthProvider, useAuth } from './context/AuthContext' 

// User Pages
import Index from './Pages/User/Index'
import Furniture from './Pages/User/Furniture'
import Homedeco from './Pages/User/Homedeco'
import About from './Pages/User/About'
import Contact from './Pages/User/Contact'
import Profile from './Pages/User/Profile'
import Cart from './Pages/User/Cart'
import FurnitureDetail from './Pages/User/FurnitureDetail'
import Homedecodetails from './Pages/User/HomedecoDetail'
import PaymentPage from './Pages/User/PaymentPage'
import CartCheckout from './Pages/User/CartCheckout'

// Admin Pages
import AdminDashboard from './Pages/Admin/AdminDashBoard'
import Furniture_Inventory from './Pages/Admin/Furniture Inventory'
import HomeDeco_Inventory from './Pages/Admin/HomeDeco Inventory'
import AddItem from './Pages/Admin/AddItem'
import AddDeco from './Pages/Admin/AddDeco'
import UserDetails from './Pages/Admin/UserDetails'
import OderDetails from './Pages/Admin/OderDetails'
import ShippedOrders from './Pages/Admin/ShippedOrders';

// ------------------------------------------------------------------
// --- INLINE ADMIN PROTECTED ROUTE COMPONENT ---
const AdminRoute = ({ element: Component, ...rest }) => {
    const { isAdmin } = useAuth(); 

    if (isAdmin) {
        return <Component {...rest} />; 
    }

    return <Navigate to="/" replace />;
};
// ------------------------------------------------------------------

function App() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        {/* user routes */}
                        <Route path='/' element={<Index />} />
                        <Route path='/furniture' element={<Furniture />} />
                        <Route path='/homedeco' element={<Homedeco />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/furnitureDetail/:id' element={<FurnitureDetail />} />
                        <Route path='/homedecoDetail/:id' element={<Homedecodetails />} />
                        <Route path='/payment/:id' element={<PaymentPage />} />
                        <Route path="/cart-checkout" element={<CartCheckout />} />


                        {/* Admin routes - PROTECTED using AdminRoute */}
                        <Route path='/admin' element={<AdminRoute element={AdminDashboard} />} />
                        <Route path='/order-furniture' element={<AdminRoute element={Furniture_Inventory} />} />
                        <Route path='/order-homedeco' element={<AdminRoute element={HomeDeco_Inventory} />} />
                        <Route path='/add-item' element={<AdminRoute element={AddItem} />} />
                        <Route path='/add-deco' element={<AdminRoute element={AddDeco} />} />
                        <Route path='/userdetails' element={<AdminRoute element={UserDetails} />} />
                        <Route path='/oder_details' element={<AdminRoute element={OderDetails} />} />
                        <Route path="/shipped-orders" element={<AdminRoute element={ShippedOrders} />} />

                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </>
    )
}

export default App