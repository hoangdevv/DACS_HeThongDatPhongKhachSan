	package com.project.hethongkhachsan.service.impl;
	
	import java.io.IOException;
	import java.nio.file.Files;
	import java.nio.file.Path;
	import java.nio.file.Paths;
	import java.util.ArrayList;
	import java.util.HashSet;
	import java.util.List;
	import java.util.Objects;
	import java.util.Optional;
	import java.util.Set;
	import java.util.UUID;
	import java.util.stream.Collectors;
	
	import org.modelmapper.ModelMapper;
	import org.springframework.beans.factory.annotation.Autowired;
	import org.springframework.stereotype.Service;
	import org.springframework.web.multipart.MultipartFile;
	
	import com.project.hethongkhachsan.dto.AmenityDTO;
	import com.project.hethongkhachsan.dto.RoomDTO;
	import com.project.hethongkhachsan.dto.RoomImageDTO;
	import com.project.hethongkhachsan.entity.AmenityEntity;
	import com.project.hethongkhachsan.entity.HotelEntity;
	import com.project.hethongkhachsan.entity.RoomEntity;
	import com.project.hethongkhachsan.entity.RoomImageEntity;
	import com.project.hethongkhachsan.entity.TypeEntity;
	import com.project.hethongkhachsan.repository.AmenityRepository;
	import com.project.hethongkhachsan.repository.HotelRepository;
	import com.project.hethongkhachsan.repository.RoomImageRepository;
	import com.project.hethongkhachsan.repository.RoomRepository;
	import com.project.hethongkhachsan.repository.TypeRepository;
	import com.project.hethongkhachsan.service.IRoomService;
	
	import javassist.NotFoundException;
	
	@Service
	public class RoomService implements IRoomService {
	
		@Autowired
		private ModelMapper modelMapper;
	
		@Autowired
		private RoomRepository roomRepository;
	
		@Autowired
		private RoomImageRepository roomImageRepository;
	
		@Autowired
		private HotelRepository hotelRepository;
	
		@Autowired
		private AmenityRepository amenityRepository;
	
		@Autowired
		private TypeRepository typeRepository;
	
		@Override
		public RoomDTO getOneRoom(Long hotelId, Long id) {
			Optional<RoomEntity> roomOptional = roomRepository.findByIdAndHotelId(id, hotelId);
			RoomEntity roomEntity;
			try {
				roomEntity = roomOptional.orElseThrow(() -> new NotFoundException("Room not found"));
			} catch (NotFoundException e) {
				e.printStackTrace();
				return null;
			}
			return modelMapper.map(roomEntity, RoomDTO.class);
		}
	
		@Override
		public List<RoomDTO> getAllRooms(Long hotelId) {
			List<RoomEntity> roomEntities = roomRepository.findByHotelId(hotelId);
			return roomEntities.stream().map(roomEntity -> modelMapper.map(roomEntity, RoomDTO.class))
					.collect(Collectors.toList());
		}
	
		@Override
		public List<RoomImageDTO> getImagesByRoom(Long hotelId, Long roomId) {
			Optional<HotelEntity> hotelOptional = hotelRepository.findById(hotelId);
			if (!hotelOptional.isPresent()) {
				return new ArrayList<>();
			}
			HotelEntity hotel = hotelOptional.get();
			Optional<RoomEntity> roomOptional = hotel.getRooms().stream().filter(room -> room.getId().equals(roomId))
					.findFirst();
			if (!roomOptional.isPresent()) {
				return new ArrayList<>();
			}
			RoomEntity room = roomOptional.get();
	
			// Chuyển đổi danh sách RoomImageEntity thành danh sách RoomImageDTO
			List<RoomImageDTO> roomImageDTOs = room.getRoomImages().stream()
					.map(roomImage -> modelMapper.map(roomImage, RoomImageDTO.class)).collect(Collectors.toList());
	
			return roomImageDTOs;
		}
	
		@Override
		public RoomDTO addRoom(Long hotelId, RoomDTO roomDTO) throws NotFoundException {
			RoomEntity roomEntity = modelMapper.map(roomDTO, RoomEntity.class);
	
			// Kiểm tra xem khách sạn có tồn tại không
			HotelEntity hotelEntity = hotelRepository.findById(hotelId)
					.orElseThrow(() -> new NotFoundException("Hotel not found"));
	
			roomEntity.setHotel(hotelEntity);
	
			// Thiết lập totalQuantity và availableQuantity
			if (roomDTO.getTotalQuantity() != null) {
				roomEntity.setTotalQuantity(roomDTO.getTotalQuantity());
				roomEntity.setAvailableQuantity(roomDTO.getTotalQuantity()); // Đảm bảo availableQuantity khởi đầu bằngs totalQuantity
			} else {
				// Nếu totalQuantity không được cung cấp, mặc định là 0
				roomEntity.setTotalQuantity(0);
				roomEntity.setAvailableQuantity(0);
			}
	
			// Kiểm tra và thêm loại phòng
			if (roomDTO.getType() != null && roomDTO.getType().getId() != null) {
				TypeEntity typeEntity = typeRepository.findById(roomDTO.getType().getId())
						.orElseThrow(() -> new NotFoundException("Type not found"));
				roomEntity.setType(typeEntity);
			}
	
			// Thêm danh sách tiện ích cho phòng
			List<AmenityEntity> roomAmenities = new ArrayList<>();
			if (roomDTO.getAmenities() != null && !roomDTO.getAmenities().isEmpty()) {
				for (AmenityDTO amenityDTO : roomDTO.getAmenities()) {
					AmenityEntity amenityEntity = amenityRepository.findById(amenityDTO.getId()).orElseThrow(
							() -> new NotFoundException("Amenity with ID " + amenityDTO.getId() + " not found"));
					roomAmenities.add(amenityEntity);
				}
			}
			roomEntity.setAmenities(new HashSet<>(roomAmenities));
	
			RoomEntity savedRoomEntity = roomRepository.save(roomEntity);
	
			// Cập nhật danh sách các phòng của mỗi tiện ích
			for (AmenityEntity amenityEntity : roomAmenities) {
				Set<RoomEntity> rooms = amenityEntity.getRooms();
				rooms.add(savedRoomEntity);
				amenityEntity.setRooms(rooms);
				amenityRepository.save(amenityEntity);
			}
	
			return modelMapper.map(savedRoomEntity, RoomDTO.class);
		}
	
		@Override
		public void addRoomImages(Long hotelId, Long roomId, List<MultipartFile> roomImages) {
			RoomEntity room = roomRepository.findById(roomId).orElseThrow(() -> new RuntimeException("Room not found"));
	
			if (!room.getHotel().getId().equals(hotelId)) {
				throw new RuntimeException("Room does not belong to the specified hotel");
			}
	
			for (MultipartFile image : roomImages) {
				try {
					// Lưu trữ file ảnh vào thư mục và lấy URL
					String imageUrl = saveImage(image);
	
					RoomImageEntity imageEntity = new RoomImageEntity();
					imageEntity.setRoom(room);
					imageEntity.setImageUrl(imageUrl);
					roomImageRepository.save(imageEntity);
				} catch (IOException e) {
					throw new RuntimeException("Failed to store image", e);
				}
			}
		}
	
		private String saveImage(MultipartFile image) throws IOException {
			String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
			Path filePath = Paths.get("images/room", fileName);
			Files.createDirectories(filePath.getParent());
			Files.write(filePath, image.getBytes());
			return "/images/room/" + fileName;
		}
	
		@Override
		public RoomDTO updateRoom(Long hotelId, Long id, RoomDTO roomDTO) {
			// Kiểm tra xem phòng có tồn tại không
			Optional<RoomEntity> roomOptional = roomRepository.findById(id);
			if (!roomOptional.isPresent()) {
				try {
					throw new NotFoundException("Room not found");
				} catch (NotFoundException e) {
					e.printStackTrace();
	
				}
			}
			RoomEntity roomEntity = roomOptional.get();
	
			// Kiểm tra xem khách sạn có tồn tại không
			Optional<HotelEntity> hotelEntityOptional = hotelRepository.findById(hotelId);
			HotelEntity hotelEntity;
			try {
				hotelEntity = hotelEntityOptional.orElseThrow(() -> new NotFoundException("Hotel not found"));
			} catch (NotFoundException e) {
				e.printStackTrace();
				return null;
			}
			roomEntity.setHotel(hotelEntity);
	
			roomEntity.setName(roomDTO.getName());
			roomEntity.setDescription(roomDTO.getDescription());
			roomEntity.setIsAvailable(roomDTO.getIsAvailable());
			roomEntity.setMaxOccupancy(roomDTO.getMaxOccupancy());
			roomEntity.setPricePerNight(roomDTO.getPricePerNight());
			roomEntity.setTotalQuantity(roomDTO.getTotalQuantity());
	
			// Kiểm tra và cập nhật loại phòng
			if (roomDTO.getType() != null && roomDTO.getType().getId() != null) {
				Optional<TypeEntity> typeOptional = typeRepository.findById(roomDTO.getType().getId());
				if (typeOptional.isPresent()) {
					TypeEntity typeEntity = typeOptional.get();
					roomEntity.setType(typeEntity);
				} else {
					try {
						throw new NotFoundException("Type not found");
					} catch (NotFoundException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
				}
			} else {
				try {
					throw new NotFoundException("Type ID is required");
				} catch (NotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
	
			// Đảm bảo rằng danh sách amenities không rỗng
			if (roomDTO.getAmenities() != null && !roomDTO.getAmenities().isEmpty()) {
				// Lấy danh sách ID của các tiện ích được cung cấp từ roomDTO
				Set<Long> dtoAmenityIds = roomDTO.getAmenities().stream().map(AmenityDTO::getId).filter(Objects::nonNull)
						.collect(Collectors.toSet());
	
				// Loại bỏ các tiện ích không còn trong roomDTO khỏi roomEntity
				Set<AmenityEntity> currentAmenities = new HashSet<>(roomEntity.getAmenities());
				currentAmenities.stream().filter(amenity -> !dtoAmenityIds.contains(amenity.getId())).forEach(amenity -> {
					roomEntity.getAmenities().remove(amenity);
					amenity.getRooms().remove(roomEntity);
				});
	
				// Thêm hoặc cập nhật các tiện ích từ roomDTO
				for (AmenityDTO amenityDTO : roomDTO.getAmenities()) {
					Optional<AmenityEntity> amenityOptional = amenityRepository.findById(amenityDTO.getId());
					if (amenityOptional.isPresent()) {
						AmenityEntity amenityEntity = amenityOptional.get();
						if (!roomEntity.getAmenities().contains(amenityEntity)) {
							roomEntity.getAmenities().add(amenityEntity);
							amenityEntity.getRooms().add(roomEntity);
						}
					} else {
						// Ngoại lệ nếu tiện ích không tìm thấy.
						try {
							throw new NotFoundException("Amenity with ID " + amenityDTO.getId() + " not found");
						} catch (NotFoundException e) {
							e.printStackTrace();
						}
					}
				}
			} else {
				// Nếu không có danh sách tiện ích nào được cung cấp, xóa tất cả tiện ích từ
				// roomEntity
				roomEntity.getAmenities().clear();
			}
	
			// Lưu thực thể phòng cập nhật vào cơ sở dữ liệu
			RoomEntity updatedRoomEntity = roomRepository.save(roomEntity);
			return modelMapper.map(updatedRoomEntity, RoomDTO.class);
		}
	
		@Override
		public boolean deleteRoom(Long hotelId, Long id) {
			Optional<RoomEntity> roomOptional = roomRepository.findByIdAndHotelId(id, hotelId);
			if (roomOptional.isPresent()) {
				RoomEntity roomEntity = roomOptional.get();
	
				// Xóa mối quan hệ Many-to-Many với AmenityEntity
				for (AmenityEntity amenity : roomEntity.getAmenities()) {
					amenity.getRooms().remove(roomEntity);
					amenityRepository.save(amenity);
				}
	
				roomRepository.delete(roomEntity);
				return true;
			}
			return false;
		}
	
		@Override
		public boolean deleteRoomImage(Long imageId) {
			Optional<RoomImageEntity> imageOptional = roomImageRepository.findById(imageId);
			if (imageOptional.isPresent()) {
				roomImageRepository.delete(imageId);
				return true;
			}
			return false;
		}
	
	}
