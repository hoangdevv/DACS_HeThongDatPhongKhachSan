import React, { useState, useEffect } from "react";
import { getRoomTypes } from "../utils/ApiFunctions";

const RoomFilter = ({ data, setFilteredData }) => {
    const [typeFilter, setTypeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRoomTypes();
        setFilteredData(data);
    }, []);

    const fetchRoomTypes = async () => {
        setLoading(true);
        try {
            const types = await getRoomTypes();
            setRoomTypes(types);
            setLoading(false);
        } catch (error) {
            setError("Failed to fetch room types");
            setLoading(false);
        }
    };

    // const fetchRooms = async () => {
    //     setIsLoading(true);
    //     try {
    //         const result = await getAllRooms(hotelId);
    //         if (Array.isArray(result)) {
    //             setRooms(result);
    //             filterRooms(typeFilter, statusFilter, result);
    //         } else {
    //             setRooms([]);
    //         }
    //         setIsLoading(false);
    //     } catch (error) {
    //         setErrorMessage(error.message);
    //         setIsLoading(false);
    //         setRooms([]);
    //     }
    // };

    const handleTypeChange = (e) => {
        const selectedType = e.target.value;
        setTypeFilter(selectedType);
        filterRooms(selectedType, statusFilter);
    };

    const handleStatusChange = (e) => {
        const selectedStatus = e.target.value;
        setStatusFilter(selectedStatus);
        filterRooms(typeFilter, selectedStatus);
    };

    const filterRooms = (selectedType, selectedStatus) => {
        let filteredRooms = data;

        if (selectedType) {
            filteredRooms = filteredRooms.filter((room) => room.type && room.type.id === parseInt(selectedType));
        }

        if (selectedStatus !== "") {
            const status = selectedStatus === "true";
            filteredRooms = filteredRooms.filter((room) => room.isAvailable === status);
        }

        setFilteredData(filteredRooms);
    };

    const clearFilters = () => {
        setTypeFilter("");
        setStatusFilter("");
        setFilteredData(data);
    };
    // Lọc các tùy chọn cho select "room type" 
    const filteredRoomTypes = Array.isArray(roomTypes) ? roomTypes.filter((type) =>
        data.some((room) => room.type && room.type.id === type.id)
    ) : [];

    return (
        <div className="input-group mb-3">
            <select
                className="form-select"
                value={typeFilter}
                onChange={handleTypeChange}
            >
                <option value="">Chọn thể loại phòng...</option>
                {!loading && !error && Array.isArray(filteredRoomTypes) && filteredRoomTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                        {type.name}
                    </option>
                ))}
            </select>
            <select
                className="form-select"
                value={statusFilter}
                onChange={handleStatusChange}
            >
                <option value="">Chọn trạng thái phòng...</option>
                <option value="true">Đang hoạt động</option>
                <option value="false">Hết phòng</option>
            </select>
            <button className="btn btn-hotel" type="button" onClick={clearFilters}>
                Xóa bộ lọc
            </button>
            {loading && <span>Loading...</span>}
            {error && <span>{error}</span>}
        </div>
    );
};

export default RoomFilter;
