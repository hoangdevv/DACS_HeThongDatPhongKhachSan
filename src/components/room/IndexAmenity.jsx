import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { getAllAmenities, deleteAmenities } from "../utils/ApiFunctions";
import BeatLoader from "react-spinners/BeatLoader";
import AddAmenity from "./AddAmenity";
import UpdateAmenity from "./EditAmenity";

const IndexAmenity = () => {
    const [amenities, setAmenities] = useState([]);
    const [selectedAmenity, setSelectedAmenity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        fetchAmenities();
    }, []);

    const fetchAmenities = async () => {
        try {
            const response = await getAllAmenities();
            console.log('Fetched amenities:', response); // Debug log
            if (response && Array.isArray(response)) {
                setAmenities(response);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error("Error fetching amenities:", error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách tiện ích.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddAmenity = async (newAmenity) => {
        try {
            setIsSubmitting(true);
            const response = await addAmenities(newAmenity);
            console.log('Added new amenity:', response); // Debug log
            setAmenities([...amenities, response]);
            setShowAddForm(false);
            Swal.fire('Thành công!', 'Tiện ích đã được thêm!', 'success');
        } catch (error) {
            console.error("Error adding amenity:", error);
            Swal.fire('Thất bại!', 'Không thể thêm tiện ích.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditAmenity = async (updatedAmenity) => {
        try {
            setIsSubmitting(true);
            const response = await updateAmenities(updatedAmenity.id, updatedAmenity);
            console.log('Updated amenity:', response); // Debug log
            const updatedAmenities = amenities.map(item =>
                item.id === response.id ? response : item
            );
            setAmenities(updatedAmenities);
            setShowEditForm(false);
            Swal.fire('Thành công!', 'Thông tin tiện ích đã được cập nhật!', 'success');
        } catch (error) {
            console.error("Error updating amenity:", error);
            Swal.fire('Thất bại!', 'Không thể cập nhật thông tin tiện ích.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAmenity = async (amenityId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xoá tiện ích này?',
            text: "Bạn sẽ không thể khôi phục lại nó!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xoá',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                setIsSubmitting(true);
                await deleteAmenities(amenityId);
                const updatedAmenities = amenities.filter(item => item.id !== amenityId);
                setAmenities(updatedAmenities);
                Swal.fire('Thành công!', 'Tiện ích đã được xoá!', 'success');
            } catch (error) {
                console.error("Error deleting amenity:", error);
                Swal.fire('Thất bại!', 'Không thể xoá tiện ích.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleEditClick = (amenity) => {
        setSelectedAmenity(amenity);
        setShowEditForm(true);
    };

    const handleAddClick = () => {
        setShowAddForm(true);
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
    };

    const handleCancelEdit = () => {
        setShowEditForm(false);
        setSelectedAmenity(null);
    };

    return (
        <div className="container mt-4">
            <h2>Danh sách tiện ích</h2>
            {isLoading ? (
                <div className="text-center">
                    <BeatLoader color="#36D7B7" loading={isLoading} size={20} />
                </div>
            ) : (
                <div>
                    <button className="btn btn-primary mb-3" onClick={handleAddClick}>Thêm mới tiện ích</button>
                    {showAddForm && <AddAmenity onAddSuccess={handleAddAmenity} onCancel={handleCancelAdd} />}
                    {showEditForm && <UpdateAmenity selectedAmenity={selectedAmenity} onUpdateSuccess={handleEditAmenity} onCancel={handleCancelEdit} />}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tên tiện ích</th>
                                    <th scope="col">Mô tả</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {amenities.map((amenity, index) => (
                                    <tr key={amenity.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{amenity.name}</td>
                                        <td style={{ maxWidth: "300px", overflowWrap: "break-word" }}>{amenity.description}</td>
                                        <td>
                                            <button className="btn btn-info btn-sm me-2" onClick={() => handleEditClick(amenity)}>Chỉnh sửa</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAmenity(amenity.id)}>Xoá</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndexAmenity;
