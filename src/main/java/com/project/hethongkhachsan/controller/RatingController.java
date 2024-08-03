package com.project.hethongkhachsan.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.dto.RatingDTO;
import com.project.hethongkhachsan.service.IRatingService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/ratings")
public class RatingController {

	@Autowired
	private IRatingService ratingService;

	@GetMapping("/get-rating/{id}")
	public ResponseEntity<RatingDTO> getRatingById(@PathVariable("id") Long id) {
		RatingDTO ratingDTO = ratingService.getRatingById(id);
		return ResponseEntity.ok(ratingDTO);
	}

	@GetMapping("/get-rating-by-hotel/{hotelId}")
	public ResponseEntity<List<RatingDTO>> getRatingsByHotel(@PathVariable("hotelId") Long hotelId) {
		List<RatingDTO> ratingDTOs = ratingService.getRatingsByHotel(hotelId);
		return ResponseEntity.ok(ratingDTOs);
	}

	@PostMapping("/add-rating")
	public ResponseEntity<RatingDTO> addOrUpdateRating(@RequestBody RatingDTO ratingDTO) {
		RatingDTO savedRatingDTO = ratingService.addOrUpdateRating(ratingDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedRatingDTO);
	}

	@DeleteMapping("/delete-rating/{id}")
	public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
		ratingService.deleteRating(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/average-rating/{hotelId}")
	public ResponseEntity<BigDecimal> getAverageRatingByHotel(@PathVariable("hotelId") Long hotelId) {
		BigDecimal averageRating = ratingService.getAverageRatingByHotel(hotelId);
		return ResponseEntity.ok(averageRating);
	}
}
