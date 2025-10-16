import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Index from './Pages/User/Index'
import Furniture from './Pages/User/Furniture'
import Homedeco from './Pages/User/Homedeco'
import About from './Pages/User/About'
import Contact from './Pages/User/Contact'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Index />} />
          <Route path='/furniture' element={<Furniture />} />
          <Route path='/homedeco' element={<Homedeco />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
