import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { getRoomTypes, addRoomType, updateRoomType, deleteRoomType } from "../utils/ApiFunctions";
import BeatLoader from "react-spinners/BeatLoader";
import AddType from "./AddType";
import EditType from "./EditType";

const IndexType = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const fetchRoomTypes = async () => {
        try {
            const response = await getRoomTypes();
            console.log('Fetched room types:', response); // Debug log
            if (response && Array.isArray(response)) {
                setRoomTypes(response);
            } else {
                throw new Error('Invalid data format');
            }
        } catch (error) {
            console.error("Error fetching room types:", error);
            Swal.fire('Lỗi!', 'Không thể tải danh sách loại phòng.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddType = async (newType) => {
        try {
            setIsSubmitting(true);
            const response = await addRoomType(newType);
            console.log('Added new type:', response); // Debug log
            setRoomTypes([...roomTypes, response]);
            setShowAddForm(false);
            Swal.fire('Thành công!', 'Loại phòng đã được thêm!', 'success');
        } catch (error) {
            console.error("Error adding room type:", error);
            Swal.fire('Thất bại!', 'Không thể thêm loại phòng.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditType = async (updatedType) => {
        try {
            setIsSubmitting(true);
            const response = await updateRoomType(updatedType.id, updatedType);
            console.log('Updated type:', response); // Debug log
            const updatedTypes = roomTypes.map(type =>
                type.id === response.id ? response : type
            );
            setRoomTypes(updatedTypes);
            setShowEditForm(false);
            Swal.fire('Thành công!', 'Thông tin loại phòng đã được cập nhật!', 'success');
        } catch (error) {
            console.error("Error updating room type:", error);
            Swal.fire('Thất bại!', 'Không thể cập nhật thông tin loại phòng.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteType = async (typeId) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc muốn xoá loại phòng này?',
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
                await deleteRoomType(typeId);
                const updatedTypes = roomTypes.filter(type => type.id !== typeId);
                setRoomTypes(updatedTypes);
                Swal.fire('Thành công!', 'Loại phòng đã được xoá!', 'success');
            } catch (error) {
                console.error("Error deleting room type:", error);
                Swal.fire('Thất bại!', 'Không thể xoá loại phòng.', 'error');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleAddFormShow = () => {
        setShowAddForm(true);
    };

    const handleEditFormShow = (type) => {
        setSelectedType(type);
        setShowEditForm(true);
    };

    const handleAddFormCancel = () => {
        setShowAddForm(false);
    };

    const handleEditFormCancel = () => {
        setSelectedType(null);
        setShowEditForm(false);
    };

    return (
        <div className="container mt-4">
            <h2>Quản lý loại phòng</h2>
            {isLoading ? (
                <div className="text-center">
                    <BeatLoader color="#36D7B7" loading={isLoading} size={20} />
                </div>
            ) : (
                <div>
                    <button className="btn btn-primary mb-3" onClick={handleAddFormShow}>Thêm mới loại phòng</button>
                    {showAddForm && <AddType onAddSuccess={handleAddType} onCancel={handleAddFormCancel} />}
                    {showEditForm && <EditType selectedType={selectedType} onUpdateSuccess={handleEditType} onCancel={handleEditFormCancel} />}
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Tên loại phòng</th>
                                    <th scope="col">Mô tả</th>
                                    <th scope="col">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roomTypes.map((type, index) => (
                                    <tr key={type.id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{type.name}</td>
                                        <td style={{ maxWidth: "300px", overflowWrap: "break-word" }}>{type.description}</td>
                                        <td>
                                            <button className="btn btn-info btn-sm me-2" onClick={() => handleEditFormShow(type)}>Chỉnh sửa</button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteType(type.id)}>Xoá</button>
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

export default IndexType;
