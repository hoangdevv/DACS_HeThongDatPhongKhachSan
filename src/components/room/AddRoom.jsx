import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { addRoom, addRoomImages, getRoomTypes, getAllAmenities } from "../utils/ApiFunctions";
import BounceLoader from "react-spinners/BounceLoader";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRoom = ({ }) => {
    const { hotelId } = useParams();
    const [roomData, setRoomData] = useState({
        name: "",
        pricePerNight: "",
        description: "",
        maxOccupancy: "",
        isAvailable: true,
        totalQuantity: "",
        typeId: "",
        amenities: [],
    });
    const [formErrors, setFormErrors] = useState({
        name: "",
        pricePerNight: "",
        maxOccupancy: "",
        typeId: "",
        totalQuantity: ""
    });
    const [roomTypes, setRoomTypes] = useState([]);
    const [amenities, setAmenities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);

    useEffect(() => {
        fetchRoomTypes();
        fetchAmenities();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case 'name':
                if (!value) {
                    error = "Tên phòng là bắt buộc.";
                }
                break;
            case 'pricePerNight':
                if (!value) {
                    error = "Giá phòng là bắt buộc.";
                } else if (isNaN(Number(value))) {
                    error = "Giá phòng phải là đơn vị tiền tệ.";
                }
                break;
            case 'maxOccupancy':
                if (!value) {
                    error = "Số người tối đa là bắt buộc.";
                } else if (parseInt(value) < 1) {
                    error = "Số người phải lớn hơn 0.";
                }
                break;
            case 'typeId':
                if (!value) {
                    error = "Bạn phải chọn loại phòng.";
                }
                break;
            case 'totalQuantity':
                if (!value) {
                    error = "Số lượng phòng là bắt buộc.";
                } else if (isNaN(Number(value))) {
                    error = "Số lượng phòng là đơn vị.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const fetchRoomTypes = async () => {
        try {
            const types = await getRoomTypes();
            setRoomTypes(types);
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    };

    const fetchAmenities = async () => {
        try {
            const amenitiesData = await getAllAmenities();
            setAmenities(amenitiesData);
        } catch (error) {
            console.error("Error fetching amenities:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setRoomData(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;

        const amenityId = parseInt(name); // Convert the ID to integer
        let updatedAmenities = [...roomData.amenities]; // Make a copy of the amenities array

        if (checked) {
            updatedAmenities.push(amenityId); // Add the amenity ID if checked
        } else {
            updatedAmenities = updatedAmenities.filter(id => id !== amenityId); // Remove the amenity ID if unchecked
        }

        setRoomData({ ...roomData, amenities: updatedAmenities });
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
        const error = validateField('typeId', value);
        setRoomData(prev => ({ ...prev, typeId: value }));
        setFormErrors(prev => ({ ...prev, typeId: error }));
    };

    const handleImageChange = (e) => {
        const files = e.target.files;
        const updatedImages = Array.from(files);

        setImageFiles(prev => [...prev, ...updatedImages]);

        const previews = [];
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                previews.push(reader.result);
                setImagePreviews(previews);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleClearImages = () => {
        setImageFiles([]);
        setImagePreviews([]);
        document.getElementById('file-input').value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let isValid = true;
        Object.keys(roomData).forEach(key => {
            const error = validateField(key, roomData[key]);
            if (error) {
                setFormErrors(prev => ({ ...prev, [key]: error }));
                isValid = false;
            }
        });

        if (!isValid) {
            return;
        }

        try {
            const typeId = roomData.typeId ? { id: roomData.typeId } : null;
            const room = {
                name: roomData.name,
                description: roomData.description,
                isAvailable: roomData.isAvailable,
                maxOccupancy: roomData.maxOccupancy,
                pricePerNight: roomData.pricePerNight,
                totalQuantity: roomData.totalQuantity,
                type: typeId,
                amenities: roomData.amenities.map(amenityId => ({ id: amenityId })),
            };

            const response = await addRoom(hotelId, room);
            console.log("Room added successfully:", response);

            if (imageFiles.length > 0) {
                await addRoomImages(hotelId, response.id, imageFiles);
            }

            Swal.fire('Thành công!', 'Phòng đã được thêm!', 'success');

            setRoomData({
                name: "",
                pricePerNight: "",
                description: "",
                maxOccupancy: "",
                isAvailable: true,
                totalQuantity: "",
                typeId: "",
                amenities: [],
            });

            setImagePreviews([]);
            setImageFiles([]);
            document.getElementById("file-input").value = "";
        } catch (error) {
            console.error("Error adding room:", error);
            Swal.fire('Thất bại!', 'Không thể thêm phòng.', 'error');
        }
    };

    return (
        <>
            {isLoading ? (
                <BounceLoader color="#36d7b7" />
            ) : (
                <section className="container mt-5 mb-5">
                    <div className="row justify-content-center">
                        <h2 className="mt-5 mb-2">Thêm phòng</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Tên phòng:</label>
                                <input type="text" id="name" name="name" value={roomData.name} onChange={handleInputChange} className="form-control" />
                                {formErrors.name && <div className="text-danger">{formErrors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="pricePerNight" className="form-label">Giá phòng 1 đêm:</label>
                                <input type="text" id="pricePerNight" name="pricePerNight" value={roomData.pricePerNight} onChange={handleInputChange} className="form-control" />
                                {formErrors.pricePerNight && <div className="text-danger">{formErrors.pricePerNight}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="description" className="form-label">Mô tả:</label>
                                <textarea type="text" id="description" name="description" value={roomData.description} onChange={handleInputChange} className="form-control" rows="3" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="maxOccupancy" className="form-label">Tổng số người cho phép:</label>
                                <input type="number" id="maxOccupancy" name="maxOccupancy" value={roomData.maxOccupancy} onChange={handleInputChange} className="form-control" />
                                {formErrors.maxOccupancy && <div className="text-danger">{formErrors.maxOccupancy}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="roomType" className="form-label">Thể loại:</label>
                                <select
                                    id="roomType"
                                    className={`form-select ${formErrors.typeId ? 'is-invalid' : ''}`}
                                    onChange={handleSelectChange}
                                    value={roomData.typeId}
                                >
                                    <option value="">Chọn loại phòng</option>
                                    {roomTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {formErrors.typeId && <div className="text-danger">{formErrors.typeId}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="totalQuantity" className="form-label">Tổng số lượng phòng:</label>
                                <input type="number" id="totalQuantity" name="totalQuantity" value={roomData.totalQuantity} onChange={handleInputChange} className="form-control" />
                                {formErrors.totalQuantity && <div className="text-danger">{formErrors.totalQuantity}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Chọn tiện ích:</label>
                                {amenities.map((amenity) => (
                                    <div key={amenity.id} className="form-check">
                                        <input
                                            type="checkbox"
                                            id={amenity.id}
                                            name={amenity.id}
                                            checked={roomData.amenities.includes(amenity.id)}
                                            onChange={handleCheckboxChange}
                                            className="form-check-input"
                                        />
                                        <label htmlFor={amenity.id} className="form-check-label">{amenity.name}</label>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Hình ảnh:</label>
                                <div className="d-flex align-items-center">
                                    <input
                                        id="file-input"
                                        type="file"
                                        className="form-control"
                                        name="photo"
                                        onChange={handleImageChange}
                                        multiple
                                    />
                                    <button type="button" className="btn btn-secondary m-2" onClick={handleClearImages}>
                                        Xóa tất cả hình
                                    </button>
                                </div>
                            </div>
                            <Link to={`/admin/index-room/${hotelId}`} className="btn btn-secondary m-4">
                                Trở về
                            </Link>
                            <button type="submit" className="btn btn-primary mr-2">Add Room</button>
                        </form>
                    </div>
                </section>
            )}
        </>
    )
}
export default AddRoom;
