package com.project.hethongkhachsan.service;

import java.math.BigDecimal;
import java.util.List;

import com.project.hethongkhachsan.dto.RatingDTO;

public interface IRatingService {
	
	RatingDTO getRatingById(Long id);

    List<RatingDTO> getRatingsByHotel(Long hotelId);

    RatingDTO addOrUpdateRating(RatingDTO ratingDTO);
    
    BigDecimal getAverageRatingByHotel(Long hotelId);

    boolean deleteRating(Long id);
}
