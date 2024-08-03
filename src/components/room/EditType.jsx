import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";
import { updateRoomType } from "../utils/ApiFunctions";

const EditType = ({ selectedType, onUpdateSuccess, onCancel }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedType) {
            setName(selectedType.name || "");
            setDescription(selectedType.description || "");
        }
    }, [selectedType]);

    const handleUpdateType = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (!selectedType || !selectedType.id) {
                throw new Error("Invalid selectedType or selectedType.id is undefined");
            }
            const updatedType = { id: selectedType.id, name, description };
            const response = await updateRoomType(selectedType.id, updatedType);
            console.log('Updated type:', response.data); // Debug log
            onUpdateSuccess(response.data);
            Swal.fire('Thành công!', 'Thông tin loại phòng đã được cập nhật!', 'success');
            window.location.reload();
        } catch (error) {
            console.error("Error updating room type:", error);
            Swal.fire('Thất bại!', 'Không thể cập nhật thông tin loại phòng.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="container">
            <form onSubmit={handleUpdateType} className="mt-3">
                <h3>Cập nhật loại phòng</h3>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên loại:</label>
                    <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả:</label>
                    <textarea type="text" id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"/>
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Cập nhật</button>
                    <button type="button" className="btn btn-secondary m-2" onClick={handleCancel}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditType;
