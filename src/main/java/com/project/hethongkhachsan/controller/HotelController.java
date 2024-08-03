package com.project.hethongkhachsan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.hethongkhachsan.dto.HotelDTO;
import com.project.hethongkhachsan.dto.HotelImageDTO;
import com.project.hethongkhachsan.service.IHotelService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/hotels")
public class HotelController {

	@Autowired
	private IHotelService hotelService;

	@GetMapping("/get-hotel/{id}")
	public ResponseEntity<HotelDTO> getOneHotel(@PathVariable Long id) {
		HotelDTO hotelDTO = hotelService.getOneHotel(id);
		if (hotelDTO != null) {
			return ResponseEntity.ok(hotelDTO);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@GetMapping("/list-hotel")
	public ResponseEntity<List<HotelDTO>> getAllHotels() {
		List<HotelDTO> hotels = hotelService.getAllHotels();
		return ResponseEntity.ok(hotels);
	}

	@GetMapping("/get-image/{hotelId}")
	public ResponseEntity<?> getImagesByHotel(@PathVariable Long hotelId) {
		List<HotelImageDTO> images = hotelService.getImagesByHotel(hotelId);
		return ResponseEntity.ok(images);
	}

	@PostMapping("/add-hotel")
	public ResponseEntity<HotelDTO> addHotel(@RequestBody HotelDTO hotelDTO) {
		try {
			HotelDTO savedHotel = hotelService.addHotel(hotelDTO);
			return ResponseEntity.ok(savedHotel);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@PutMapping("/update-thumbnail/{hotelId}")
	public ResponseEntity<String> updateHotelThumbnail(@PathVariable Long hotelId,
			@RequestParam("thumbnail") MultipartFile thumbnail) {
		try {
			hotelService.updateHotelThumbnail(hotelId, thumbnail);
			return ResponseEntity.ok("Thumbnail updated successfully.");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Failed to update thumbnail: " + e.getMessage());
		}
	}

	@PostMapping("/add-images/{hotelId}")
	public ResponseEntity<Void> addHotelImages(@PathVariable Long hotelId,
			@RequestParam("hotelImages") List<MultipartFile> hotelImages) {
		try {
			hotelService.addHotelImages(hotelId, hotelImages);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PutMapping("/update-hotel/{id}")
	public ResponseEntity<HotelDTO> updateHotel(@PathVariable Long id, @RequestBody HotelDTO hotelDTO) {
		HotelDTO updatedHotel = hotelService.updateHotel(id, hotelDTO);
		if (updatedHotel != null) {
			return ResponseEntity.ok(updatedHotel);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@DeleteMapping("/delete-hotel/{id}")
	public ResponseEntity<String> deleteHotel(@PathVariable Long id) {
		boolean deleted = hotelService.deleteHotel(id);
		if (deleted) {
			return ResponseEntity.ok("Khách sạn đã được xóa thành công.");
		} else {
			return ResponseEntity.ok("Không tìm thấy khách sạn để xóa.");
		}
	}

	@DeleteMapping("/delete-image/{imageId}")
	public ResponseEntity<String> deleteHotelImage(@PathVariable Long imageId) {
		boolean deleted = hotelService.deleteHotelImage(imageId);
		if (deleted) {
			return ResponseEntity.ok("Hotel image with ID " + imageId + " has been deleted successfully.");
		} else {
			return ResponseEntity.notFound().build();
		}
	}
}