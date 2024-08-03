package com.project.hethongkhachsan.dto;

public class HotelImageDTO {
	private Long id;
	private String imageUrl;
	private Long hotelId;
	 // Constructor không có tham số và là public
    public HotelImageDTO() {
    }

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

}