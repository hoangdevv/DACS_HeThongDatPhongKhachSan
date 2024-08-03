// HomePage.js
import React, { useEffect, useRef } from 'react';
import './homepage.scss';
import video from './../../../../assets/video/video-sea.mp4';
import { FaSearch } from 'react-icons/fa';
import Aos from 'aos';
import 'aos/dist/aos.css';

const HomePage = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    Aos.init({ duration: 2000 });

    // Đăng ký sự kiện click toàn cục để xử lý khi click ra ngoài
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup để tránh memory leak
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xử lý khi click ra ngoài cardDiv
  const handleClickOutside = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) {
      // Đảm bảo form không bị active
      if (cardRef.current.classList.contains('active')) {
        cardRef.current.classList.remove('active');
      }
    }
  };

  return (
    <section className="home-page">
      <video src={video} muted autoPlay loop type="video/mp4"></video>

      <div className="homeContent container">
        <div className="textDiv">
          <span data-aos="fade-up" className="smallText">
            Khách sạn
          </span>

          <h1 data-aos="fade-up" className="homeTitle">
            Tìm kiếm khách sạn
          </h1>
        </div>

        <div data-aos="fade-up" className="cardDiv formGroup" ref={cardRef}>
          <div className="formGroup destinationInput">
            <label htmlFor="city">Thành phố, địa điểm hoặc tên khách sạn:</label>
            <div className="input flex">
              <input type="text" placeholder="Nhập tên..." />
              <div className="locationIcon"></div>
            </div>
          </div>

          <div className="formGroup dateInputs">
            <div className="dateInput">
              <label htmlFor="checkin">Nhận phòng:</label>
              <div className="input flex">
                <input type="date" id="checkin" />
              </div>
            </div>

            <div className="dateInput">
              <label htmlFor="nights">Số đêm:</label>
              <div className="input flex">
                <input type="number" id="nights" min="1" />
              </div>
            </div>

            <div className="dateInput">
              <label htmlFor="checkout">Trả phòng:</label>
              <div className="input flex">
                <input type="date" id="checkout" />
              </div>
            </div>
          </div>

          <div className="formGroup guestRoomInputs">
            <div className="guestRoomInput">
              <label htmlFor="guests">Khách và phòng:</label>
              <div className="input flex">
                <input type="text" id="guests" placeholder="2 người lớn, 1 phòng" readOnly />
                <div className="dropdownContent">
                  <div className="dropdownContent-item">
                    <label>Người lớn:</label>
                    <input type="number" min="1" defaultValue="2" />
                  </div>
                  <div className="dropdownContent-item">
                    <label>Trẻ em:</label>
                    <input type="number" min="0" defaultValue="0" />
                  </div>
                  <div className="dropdownContent-item">
                    <label>Phòng:</label>
                    <input type="number" min="1" defaultValue="1" />
                  </div>
                </div>
              </div>
            </div>

            <button className="searchButton">
              <FaSearch className="icon" />
              <span>Tìm khách sạn</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
