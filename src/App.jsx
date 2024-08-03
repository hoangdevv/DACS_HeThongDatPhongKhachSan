import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import Admin from './components/admin/Admin'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import { AuthProvider } from "./components/auth/AuthProvider"
import RequireAuth from "./components/auth/RequireAuth"
import HotelDetail from './components/layout/user/HotelDetail/HotelDetail'
import Booking from './components/layout/user/Booking/Booking';
function App() {
  return (
    <>
      <AuthProvider>
        <main>
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/admin/*' name="Admin" element={< Admin />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/hotel-detail/:hotelId' element={<HotelDetail />} /> 
              <Route path="/booking" element={<Booking />} />
            </Routes>
          </Router>
        </main>
      </AuthProvider >
    </>
  )
}

export default App
