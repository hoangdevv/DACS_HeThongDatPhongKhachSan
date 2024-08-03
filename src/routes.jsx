import React from 'react'
const Dashboard = React.lazy(() => import('./components/views/admin/dashboard/Dashboard'))
const IndexHotels = React.lazy(() => import('./components/hotel/IndexHotel'))
const AddHotel = React.lazy(() => import('./components/hotel/AddHotel'))
const EditHotel = React.lazy(() => import('./components/hotel/EditHotel'))
const IndexHotelImages = React.lazy(() => import('./components/hotel/IndexHotelImage'))
const IndexRooms = React.lazy(() => import('./components/room/IndexRoom'))
const AddRoom = React.lazy(() => import('./components/room/AddRoom'))
const EditRoom = React.lazy(() => import('./components/room/EditRoom'))
const IndexRoomImages = React.lazy(() => import('./components/room/IndexRoomImage'))
const IndexType = React.lazy(() => import('./components/room/IndexType'))
const IndexAmenity = React.lazy(() => import('./components/room/IndexAmenity'))

const routes = [
    { path: '/admin/*', exact: true, name: 'Admin' },
    { path: '/dashboard', name: 'Bảng điều khiển', element: Dashboard },

    { path: '/hotel', name: 'Khách sạn',element: IndexHotels, exact: true },
    { path: '/index-hotels', name: 'Mục lục', element: IndexHotels},
    { path: '/add-hotel', name: 'Thêm khách sạn', element: AddHotel },
    { path: '/index-hotels/edit-hotel/:hotelId', name: 'Chỉnh sửa khách sạn', element: EditHotel },
    { path: '/index-hotel-images/:hotelId', name: 'Danh sách hình ảnh khách sạn', element: IndexHotelImages },
    
    { path: '/index-room/:hotelId', name: 'Mục lục', element: IndexRooms },
    { path: '/add-room/:hotelId', name: 'Thêm phòng', element: AddRoom },
    { path: '/edit-room/:hotelId/room/:roomId', name: 'Chỉnh sửa phòng', element: EditRoom },
    { path: '/index-room-images/:hotelId/room/:roomId', name: 'Danh sách hình ảnh phòng', element: IndexRoomImages },

    { path: '/index-type', name: 'Mục lục', element: IndexType },

    { path: '/index-amenity', name: 'Mục lục', element: IndexAmenity },


] 
export default routes
