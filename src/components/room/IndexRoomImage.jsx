import React, { useState, useEffect } from "react";
import { getImageByRoom, deleteRoomImage } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2"
import BounceLoader from "react-spinners/BounceLoader";
import 'bootstrap/dist/css/bootstrap.min.css';

const IndexRoomImage = () => {
    const { hotelId, roomId } = useParams();
    const [Images, setImages] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        fetchImages();
    }, [hotelId, roomId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => {

            clearTimeout(timer);
        };
    }, []);

    const fetchImages = async () => {
        try {
            const images = await getImageByRoom(hotelId, roomId);
            console.log("Fetched images:", images);
            if (Array.isArray(images) && images.length > 0) {
                setImages(images);
            } else {
                setErrorMessage("Dữ liệu hình ảnh không hợp lệ hoặc không có hình ảnh.");
            }
        } catch (error) {
            setErrorMessage(error.message);
            console.error("Error fetching hotel images: ", error);
        }
    };

    const handleImageRemove = async (imageId) => {
        Swal.fire({
            title: 'Bạn chắc chắn xóa?',
            text: "Bạn sẽ không thể hoàn nguyên điều này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteRoomImage(imageId);
                    await fetchImages();
                    Swal.fire(
                        'Xóa thành công!',
                        `Hình ảnh đã được xóa`,
                        'success'
                    );
                } catch (error) {
                    Swal.fire(
                        'Xóa thất bại!',
                        `Error deleting: ${error.message}`,
                        'error'
                    );
                }
            }
        })
    };
    return (
        <>
            {isLoading ? (
                <BounceLoader color="#36d7b7" />
            ) : (
                <>
                    <div className="container mt-5">
                        <h2>Hình ảnh phòng</h2>
                        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        <div className="row">
                            {Images.map(image => (
                                <div key={image.id} className="col-md-3 mb-3">
                                    <div className="image-container">
                                        <img
                                            src={`http://localhost:8088${image.imageUrl}`}
                                            alt={`Room Image ${image.id}`}
                                            className="img-fluid"
                                        />
                                        <div className="btn-image">
                                            <button className="btn btn-danger delete-btn" onClick={() => handleImageRemove(image.id)}>
                                                Xóa
                                            </button>
                                            <button className="btn btn-secondary default-btn">
                                                Đặt làm mặc định
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Link to={`/admin/edit-room/${hotelId}/room/${roomId}`} className="btn btn-secondary">
                            Quay lại chỉnh sửa
                        </Link>
                    </div>
                </>
            )}
        </>
    );
}

export default IndexRoomImage