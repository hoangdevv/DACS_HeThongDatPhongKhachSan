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
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.dto.AmenityDTO;
import com.project.hethongkhachsan.service.IAmenityService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/amenities")
public class AmenityController {

	@Autowired
	private IAmenityService amenityService;

	@GetMapping("/get-all-amenities")
	public ResponseEntity<List<AmenityDTO>> getAllAmenities() {
		List<AmenityDTO> amenities = amenityService.getAllAmenities();
		return ResponseEntity.ok(amenities);
	}

	@GetMapping("/get-name/room/{roomId}")
	public ResponseEntity<List<String>> getAmenitiesByRoomId(@PathVariable Long roomId) {
		List<String> amenityNames = amenityService.getNameAmenitiesByRoom(roomId);
		return new ResponseEntity<>(amenityNames, HttpStatus.OK);
	}

	@PostMapping("/add-amenities")
	public ResponseEntity<AmenityDTO> createAmenity(@RequestBody AmenityDTO amenityDTO) {
		AmenityDTO createdAmenity = amenityService.addAmenity(amenityDTO);
		return ResponseEntity.ok(createdAmenity);
	}

	@PutMapping("/update-amenities/{id}")
	public ResponseEntity<AmenityDTO> updateAmenity(@PathVariable Long id, @RequestBody AmenityDTO amenityDTO) {
		AmenityDTO updatedAmenity = amenityService.updateAmenity(id, amenityDTO);
		return ResponseEntity.ok(updatedAmenity);
	}

	@DeleteMapping("/delete-amenities/{id}")
	public ResponseEntity<Void> deleteAmenity(@PathVariable Long id) {
		amenityService.deleteAmenity(id);
		return ResponseEntity.noContent().build();
	}
}
