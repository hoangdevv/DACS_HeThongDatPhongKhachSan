import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { deleteRoom, getAllRooms, getRoomTypes } from "../utils/ApiFunctions";
import { Col, Row } from "react-bootstrap";
import { FaEdit, FaEye, FaTrashAlt, FaPlus, FaCircle, FaSearch } from "react-icons/fa";
import BeatLoader from "react-spinners/BeatLoader";
import RoomPaginator from "../common/RoomPaginator";
import RoomFilter from "../common/RoomFilter";
import Swal from "sweetalert2"
import 'bootstrap/dist/css/bootstrap.min.css';

const IndexRoom = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [roomsPerPage] = useState(8);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    // Use useParams hook to get the hotelId from the URL
    const { hotelId } = useParams();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer); // Clear timeout khi component unmounts
    }, []);

    useEffect(() => {
        fetchRooms();
        fetchRoomTypes();
    }, [hotelId]);

    const handleSearchInputChange = (event) => {
        setSearchKeyword(event.target.value);
        filterRooms(event.target.value);
    };

    const filterRooms = (keyword) => {
        const filteredData = rooms.filter(
            (room) =>
                room.name.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredRooms(filteredData);
    };

    const fetchRooms = async () => {
        setIsLoading(true);
        try {
            const result = await getAllRooms(hotelId);
            setRooms(result || []);
            setIsLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const fetchRoomTypes = async () => {
        setIsLoading(true);
        try {
            const result = await getRoomTypes();
            setRoomTypes(result || []);
            setIsLoading(true);
        } catch (error) {
            setIsLoading(false);
        }
    };

    const handleDelete = async (roomId) => {
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
                    await deleteRoom(hotelId, roomId);
                    await fetchRooms();
                    await fetchRoomTypes();

                    // const updatedRooms = rooms.filter(room => room.id !== roomId);
                    // setRooms(updatedRooms);
                    // setFilteredRooms(updatedRooms);
                    Swal.fire(
                        'Xóa thành công!',
                        `Phòng mã: ${roomId} thuộc khách sạn mã ${hotelId} đã được xóa.`,
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
        })

    };


    const indexOfLastRoom = currentPage * roomsPerPage;
    const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
    const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
    const calculateTotalPages = (data) => Math.ceil(data.length / roomsPerPage);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
            {isLoading ? (
                <BeatLoader color="#36d7b7" />
            ) : (
                <>
                    <section className="mt-5 mb-5 ">
                        <div className="row  justify-content-center mb-3 mt-5">
                            <h2>Danh sách phòng</h2>
                        </div>
                        <Row className="mb-3">
                            <Col md={4}>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FaSearch />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Tìm kiếm theo tên phòng..."
                                        value={searchKeyword}
                                        onChange={handleSearchInputChange}
                                    />
                                </div>
                            </Col>

                            <Col md={4} >
                                <RoomFilter data={rooms}
                                    setFilteredData={setFilteredRooms}
                                    roomTypes={roomTypes}
                                    clearFilter={() => setFilteredRooms(rooms)}
                                />
                            </Col>

                            <Col md={4} className="d-flex justify-content-end">
                                <Link to={`/admin/add-room/${hotelId}`}>
                                    <FaPlus /> Thêm phòng
                                </Link>
                            </Col>
                        </Row>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr className="text-center">
                                    <th>Số phòng</th>
                                    <th>Tên phòng</th>
                                    <th>Loại phòng</th>
                                    <th>Số người tối đa</th>
                                    <th>Giá VND/ đêm</th>
                                    <th>Tổng số phòng </th>
                                    <th>Trạng thái</th>
                                    <th>Chức năng</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentRooms.map((room) => (
                                    <tr key={room.id} className="text-center">
                                        <td>{room.id}</td>
                                        <td>{room.name}</td>
                                        <td>{room.type ? room.type.name : ''}</td>
                                        <td>{room.maxOccupancy}</td>
                                        <td>{formatCurrency(room.pricePerNight)}</td>
                                        <td>
                                            {room.totalQuantity}
                                            <br />
                                            <span className={`text ${room.availableQuantity <= 3 ? 'text-danger' : 'text-success'}`}>
                                                Còn {room.availableQuantity} phòng
                                            </span>
                                        </td>
                                        <td>{room.isAvailable ? <FaCircle color="green" /> : <FaCircle color="red" />}</td>
                                        <td className="gap-2">
                                            <Link to={`/admin/edit-room/${hotelId}/room/${room.id}`} className="gap-2">
                                                <span className="btn btn-warning btn-sm m-2" title="Xem/Sửa">
                                                    <FaEdit />
                                                </span>
                                            </Link>
                                            <button
                                                className="btn btn-danger btn-sm" title="Xóa"
                                                onClick={() => handleDelete(room.id)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                            <Link to={`/admin/index-room-images/${hotelId}/room/${room.id}`} className="btn btn-primary m-4">
                                                Quản lý hình ảnh
                                            </Link>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <RoomPaginator
                            currentPage={currentPage}
                            totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
                            onPageChange={handlePaginationClick}
                        />

                        <Link to="/admin/index-hotels" className="btn btn-secondary m-4">
                            Trở về
                        </Link>
                    </section>
                </>
            )}

        </>
    );
};

export default IndexRoom;
