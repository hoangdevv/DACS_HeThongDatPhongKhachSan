import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getHotelById, updateHotel, addHotelImages,updateHotelThumbnail  } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from 'sweetalert2';
import 'select2/dist/css/select2.min.css';
import $ from 'jquery';
import 'select2';

const EditHotel = () => {
    const { hotelId } = useParams();
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
    const [cities] = useState([
        'Hồ Chí Minh', 'Nha Trang', 'Vũng Tàu', 'Hà Nội', 'Đà Nẵng', 'Phan Thiết', 'Phú Quốc', 'Đà Lạt', 'Quy Nhơn'
    ]);
    const [showCheckInError, setShowCheckInError] = useState(false);
    const [newImages, setNewImages] = useState([]);
    const [thumbnailImage, setThumbnailImage] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotel = await getHotelById(hotelId);
                if (!formData.name) {
                    const checkInDate = new Date(hotel.checkInTime);
                    const isoDate = checkInDate.toISOString().split('T')[0];
                    setFormData({
                        name: hotel.name,
                        address: hotel.address,
                        city: hotel.city,
                        country: hotel.country,
                        description: hotel.description,
                        checkInTime: isoDate,
                        latitude: hotel.latitude,
                        longitude: hotel.longitude,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin khách sạn: ", error);
            }
        };
        fetchHotel();
    }, [hotelId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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
                checkInTime: e.target.value,
            });
        }
    };

    const handleCityChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            city: value,
        });
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        setNewImages(newImagePreviews);
    };

    const handleCancel = () => {
        setNewImages([]);
        setThumbnailImage(null);
        setThumbnailPreview("");
        document.getElementById("file-input").value = "";
        document.getElementById("thumbnail-input").value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            const response = await updateHotel(hotelId, formData);
            console.log("Khách sạn được update thành công:", response);
            if (thumbnailImage) {
                await updateHotelThumbnail(hotelId, thumbnailImage);
            }
            if (newImages.length > 0) {
                const imageFiles = Array.from(document.getElementById("file-input").files);
                await addHotelImages(response.id, imageFiles);
            }
            Swal.fire('Thành công!', 'Khách sạn đã được cập nhật!', 'success');
            setNewImages([]);
            setThumbnailImage(null);
            setThumbnailPreview("");
            document.getElementById("file-input").value = "";
            document.getElementById("thumbnail-input").value = "";
        } catch (error) {
            console.error("Lỗi khi cập nhật khách sạn: ", error);
            Swal.fire('Thất bại!', 'Không thể cập nhật khách sạn.', 'error');
        }
    };

    return (
        <>
            {isLoading ? (
                <BounceLoader color="#36d7b7" />
            ) : (
                <section className="container">
                    <div className="row justify-content-center">
                        <h2 className="mb-5">Chỉnh sửa Khách Sạn</h2>
                        <form onSubmit={handleSubmit} className="row">
                            <div className="col-md-12">
                                <div className="mb-3">
                                    <label className="form-label">Tên khách sạn:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Địa chỉ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Thành phố:</label>
                                    <select className="form-control select2" name="city" onChange={handleCityChange} value={formData.city}>
                                        <option value=""></option>
                                        {cities.map((city, index) => (
                                            <option key={index} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
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
                                        <p className="text-danger">Ngày nhận khách tính từ ngày sau</p>
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
                                        <div className="mt-2">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail Preview"
                                                style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Danh sách hình ảnh:</label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        className="form-control"
                                        name="photo"
                                        onChange={handleImageChange}
                                        multiple
                                    />
                                    {newImages.length > 0 && (
                                        <div className="mt-2">
                                            {newImages.map((image, index) => (
                                                <img
                                                    key={index}
                                                    src={image}
                                                    alt={`hotel-${index}`}
                                                    style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                                                />
                                            ))}
                                            <button onClick={handleCancel} className="btn btn-danger m-4">
                                                Hủy bỏ
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <Link to="/admin/index-hotels" className="btn btn-secondary m-4">
                                    Trở về
                                </Link>
                                <Link to={`/admin/index-hotel-images/${hotelId}`} className="btn btn-primary m-4">
                                    Quản lý hình ảnh
                                </Link>
                                <button type="submit" className="btn btn-primary m-4">
                                    Cập nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
        </>
    );
};

export default EditHotel;
