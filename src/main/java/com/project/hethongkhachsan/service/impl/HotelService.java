package com.project.hethongkhachsan.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.hethongkhachsan.dto.HotelDTO;
import com.project.hethongkhachsan.dto.HotelImageDTO;
import com.project.hethongkhachsan.entity.HotelEntity;
import com.project.hethongkhachsan.entity.HotelImageEntity;
import com.project.hethongkhachsan.repository.HotelImageRepository;
import com.project.hethongkhachsan.repository.HotelRepository;
import com.project.hethongkhachsan.service.IHotelService;

@Service
@Transactional
public class HotelService implements IHotelService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private HotelRepository hotelRepository;

	@Autowired
	private HotelImageRepository hotelImageRepository;

	@Override
	public HotelDTO getOneHotel(Long id) {
		Optional<HotelEntity> hotelOptional = hotelRepository.findById(id);
		return hotelOptional.map(hotelEntity -> modelMapper.map(hotelEntity, HotelDTO.class)).orElse(null);
	}

	@Override
	public List<HotelDTO> getAllHotels() {
		List<HotelEntity> hotels = hotelRepository.findAll();
		return hotels.stream().map(hotelEntity -> modelMapper.map(hotelEntity, HotelDTO.class))
				.collect(Collectors.toList());
	}

	@Override
	public List<HotelImageDTO> getImagesByHotel(Long id) {
		Optional<HotelEntity> hotelOptional = hotelRepository.findById(id);
		if (!hotelOptional.isPresent()) {
			return new ArrayList<>();
		}
		HotelEntity hotel = hotelOptional.get();
		return hotel.getHotelImages().stream().map(image -> {
			HotelImageDTO dto = new HotelImageDTO();
			dto.setId(image.getId());
			dto.setImageUrl(image.getImageUrl());
			dto.setHotelId(hotel.getId());
			return dto;
		}).collect(Collectors.toList());
	}

	@Override
	public HotelDTO addHotel(HotelDTO hotelDTO) {
		HotelEntity hotelEntity = modelMapper.map(hotelDTO, HotelEntity.class);
		HotelEntity savedHotelEntity = hotelRepository.save(hotelEntity);
		return modelMapper.map(savedHotelEntity, HotelDTO.class);
	}

	@Override
	public void addHotelImages(Long hotelId, List<MultipartFile> hotelImages) {
		HotelEntity hotel = hotelRepository.findById(hotelId)
				.orElseThrow(() -> new RuntimeException("Hotel not found"));

		for (MultipartFile image : hotelImages) {
			try {
				// Lưu trữ file ảnh vào thư mục và lấy URL
				String imageUrl = saveImage(image);

				HotelImageEntity imageEntity = new HotelImageEntity();
				imageEntity.setHotel(hotel);
				imageEntity.setImageUrl(imageUrl);
				hotelImageRepository.save(imageEntity);
			} catch (IOException e) {
				throw new RuntimeException("Failed to store image", e);
			}
		}
	}

	private String saveImage(MultipartFile image) throws IOException {
		String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
		Path filePath = Paths.get("images/hotel", fileName);
		Files.createDirectories(filePath.getParent());
		Files.write(filePath, image.getBytes());
		return "/images/hotel/" + fileName;
	}


	@Override
	public HotelDTO updateHotel(long id, HotelDTO hotelDTO) {
		// Kiểm tra xem khách sạn có tồn tại trong cơ sở dữ liệu không
		Optional<HotelEntity> optionalHotel = hotelRepository.findById(id);
		if (!optionalHotel.isPresent()) {
			return null;
		}

		// Lấy hotelEntity từ Optional
		HotelEntity existingHotelEntity = optionalHotel.get();

		existingHotelEntity.setName(hotelDTO.getName());
		existingHotelEntity.setAddress(hotelDTO.getAddress());
		existingHotelEntity.setCity(hotelDTO.getCity());
		existingHotelEntity.setCountry(hotelDTO.getCountry());
		existingHotelEntity.setDescription(hotelDTO.getDescription());
		existingHotelEntity.setCheckInTime(hotelDTO.getCheckInTime());
		existingHotelEntity.setCheckOutTime(hotelDTO.getCheckOutTime());
		existingHotelEntity.setLatitude(hotelDTO.getLatitude());
		existingHotelEntity.setLongitude(hotelDTO.getLongitude());

		// Lưu existingHotelEntity vào cơ sở dữ liệu
		HotelEntity updatedHotelEntity = hotelRepository.save(existingHotelEntity);

		// Trả về DTO của khách sạn đã được cập nhật
		return modelMapper.map(updatedHotelEntity, HotelDTO.class);
	}

	@Override
	public boolean deleteHotel(long id) {
		if (hotelRepository.existsById(id)) {
			hotelRepository.delete(id);
			return true;
		}
		return false;
	}

	@Override
	public boolean deleteHotelImage(Long imageId) {
		Optional<HotelImageEntity> imageOptional = hotelImageRepository.findById(imageId);
		if (imageOptional.isPresent()) {
			hotelImageRepository.delete(imageId);
			return true;
		}
		return false;
	}

	public void updateHotelThumbnail(Long hotelId, MultipartFile thumbnail) throws IOException {
	    Optional<HotelEntity> optionalHotel = hotelRepository.findById(hotelId);
	    if (optionalHotel.isPresent()) {
	        HotelEntity hotel = optionalHotel.get();

	        if (thumbnail != null && !thumbnail.isEmpty()) {
	            // Xóa hình cũ nếu tồn tại và không phải là hình mặc định
	            if (hotel.getThumnail() != null && !hotel.getThumnail().isEmpty()) {
	                deleteImage(hotel.getThumnail());
	            }

	            // Lưu hình ảnh mới và cập nhật URL
	            String thumbnailUrl = saveImage(thumbnail);
	            hotel.setThumnail(thumbnailUrl);
	        }

	        hotelRepository.save(hotel);
	    } else {
	        throw new RuntimeException("Hotel not found");
	    }
	}

	private void deleteImage(String thumnail) throws IOException {
		Path imagePath = Paths.get(thumnail.replaceFirst("/", ""));
	    if (Files.exists(imagePath)) {
	        Files.delete(imagePath);
	    }
	}

}
