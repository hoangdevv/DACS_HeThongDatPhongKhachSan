import React, { useState, useEffect } from "react";
import { getRoomTypes, deleteRoomType } from "../utils/ApiFunctions";

const RoomTypeSelector = ({ handleRoomInputChange, newRoom }) => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [showNewRoomTypeInput, setShowNewRoomTypeInput] = useState(false);
    const [newRoomType, setNewRoomType] = useState("");

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            const types = await getRoomTypes();
            setRoomTypes(types);
        } catch (error) {
            console.error("Error fetching room types:", error);
        }
    };

    const handleNewRoomTypeInputChange = (e) => {
        setNewRoomType(e.target.value);
    };

    const handleAddNewRoomType = () => {
        if (newRoomType.trim() !== "") {
            setRoomTypes([...roomTypes, { id: roomTypes.length + 1, name: newRoomType }]);
            setNewRoomType("");
            setShowNewRoomTypeInput(false);
        }
    };

    const handleDeleteRoomType = async (typeId) => {
        try {
            await deleteRoomType(typeId);
            fetchRoomTypes();
        } catch (error) {
            console.error("Error deleting room type:", error);
        }
    };

    return (
        <>
            <div>
                <select
                    required
                    className="form-select"
                    name="roomType"
                    onChange={(e) => {
                        if (e.target.value === "Add New") {
                            setShowNewRoomTypeInput(true);
                        } else {
                            handleRoomInputChange(e);
                        }
                    }}
                    value={newRoom.roomType}
                >
                    <option value="">Select a room type</option>
                    {roomTypes.map((type) => (
                        <option key={type.id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                    {showNewRoomTypeInput && (
                        <option value={"Add New"} hidden>Add New</option>
                    )}
                </select>
                {showNewRoomTypeInput && (
                    <div className="mt-2">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter New Room Type"
                                value={newRoomType}
                                onChange={handleNewRoomTypeInputChange}
                            />
                            <button
                                className="btn btn-hotel"
                                type="button"
                                onClick={handleAddNewRoomType}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ul>
                {roomTypes.map((type) => (
                    <li key={type.id}>
                        {type.name}{" "}
                        <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteRoomType(type.id)}
                        >
                            X
                        </button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default RoomTypeSelector;
