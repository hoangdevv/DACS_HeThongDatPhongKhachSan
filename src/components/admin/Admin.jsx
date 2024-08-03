import React from 'react'
import { Content, Sidebar, Footer, Header } from '../layout/admin/index'
import './../../assets/scss/admin/admin.scss'
const Admin = () => {
    return (
        <div >
          <Sidebar />
          <div className="wrapper d-flex flex-column min-vh-100 admin">
            <Header />
            <div className="body flex-grow-1 ">
                <Content />
            </div>
            <Footer />
          </div>
        </div>
      )
}

export default Admin

