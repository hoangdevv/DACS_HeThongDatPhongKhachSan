import React, { useState, useEffect } from "react";
import { addHotel, addHotelImages, updateHotelThumbnail } from "../utils/ApiFunctions";
import { Link, useNavigate } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import 'select2';

const AddHotel = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    country: "VietNam",
    description: "",
    checkInTime: "",
    latitude: 0,
    longitude: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [hotelImages, setHotelImages] = useState([]);
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [cities] = useState([
    'Hồ Chí Minh', 'Nha Trang', 'Vũng Tàu', 'Hà Nội', 'Đà Nẵng', 'Phan Thiết', 'Phú Quốc', 'Đà Lạt', 'Quy Nhơn'
  ]);
  const [showCheckInError, setShowCheckInError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    $(document).ready(function () {
      $('.select2').select2();
    });
  }, []);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value) return 'Tên khách sạn là bắt buộc.';
        break;
      case 'address':
        if (!value) return 'Địa chỉ là bắt buộc.';
        break;
      case 'city':
        if (!value) return 'Thành phố là bắt buộc.';
        break;
      default:
        return '';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleCheckInChange = (e) => {
    const checkInDate = new Date(e.target.value);
    const currentDate = new Date();

    if (checkInDate < currentDate) {
      setShowCheckInError(true);
    } else {
      setShowCheckInError(false);
      setFormData({
        ...formData,
        checkInTime: checkInDate.toISOString().split('T')[0],
      });
    }
  };

  const handleCityChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      city: value,
    });
    setFormErrors(prev => ({ ...prev, city: "" }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const updatedImages = Array.from(files);

    setHotelImages(updatedImages);

    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview("");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    setThumbnailImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setThumbnailPreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        setFormErrors(prev => ({ ...prev, [key]: error }));
        isValid = false;
      }
    });

    if (!isValid) return;

    try {
      const response = await addHotel(formData);
      console.log("Hotel added successfully:", response);

      if (thumbnailImage) {
        await updateHotelThumbnail(response.id, thumbnailImage);
      }

      if (hotelImages.length > 0) {
        await addHotelImages(response.id, hotelImages);
      }

      Swal.fire('Thành công!', 'Khách sạn đã được thêm!', 'success');

      setFormData({
        name: "",
        address: "",
        city: "",
        country: "VietNam",
        description: "",
        checkInTime: "",
        latitude: 0,
        longitude: 0,
      });
      setFormErrors({});
      setImagePreview("");
      setHotelImages([]);
      setThumbnailPreview("");
      setThumbnailImage(null);
      document.getElementById("file-input").value = "";
      document.getElementById("thumbnail-input").value = "";

      navigate("/admin/index-hotels");
    } catch (error) {
      console.error("Lỗi khi thêm khách sạn: ", error);
      Swal.fire('Thất bại!', 'Không thể thêm khách sạn.', 'error');
    }
  };

  return (
    <>
      {isLoading ? (
        <BounceLoader color="#36d7b7" />
      ) : (
        <section className="container">
          <div className="row justify-content-center">
            <h2 className="mt-5 mb-2">Thêm Khách Sạn</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên khách sạn <span className="text-danger">*</span>:</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Địa chỉ <span className="text-danger">*</span>:</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                {formErrors.address && <div className="text-danger">{formErrors.address}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Thành phố <span className="text-danger">*</span>:</label>
                <select className="form-control select2" name="city" onChange={handleCityChange} value={formData.city}>
                  <option value=""></option>
                  {cities.map((city, index) => (
                    <option key={index} value={city}>{city}</option>
                  ))}
                </select>
                {formErrors.city && <div className="text-danger">{formErrors.city}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả:</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày nhận khách:</label>
                <input
                  type="date"
                  className="form-control"
                  name="checkInTime"
                  value={formData.checkInTime}
                  onChange={handleCheckInChange}
                />
                {showCheckInError && (
                  <p className="text-danger">Ngày nhận khách không thể là ngày trong quá khứ</p>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Vĩ độ:</label>
                <input
                  type="number"
                  className="form-control"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Kinh độ:</label>
                <input
                  type="number"
                  className="form-control"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Hình đại diện:</label>
                <input
                  id="thumbnail-input"
                  type="file"
                  className="form-control"
                  name="thumbnail"
                  onChange={handleThumbnailChange}
                />
                {thumbnailPreview && (
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mt-2"
                  />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Danh sách hình:</label>
                <input
                  id="file-input"
                  type="file"
                  className="form-control"
                  name="hotelImages"
                  multiple
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview Hotel Photo"
                    style={{ maxWidth: "400px", maxHeight: "400px" }}
                    className="mt-2"
                  />
                )}
              </div>

              <button type="submit" className="btn btn-primary">Thêm khách sạn</button>
            </form>
            <div className="mt-3">
              <Link to="/admin/index-hotels" className="btn btn-secondary">Quay lại danh sách</Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AddHotel;
