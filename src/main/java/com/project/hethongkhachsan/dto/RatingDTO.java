package com.project.hethongkhachsan.dto;

import java.math.BigDecimal;

public class RatingDTO {
	private Long id;
	private Long userId;
	private Long hotelId;
	private BigDecimal ratingScore;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public Long getHotelId() {
		return hotelId;
	}

	public void setHotelId(Long hotelId) {
		this.hotelId = hotelId;
	}

	public BigDecimal getRatingScore() {
		return ratingScore;
	}

	public void setRatingScore(BigDecimal ratingScore) {
		this.ratingScore = ratingScore;
	}

}
