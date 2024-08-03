import React, { useState, useContext } from 'react';
import './navbar.css';
import { FaHotel, FaUserCircle } from "react-icons/fa";
import { AiFillCloseCircle } from "react-icons/ai";
import { TbGridDots } from "react-icons/tb";
import { AuthContext } from '../../../auth/AuthProvider';
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const [active, setActive] = useState('navBar');

  const showNav = () => {
    setActive('navBar activeNavbar');
  };

  const removeNav = () => {
    setActive('navBar');
  };

  return (
    <section className='navBarSection'>
      <header className='header flex'>
        <div className="logoDiv">
          <a href="/" className="logo flex">
            <h1><FaHotel className="icon" /> Hubert Hotel</h1>
          </a>
        </div>

        <div className={active}>
          <ul className="navLists flex">
            <li className="navItem">
              <a href="/" className="navLink">Trang chủ</a>
            </li>
            <li className="navItem">
              <a href="/hotels" className="navLink">Khách sạn</a>
            </li>
            <li className="navItem">
              <a href="/promotions" className="navLink">Khuyến mãi</a>
            </li>
            <li className="navItem">
              <a href="/about" className="navLink">Giới thiệu</a>
            </li>
            <li className="navItem">
              <a href="/news" className="navLink">Tin tức</a>
            </li>
            <li className="navItem">
              <a href="/contact" className="navLink">Liên hệ</a>
            </li>

            {user && user.roles.includes("ROLE_ADMIN") && (
              <li className="navItem">
                <a href="/admin" className="navLink">Admin</a>
              </li>
            )}

            {user ? (
              <div className="userSection flex">
                <FaUserCircle className="userIcon" />
                <span>{user.sub}</span> {/* Display user's email */}
                <button className="btn" onClick={handleLogout}>Đăng xuất</button>
              </div>
            ) : (
              <>
                <li className="navItem">
                  <button className="btn">
                    <Link to="/register">Đăng ký</Link>
                  </button>
                </li>
                <li className="navItem">
                  <button className="btn">
                    <Link to="/login">Đăng nhập</Link>
                  </button>
                </li>
              </>
            )}
          </ul>

          <div onClick={removeNav} className="closeNavBar">
            <AiFillCloseCircle className='icon' />
          </div>
        </div>

        <div onClick={showNav} className="toggleNavBar">
          <TbGridDots className='icon' />
        </div>
      </header>
    </section>
  );
}

export default Navbar;
