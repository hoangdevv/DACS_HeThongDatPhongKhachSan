import React, { useState, useEffect } from "react";
import { getImageByHotel, deleteHotelImage } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2"
import BounceLoader from "react-spinners/BounceLoader";
import 'bootstrap/dist/css/bootstrap.min.css';

const IndexHotelImage = () => {
  const { hotelId } = useParams();
  const [Images, setImages] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    fetchImages();
  }, [hotelId]);

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
      const images = await getImageByHotel(hotelId);
      console.log("Fetched images:", images); // Log dữ liệu để kiểm tra
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
          await deleteHotelImage(imageId);
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
            <h2>Hình ảnh khách sạn</h2>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            <div className="row">
              {Images.map(image => (
                <div key={image.id} className="col-md-3 mb-3">
                  <div className="image-container">
                    <img
                      src={`http://localhost:8088${image.imageUrl}`}
                      alt={`Hotel Image ${image.id}`}
                      className="img-fluid"
                    />
                    <div className="btn-image">
                      <button className="btn btn-danger delete-btn" onClick={() => handleImageRemove(image.id)}>
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`/admin/index-hotels/edit-hotel/${hotelId}`} className="btn btn-secondary">
              Quay lại chỉnh sửa
            </Link>
          </div>
        </>
      )}
    </>
  );

}

export default IndexHotelImage