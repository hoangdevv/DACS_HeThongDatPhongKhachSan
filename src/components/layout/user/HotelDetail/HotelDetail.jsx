import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Thay đổi import từ useHistory thành useNavigate
import Slider from 'react-slick';
import { getHotelById, getAllRooms, getImageByHotel, getAmenitiesByRoom, addBooking } from './../../../utils/ApiFunctions';
import Navbar from './../Navbar/Navbar';
import Booking from './../Booking/Booking'; // Import Booking component
import { FacebookIcon, ZaloIcon, CartIcon } from './../Main/Icon';
import './hoteldetail.scss'; // Import SCSS file for custom styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HotelDetail = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate(); // Thay đổi từ useHistory sang useNavigate
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [hotelImages, setHotelImages] = useState([]);
  const [roomAmenities, setRoomAmenities] = useState({});

  useEffect(() => {
    if (hotelId) {
      fetchHotelAndRooms();
      fetchHotelImages();
    }
  }, [hotelId]);

  const fetchHotelAndRooms = async () => {
    try {
      const hotelData = await getHotelById(hotelId);
      const roomsData = await getAllRooms(hotelId);

      // Set hotel data
      setHotel(hotelData);
      setRooms(roomsData);

      // Calculate minPrice after rooms are set
      const minPrice = Math.min(...roomsData.map(room => room.pricePerNight));
      setHotel((prevHotel) => ({
        ...prevHotel,
        minPrice
      }));

      // Fetch room amenities for each room
      roomsData.forEach(async (room) => {
        const roomAmenities = await fetchRoomAmenities(room.id);
        setRoomAmenities((prevRoomAmenities) => ({
          ...prevRoomAmenities,
          [room.id]: roomAmenities
        }));
      });
    } catch (error) {
      console.error('Error fetching hotel and rooms:', error);
    }
  };

  const fetchRoomAmenities = async (roomId) => {
    try {
      const amenitiesData = await getAmenitiesByRoom(roomId);
      return amenitiesData;
    } catch (error) {
      console.error(`Error fetching amenities for room ${roomId}:`, error);
      return [];
    }
  };

  const fetchHotelImages = async () => {
    try {
      const imagesData = await getImageByHotel(hotelId);
      setHotelImages(imagesData);
    } catch (error) {
      console.error('Error fetching hotel images:', error);
    }
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  };

  const handleBooking = async (room, numberOfNights) => {
    // Redirect to booking page with necessary data
    navigate('/booking', {
      state: {
        hotel,
        room,
        numberOfNights,
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date().toISOString(),
        totalPrice: room.pricePerNight * numberOfNights
      }
    });
  };

  return (
    <div className="hotel-detail">
      <Navbar />

      {hotel && (
        <div className="container py-4">
          <div className="row">
            <div className="col-lg-12">
              <div className="hotel-info">
                <div className="hotel-info-left">
                  <h2 className="hotel-name">{hotel.name}</h2>
                  <p className="hotel-address">{hotel.address}</p>
                  <p className="hotel-description">{hotel.description}</p>
                </div>
                <div className="hotel-info-right">
                  <p className="hotel-price">Giá/phòng/đêm từ: {hotel.minPrice.toLocaleString('vi-VN')} VNĐ</p>
                  <a href='#room-list' className="btn btn-primary">Chọn phòng</a>
                </div>
              </div>

              <div className="hotel-images mb-4">
                <Slider {...sliderSettings}>
                  {hotel.thumnail && (
                    <div>
                      <img src={`http://localhost:8088${hotel.thumnail}`} alt={`Hotel ${hotel.name} thumbnail`} className="img-fluid rounded" />
                    </div>
                  )}
                  {hotelImages.map((image, index) => (
                    <div key={index}>
                      <img src={`http://localhost:8088${image.imageUrl}`} alt={`Hotel ${hotel.name} gallery ${index}`} className="img-fluid rounded" />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="room-list" id='room-list'>
                <div className="list-group">
                  {rooms.map((room) => (
                    <div key={room.id} className="list-group-item">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h4>{room.name}</h4>
                          {roomAmenities[room.id] && (
                            <div className="room-amenities mb-4">
                              <h5 className="room-amenities-title">Tiện ích của phòng</h5>
                              <ul className="list-unstyled">
                                {roomAmenities[room.id].map((amenity, index) => (
                                  <li key={index}>{amenity}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <div className="col-md-6">
                          <div className="row">
                            <div className="col-md-6 room-detail-item">
                              <p><strong>Loại phòng:</strong></p>
                              <p>{room.type ? room.type.name : ''}</p>
                            </div>
                            <div className="col-md-6 room-detail-item">
                              <p><strong>Số khách:</strong></p>
                              <p>{room.maxOccupancy}</p>
                            </div>
                            <div className="col-md-6 room-detail-item">
                              <p><strong>Giá/phòng/đêm:</strong></p>
                              <p>{room.pricePerNight.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} / đêm</p>
                            </div>
                            <div className="col-md-6 room-detail-item">
                              <p><strong>Số phòng:</strong></p>
                              <input type="number" className="form-control" min="1" defaultValue="1" />
                            </div>
                          </div>
                          <div className="row mt-3">
                            <div className="col-md-12">
                              <button className="btn btn-primary mb-2">Thêm vào giỏ hàng</button>
                              <button className="btn btn-success" onClick={() => handleBooking(room, 1)}>Đặt phòng</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      <div className="socialIcons">
        <CartIcon onClick={() => console.log('Thêm vào giỏ hàng')} />
        <FacebookIcon url="https://www.facebook.com/nvhhoang.hubert/" />
        <ZaloIcon url="https://zalo.me/0703268656" />
        {/* Ví dụ sử dụng CartIcon */}
      </div>
    </div>
  );
};

export default HotelDetail;
