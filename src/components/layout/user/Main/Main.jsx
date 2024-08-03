import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHotels } from './../../../utils/ApiFunctions';
import { HiOutlineLocationMarker, HiOutlineClipboardCheck } from 'react-icons/hi';
// // import { SiZalo } from "react-icons/si";
import { FaStar, FaFacebook } from 'react-icons/fa';
import Aos from 'aos';
import 'aos/dist/aos.css';
import './main.css';
import { FacebookIcon, ZaloIcon, CartIcon } from './Icon';
const Main = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    Aos.init({ duration: 2000 });

    const fetchHotels = async () => {
      try {
        const data = await getAllHotels();
        setHotels(data);
        setFilteredHotels(data);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Lỗi khi lấy danh sách khách sạn');
      }
    };

    fetchHotels();

    const handleHotelAdded = () => {
      fetchHotels();
    };

    window.addEventListener('hotelAdded', handleHotelAdded);

    return () => {
      window.removeEventListener('hotelAdded', handleHotelAdded);
    };
  }, []);

  const handleCityClick = (city) => {
    setSelectedCity(city);
    if (city === 'Tất cả') {
      setFilteredHotels(hotels);
    } else {
      const filtered = hotels.filter((hotel) => hotel.city === city);
      setFilteredHotels(filtered);
    }
  };

  const navigateToHotelDetail = (hotelId) => {
    navigate(`/hotel-detail/${hotelId}`); // Navigate to correct URL format
  };

  const cities = [
    'Tất cả',
    'Hồ Chí Minh',
    'Nha Trang',
    'Vũng Tàu',
    'Hà Nội',
    'Đà Nẵng',
    'Phan Thiết',
    'Phú Quốc',
    'Đà Lạt',
    'Quy Nhơn',
  ];

  return (
    <section className='main container section'>
      <div className='secTitle'>
        <h3 className='title' data-aos='fade-up'>
          Top điểm đến
        </h3>
      </div>

      <div className='cityButtons' data-aos='fade-up'>
        {cities.map((city) => (
          <button
            key={city}
            className={`cityButton ${selectedCity === city ? 'active' : ''}`}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>

      <div className='secContent grid'>
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
        {filteredHotels.map(({ id, thumnail, name, city, rating, fees }) => (
          <div key={id} data-aos='fade-up' className='singleDestination'>
            <div className='imageDiv'>
              <img src={`http://localhost:8088${thumnail}`} alt={name} className='img-fluid' />
            </div>

            <div className='cardInfo'>
              <h4 className='destTitle'>{name}</h4>
              <span className='continent flex'>
                <HiOutlineLocationMarker className='icon' />
                <span className='name'>{city}</span>
              </span>

              <div className='fees flex'>
                <div className='grade'>
                  <FaStar className='star' />
                  <span>{rating}</span>
                </div>
                <div className='price'>
                  <h5>{fees}</h5>
                </div>
              </div>

              <button className='btn flex' onClick={() => navigateToHotelDetail(id)}>
                Chi tiết <HiOutlineClipboardCheck className='icon' />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="socialIcons">
        <CartIcon onClick={() => console.log('Thêm vào giỏ hàng')} />
        <FacebookIcon url="https://www.facebook.com/nvhhoang.hubert/" />
        <ZaloIcon url="https://zalo.me/0703268656" />
        {/* Ví dụ sử dụng CartIcon */}
      </div>
    </section>
  );
};

export default Main;
