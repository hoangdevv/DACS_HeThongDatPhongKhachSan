import React, { useState } from "react";

const HotelFilter = ({ data, setFilteredData }) => {
    const [filter, setFilter] = useState("");

    const handleSelectChange = (e) => {
        const selectedCity = e.target.value;
        setFilter(selectedCity);

        const filteredHotels = data.filter((hotel) =>
            hotel.city.toLowerCase().includes(selectedCity.toLowerCase())
        );
        setFilteredData(filteredHotels);
    };

    const clearFilter = () => {
        setFilter("");
        setFilteredData(data);
    };

    const cities = ["", ...new Set(data.map((hotel) => hotel.city))];

    return (
        <div className="input-group mb-2">
            <span className="input-group-text" id="city-filter">
                Thành phố
            </span>
            <select
                className="form-select"
                aria-label="city filter"
                value={filter}
                onChange={handleSelectChange}
            >
                <option value="">Tìm kiếm thành phố....</option>
                {cities.map((city, index) => (
                    <option key={index} value={String(city)}>
                        {String(city)}
                    </option>
                ))}
            </select>
            <button className="btn btn-hotel" type="button" onClick={clearFilter}>
                Xóa bộ lọc
            </button>
        </div>
    );
};

export default HotelFilter;
