import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // Import từ react-router-dom

const Booking = () => {
  const navigate = useNavigate(); // Sử dụng useNavigate thay cho useHistory
  const { hotel, room, numberOfNights, checkInDate, checkOutDate, totalPrice } = useParams(); // Sử dụng useParams thay cho useLocation

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBooking = async () => {
    const bookingData = {
      userId: null,  // Thay đổi nếu cần thiết
      roomId: room.id,
      customerName,
      customerEmail,
      customerPhone,
      checkInDate: new Date(checkInDate).toISOString(),
      numberOfNights,
      checkOutDate: new Date(checkOutDate).toISOString(),
      quantity: 1,  // Bạn có thể thay đổi số lượng nếu người dùng nhập số lượng khác
      totalPrice,
      bookingStatus: 'PENDING',  // Đặt mặc định là PENDING
      numberOfAdults: 2,  // Bạn có thể thay đổi số lượng người lớn nếu cần
      numberOfChildren: 0,  // Bạn có thể thay đổi số lượng trẻ em nếu cần
      totalGuests: 2,  // Số lượng khách tổng cộng
    };

    setLoading(true);
    try {
      // Thực hiện gọi API để thêm booking
      console.log('Booking data:', bookingData);
      // Sau khi đặt phòng thành công, điều hướng đến trang xác nhận hoặc trang chủ
      navigate('/booking-confirmation');
    } catch (error) {
      console.error('Error adding booking:', error);
      setError('Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-6">
          <div className="booking-form">
            <h2>Thông tin liên hệ và thanh toán</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Chi tiết giá</label>
                <p>Giá/phòng/đêm: {room && room.pricePerNight ? room.pricePerNight.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Thông tin không khả dụng'}</p>

                <p>Số đêm: {numberOfNights}</p>
                <p>Tổng giá: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              </div>
              <button type="button" className="btn btn-primary" onClick={handleBooking} disabled={loading}>
                {loading ? 'Đang đặt phòng...' : 'Thanh toán'}
              </button>
            </form>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="booking-summary">
            <h2>Xem lại thông tin đặt phòng</h2>
            <div className="summary-item">
              <h4>{hotel.name}</h4>
              <p>Phòng: {room.name}</p>
              <p>Loại phòng: {room.type ? room.type.name : ''}</p>
              <p>Số khách: {room.maxOccupancy}</p>
              <p>Ngày nhận phòng: {checkInDate}</p>
              <p>Số đêm: {numberOfNights}</p>
              <p>Ngày trả phòng: {checkOutDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
