import React from 'react'
import Navbar from '../layout/user/Navbar/Navbar'
import HomePage from '../layout/user/HomePage/HomePage'
import Main from '../layout/user/Main/Main'
import Footer from '../layout/user/Footer/Footer'
// import  './../../assets/css/home/home.css'

const Home = () => {
  return (
    <div>
      <Navbar/>
      <HomePage/>
      <Main/>
      <Footer/>
    </div>
  )
}

export default Home