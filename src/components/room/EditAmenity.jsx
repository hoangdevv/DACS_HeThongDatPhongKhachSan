import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { useParams } from "react-router-dom";
import { updateAmenities } from "../utils/ApiFunctions";

const EditAmenity = ({ selectedAmenity, onUpdateSuccess, onCancel }) => {
    const { amenityId } = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedAmenity) {
            setName(selectedAmenity.name || "");
            setDescription(selectedAmenity.description || "");
        }
    }, [selectedAmenity]);

    const handleUpdateAmenity = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            if (!selectedAmenity || !selectedAmenity.id) {
                throw new Error("Invalid selectedAmenity or selectedAmenity.id is undefined");
            }
            const updatedAmenity = { id: selectedAmenity.id, name, description };
            const response = await updateAmenities(selectedAmenity.id, updatedAmenity);
            console.log('Updated amenity:', response); // Debug log
            onUpdateSuccess(response);
            Swal.fire('Thành công!', 'Thông tin tiện ích đã được cập nhật!', 'success');
            window.location.reload();
        } catch (error) {
            console.error("Error updating amenity:", error);
            Swal.fire('Thất bại!', 'Không thể cập nhật thông tin tiện ích.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="container">
            <form onSubmit={handleUpdateAmenity} className="mt-3">
                <h3>Cập nhật tiện ích</h3>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên tiện ích:</label>
                    <input type="text" id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Mô tả:</label>
                    <textarea type="text" id="description" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)}  rows="3"/>
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Cập nhật</button>
                    <button type="button" className="btn btn-secondary m-2" onClick={handleCancel}>Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default EditAmenity;
