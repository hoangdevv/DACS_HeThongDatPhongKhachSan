import React, { useState, useEffect } from "react";
import { updateRoom, addRoomImages, getRoomById, getRoomTypes, getAllAmenities } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import BounceLoader from "react-spinners/BounceLoader"
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditRoom = () => {
  const { hotelId, roomId } = useParams();
  const [roomData, setRoomData] = useState({
    name: "",
    pricePerNight: "",
    description: "",
    maxOccupancy: "",
    isAvailable: true,
    totalQuantity: "",
    typeId: "",
  });
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchRoomData();
    fetchRoomTypes();
    fetchAmenities();
  }, [hotelId, roomId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const fetchRoomData = async () => {
    try {
      const room = await getRoomById(hotelId, roomId);
      setRoomData({
        ...roomData,
        name: room.name,
        pricePerNight: room.pricePerNight,
        description: room.description,
        maxOccupancy: room.maxOccupancy,
        isAvailable: room.isAvailable,
        totalQuantity: room.totalQuantity,
        typeId: room.type ? room.type.id : "",
        amenities: room.amenities ? room.amenities.map(amenity => amenity.id) : [],
      });
    } catch (error) {
      console.error("Error fetching room:", error);
    }
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
    setRoomData({ ...roomData, [name]: value });
  };

  const handleAvailabilityChange = () => {
    setRoomData({ ...roomData, isAvailable: !roomData.isAvailable });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    const amenityId = parseInt(name);
    let updatedAmenities = [...roomData.amenities];

    if (checked) {
      updatedAmenities.push(amenityId);
    } else {
      updatedAmenities = updatedAmenities.filter(id => id !== amenityId);
    }

    setRoomData({ ...roomData, amenities: updatedAmenities });
  };

  const handleSelectChange = (e) => {
    const typeId = e.target.value;
    setRoomData({ ...roomData, typeId });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    setNewImages(newImagePreviews);
  };

  const handleCancel = () => {
    setNewImages([]);
    document.getElementById("file-input").value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await updateRoom(hotelId, roomId, room);
      console.log("Room updated successfully:", response);

      if (newImages.length > 0) {
        const imageFiles = Array.from(document.getElementById("file-input").files);
        await addRoomImages(hotelId, response.id, imageFiles);
      }
      Swal.fire('Thành công!', 'Phòng đã được cập nhật!', 'success');
      setNewImages([]);
      document.getElementById("file-input").value = "";
    } catch (error) {
      console.error("Error updating room:", error);
      Swal.fire('Thất bại!', 'Không thể cập nhật phòng.', 'error');
    }
  };

  return (
    <>
      {isLoading ? (
        <BounceLoader color="#36d7b7" />
      ) : (
        <>
          <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
              <h2 className="mt-5 mb-2">Chỉnh sửa phòng</h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Tên phòng:</label>
                  <input type="text" id="name" name="name" value={roomData.name} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="pricePerNight" className="form-label">Giá phòng 1 đêm:</label>
                  <input type="text" id="pricePerNight" name="pricePerNight" value={roomData.pricePerNight} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Mô tả:</label>
                  <textarea type="text" id="description" name="description" value={roomData.description} onChange={handleInputChange} className="form-control" rows="3" />
                </div>
                <div className="mb-3">
                  <label htmlFor="maxOccupancy" className="form-label">Tổng số người cho phép:</label>
                  <input type="number" id="maxOccupancy" name="maxOccupancy" value={roomData.maxOccupancy} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="roomType" className="form-label">Thể loại:</label>
                  <select
                    id="roomType"
                    className="form-select"
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
                </div>
                <div className="mb-3">
                  <label htmlFor="totalQuantity" className="form-label">Tổng số lượng phòng:</label>
                  <input type="number" id="totalQuantity" name="totalQuantity" value={roomData.totalQuantity} onChange={handleInputChange} className="form-control" />
                </div>
                <Form.Group className="mb-3 availability-switch">
                  <Form.Check
                    type="switch"
                    id="availability-switch"
                    label={roomData.isAvailable ? "Chưa có người" : "Đã có người"}
                    checked={roomData.isAvailable}
                    onChange={handleAvailabilityChange}
                  />
                </Form.Group>
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
                          alt={`room-${index}`}
                          style={{ maxWidth: "100px", maxHeight: "100px", marginRight: "10px" }}
                        />
                      ))}
                      <button onClick={handleCancel} className="btn btn-danger m-4">
                        Hủy bỏ
                      </button>
                    </div>
                  )}
                </div>
                <Link to={`/admin/index-room/${hotelId}`} className="btn btn-secondary m-4">
                  Trở về
                </Link>
                <Link to={`/admin/index-room-images/${hotelId}/room/${roomId}`} className="btn btn-primary m-4">
                  Quản lý hình ảnh
                </Link>
                <button type="submit" className="btn btn-primary mr-2">Cập nhật</button>
              </form>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EditRoom