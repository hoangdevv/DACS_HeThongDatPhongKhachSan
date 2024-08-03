import React, { useState, useEffect } from "react";
import { deleteHotel, getAllHotels } from "../utils/ApiFunctions";
import { Col, Row } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit, FaEye, FaTrashAlt, FaPlus, FaDoorOpen, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import HotelFilter from "../common/HotelFilter";
import HotelPaginator from "../common/HotelPaginator";
import BeatLoader from "react-spinners/BeatLoader"
import Swal from "sweetalert2"

const IndexHotel = () => {
  const [hotels, setHotels] = useState([{ id: "", name: "", address: "", city: "", thumnail: "" }]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredHotels, setFilteredHotels] = useState([{ id: "", name: "", address: "", city: "" }]);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    fetchHotels();
  }, []);

  useEffect(() => {
    if (searchKeyword.trim() === "") {
      setFilteredHotels(hotels);
    } else {
      const filteredHotels = hotels.filter(hotel =>
        hotel.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredHotels(filteredHotels);
    }
    setCurrentPage(1);
  }, [hotels, searchKeyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedCity === "") {
      setFilteredHotels(hotels);
    } else {
      const filteredHotels = hotels.filter(
        (hotel) => hotel.city === selectedCity
      );
      setFilteredHotels(filteredHotels);
    }
    setCurrentPage(1);
  }, [hotels, selectedCity]);

  const fetchHotels = async () => {
    try {
      const result = await getAllHotels();
      setHotels(result);
      setIsLoading(true)
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleSearchInputChange = event => {
    setSearchKeyword(event.target.value);
  };
  const handleSearchSubmit = event => {
    event.preventDefault();

  };
  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (hotelId) => {
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
        setIsLoading(true);
        try {
          await deleteHotel(hotelId);
          await fetchHotels();
          Swal.fire(
            'Xóa thành công!',
            `Khách sạn có mã: ${hotelId} đã được xóa.`,
            'success'
          );
        } catch (error) {
          Swal.fire(
            'Xóa thất bại!',
            `Error deleting: ${error.message}`,
            'error'
          );
        } finally {
          setIsLoading(false);
        }
      }
    });
  };


  const calculateTotalPages = (filteredHotels, hotelsPerPage, hotels) => {
    const totalHotels =
      filteredHotels.length > 0 ? filteredHotels.length : hotels.length;
    return Math.ceil(totalHotels / hotelsPerPage);
  };

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = filteredHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  return (
    <>
      {isLoading ? (
        <BeatLoader color="#36d7b7" />
      ) : (
        <>
          <section className="mt-5 mb-5 ">
            <h2>Danh sách khách sạn</h2>
            <Row>
              <Col md={6} className="mb-2 md-mb-0 d-flex">
                <div className="flex-grow-1 me-2">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaSearch />
                      </span>
                      <input
                        type="text"
                        className="form-control "
                        placeholder="Tìm kiếm theo tên khách sạn..."
                        value={searchKeyword}
                        onChange={handleSearchInputChange}
                      />
                    </div>
                  </form>
                </div>
                <HotelFilter
                  data={hotels}
                  setFilteredData={setFilteredHotels}
                />
              </Col>

              <Col md={6} className="d-flex justify-content-end align-items-center">
                <Link to={"/admin/add-hotel"}>
                  <FaPlus /> Thêm khách sạn
                </Link>
              </Col>
            </Row>
            <table className="table table-bordered table-hover">
              <thead>
                <tr className="text-center">
                  <th>ID</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Address</th>
                  <th>Thumnail</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentHotels.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="text-center"
                    onMouseEnter={() => setHoveredHotelId(hotel.id)}
                    onMouseLeave={() => setHoveredHotelId(null)}
                  >
                    <td>{hotel.id}</td>
                    <td>{hotel.name}</td>
                    <td>{hotel.city}</td>
                    <td>{hotel.address}</td>
                    <td>
                      {hotel.thumnail && (
                        <img src={`http://localhost:8088${hotel.thumnail}`} alt="Thumbnail" style={{ width: '100px', height: 'auto' }} />
                      )}
                    </td>
                    <td className="gap-2">
                      <Link to={`/admin/index-hotels/edit-hotel/${hotel.id}`} className="gap-2">
                        <span className="btn btn-warning btn-sm m-2" title="Xem/Sửa">
                          <FaEdit />
                        </span>
                      </Link>
                      <button
                        className="btn btn-danger btn-sm ml-5"
                        onClick={() => handleDelete(hotel.id)}
                      >
                        <FaTrashAlt />
                      </button>
                      <Link to={`/admin/index-hotel-images/${hotel.id}`} className="btn btn-primary m-4">
                        Quản lý hình ảnh
                      </Link>
                    </td>
                    <td className="action-buttons">
                      <Link to={`/admin/index-room/${hotel.id}`} className="btn btn-primary ">
                        <FaDoorOpen />
                        Quản lý phòng
                      </Link>


                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            <HotelPaginator
              currentPage={currentPage}
              totalPages={calculateTotalPages(filteredHotels, hotelsPerPage, hotels)}
              onPageChange={handlePaginationClick}
            />
          </section>
        </>
      )}
    </>
  );
};

export default IndexHotel;
