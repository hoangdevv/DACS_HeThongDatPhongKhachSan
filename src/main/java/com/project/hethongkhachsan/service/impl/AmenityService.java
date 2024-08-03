package com.project.hethongkhachsan.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.AmenityDTO;
import com.project.hethongkhachsan.entity.AmenityEntity;
import com.project.hethongkhachsan.entity.RoomEntity;
import com.project.hethongkhachsan.repository.AmenityRepository;
import com.project.hethongkhachsan.repository.RoomRepository;
import com.project.hethongkhachsan.service.IAmenityService;

@Service
public class AmenityService implements IAmenityService {
	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private AmenityRepository amenityRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Override
	public List<AmenityDTO> getAllAmenities() {
		List<AmenityEntity> amenities = amenityRepository.findAll();
		return amenities.stream().map(amenityEntity -> modelMapper.map(amenityEntity, AmenityDTO.class))
				.collect(Collectors.toList());
	}

	@Transactional
	public AmenityDTO addAmenity(AmenityDTO amenityDTO) {
		AmenityEntity amenity = modelMapper.map(amenityDTO, AmenityEntity.class);
		AmenityEntity savedAmenity = amenityRepository.save(amenity);
		return modelMapper.map(savedAmenity, AmenityDTO.class);
	}

	@Transactional
	public AmenityDTO updateAmenity(Long amenityId, AmenityDTO amenityDTO) {
		AmenityEntity existingAmenity = amenityRepository.findById(amenityId)
				.orElseThrow(() -> new IllegalArgumentException("Amenity not found"));

		existingAmenity.setName(amenityDTO.getName());
		existingAmenity.setDescription(amenityDTO.getDescription());

		AmenityEntity updatedAmenity = amenityRepository.save(existingAmenity);
		return modelMapper.map(updatedAmenity, AmenityDTO.class);
	}

	@Transactional
	public void deleteAmenity(Long amenityId) {
		AmenityEntity existingAmenity = amenityRepository.findById(amenityId)
				.orElseThrow(() -> new IllegalArgumentException("Amenity not found"));

		// Xóa các bản ghi trong bảng liên kết trước
		for (RoomEntity room : existingAmenity.getRooms()) {
			room.getAmenities().remove(existingAmenity);
		}

		// Lưu các thay đổi trong các phòng
		for (RoomEntity room : existingAmenity.getRooms()) {
			roomRepository.save(room);
		}

		// Xóa tiện ích
		amenityRepository.delete(existingAmenity);
	}

	@Override
	public List<String> getNameAmenitiesByRoom(Long roomId) {
		// Fetch room entity by roomId
		RoomEntity room = roomRepository.findById(roomId)
				.orElseThrow(() -> new IllegalArgumentException("Room not found with id: " + roomId));

		// Extract amenity names from the room entity
		List<String> amenityNames = room.getAmenities().stream().map(amenity -> amenity.getName())
				.collect(Collectors.toList());

		return amenityNames;
	}

}
