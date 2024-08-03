import React, { useState } from "react";
import Swal from 'sweetalert2';
import { addAmenities } from "../utils/ApiFunctions";

const AddAmenity = ({ onAddSuccess, onCancel }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddAmenity = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const newAmenity = { name, description };
            const response = await addAmenities(newAmenity);
            console.log('Added new amenity:', response); // Debug log
            onAddSuccess(response);
            Swal.fire('Thành công!', 'Tiện ích đã được thêm!', 'success');
            window.location.reload();
        } catch (error) {
            console.error("Error adding amenity:", error);
            Swal.fire('Thất bại!', 'Không thể thêm tiện ích.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="container">
            <form onSubmit={handleAddAmenity} className="mt-3">
                <h3>Thêm mới tiện ích</h3>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên tiện ích:</label>
                    <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả:</label>
                    <textarea id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="3"  />
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Thêm mới</button>
                    <button type="button" className="btn btn-secondary m-3" onClick={handleCancel}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AddAmenity;
