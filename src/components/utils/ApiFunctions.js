import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:8088"
})

export const getHeader = () => {
    const token = localStorage.getItem("token")
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    }
}
// Auth
export async function registerUser(registration) {
    try {
        const response = await api.post("/api/auths/register-user", registration)
        return response.data
    } catch (error) {
        if (error.reeponse && error.response.data) {
            throw new Error(error.response.data)
        } else {
            throw new Error(`User registration error : ${error.message}`)
        }
    }
}

export async function loginUser(login) {
    try {
        const response = await api.post("/api/auths/login-user", login)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        } else {
            return null
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getUserById(userId) {
    try {
        const response = await api.get(`/api/users/get-user-by-id/${userId}`)
        return response.data
    } catch (error) {
        throw error
    }
}

export async function updateUser(userId, userData) {
    try {
        const response = await api.put(`/api/users/update-user/${userId}`, userData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi cập nhật người dùng: ${error.message}`);
    }
}

export const sendOTPEmail = async (email) => {
    try {
        const response = await api.post(`/api/send-otp`, email, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};
export const verifyOTP = async (token, otp) => {
    try {
        const response = await api.post(`/api/verify-otp`, {
            token: token,
            otp: otp
        });
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        throw error;
    }
};
// End Auth

// Hotel
export async function getHotelById(hotelId) {
    try {
        const response = await api.get(`/api/hotels/get-hotel/${hotelId}`)
        return response.data
    } catch (error) {
        throw new Error(`Không tìm thấy id:${hotelId}, ${error.message}`)
    }
}

export async function getAllHotels() {
    try {
        const response = await api.get("/api/hotels/list-hotel")
        return response.data
    } catch (error) {
        throw new Error("Không tìm thấy danh sách")
    }
}

export async function addHotel(hotelData) {
    try {
        const response = await api.post("/api/hotels/add-hotel", hotelData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        console.error("Error adding hotel: ", error);
        throw new Error("Error adding hotel: " + error.message);
    }
}
export async function updateHotelThumbnail(hotelId, thumbnailImage) {
    try {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailImage);

        const response = await api.put(`/api/hotels/update-thumbnail/${hotelId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding hotel images: ", error);
        throw new Error("Error adding hotel images: " + error.message);
    }
}
export async function addHotelImages(hotelId, hotelImages) {
    try {
        const formData = new FormData();
        hotelImages.forEach((image) => {
            formData.append("hotelImages", image);
        });

        const response = await api.post(`/api/hotels/add-images/${hotelId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding hotel images: ", error);
        throw new Error("Error adding hotel images: " + error.message);
    }
}
export async function updateHotel(hotelId, hotelData) {
    try {
        const response = await api.put(`/api/hotels/update-hotel/${hotelId}`, hotelData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi cập nhật: ", error);
    }
}
export async function deleteHotel(hotelId) {
    try {
        const response = await api.delete(`/api/hotels/delete-hotel/${hotelId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`)
    }
}

// end Hotel

// Room
export async function getRoomById(hotelId, roomId) {
    try {
        const response = await api.get(`/api/rooms/hotel/${hotelId}/get-room/${roomId}`)
        return response.data
    } catch (error) {
        throw new Error(`Không tìm thấy id:${roomId}, ${error.message}`)
    }
}

export async function getAllRooms(hotelId) {
    try {
        const response = await api.get(`/api/rooms/hotel/${hotelId}/get-all-rooms`)
        return response.data
    } catch (error) {
        throw new Error("Không tìm thấy danh sách")
    }
}

export async function addRoom(hotelId, roomData) {
    try {
        const response = await api.post(`/api/rooms/hotel/${hotelId}/add-room`, roomData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi thêm: " + error.message);
    }
}

export async function addRoomImages(hotelId, roomId, roomImages) {
    const formData = new FormData();

    roomImages.forEach((image) => {
        formData.append("roomImages", image);
    });

    try {
        const response = await api.post(`/api/rooms/hotel/${hotelId}/add-image/${roomId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding room images: ", error);
        throw new Error("Error adding room images: " + error.message);
    }
}

export async function updateRoom(hotelId, roomId, roomData) {
    try {
        const response = await api.put(`/api/rooms/hotel/${hotelId}/update-room/${roomId}`, roomData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi cập nhật: ", error);
    }
}

export async function deleteRoom(hotelId, roomId) {
    try {
        const response = await api.delete(`/api/rooms/hotel/${hotelId}/delete-room/${roomId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`)
    }
}

// end Room

//Type Room
export const getRoomTypes = async () => {
    try {
        const response = await api.get(`/api/types/list-types`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch room types: " + error.message);
    }
};

export async function addRoomType(typeData) {
    try {
        const response = await api.post(`/api/types/add-type`, typeData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi thêm: " + error.message);
    }
}

export async function updateRoomType(typeId, typeData) {
    try {
        const response = await api.put(`/api/types/update-type/${typeId}`, typeData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi update: " + error.message);
    }
}

export async function deleteRoomType(typeId) {
    try {
        const response = await api.delete(`/api/types/delete-type/${typeId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`)
    }
}

// Amenity

export const getAllAmenities = async () => {
    try {
        const response = await api.get("/api/amenities/get-all-amenities");
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch amenity: " + error.message);
    }
};
export async function getAmenitiesByRoom(roomId) {
    try {
        const response = await api.get(`/api/amenities/get-name/room/${roomId}`)
        return response.data
    } catch (error) {
        throw new Error("Không tìm thấy danh sách")
    }
}
export async function addAmenities(amenityData) {
    try {
        const response = await api.post(`/api/amenities/add-amenities`, amenityData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi thêm: " + error.message);
    }
}

export async function updateAmenities(amenityId, amenityData) {
    try {
        const response = await api.put(`/api/amenities/update-amenities/${amenityId}`, amenityData, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error("Lỗi update: " + error.message);
    }
}

export async function deleteAmenities(amenityId) {
    try {
        const response = await api.delete(`/api/amenities/delete-amenities/${amenityId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`)
    }
}
//Image 

export async function getImageByHotel(hotelId) {
    try {
        const response = await api.get(`/api/hotels/get-image/${hotelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching hotel images: ", error);
        throw new Error("Error fetching hotel images: " + error.message);
    }
}

export async function deleteHotelImage(imageId) {
    if (!imageId) {
        throw new Error(`Không có Hotel Image:${imageId} được cung cấp`);
    }
    try {
        const response = await api.delete(`/api/hotels/delete-image/${imageId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`);
    }
}

export async function getImageByRoom(hotelId, roomId) {
    try {
        const response = await api.get(`/api/rooms/hotel/${hotelId}/get-image-room/${roomId}`)
        return response.data
    } catch (error) {
        throw new Error(`Không tìm thấy hình ảnh của phòng: ${roomId}`)
    }
}

export async function deleteRoomImage(imageId) {
    if (!imageId) {
        throw new Error(`Không có Room Image:${imageId} được cung cấp`);
    }
    try {
        const response = await api.delete(`/api/rooms/delete-image/${imageId}`, {
            headers: getHeader()
        });
        return response.data;
    } catch (error) {
        throw new Error(`Lỗi xóa ${error.message}`);
    }
}
// 
// Booking

export const addBooking = async (bookingData) => {
  try {
    const response = await api.post("/api/bookings/add-booking", bookingData);
    return response.data;
  } catch (error) {
    console.error('Error adding booking:', error);
    throw error;
  }
};
