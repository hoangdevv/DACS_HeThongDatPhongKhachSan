package com.project.hethongkhachsan.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "hotel_imagesT")
public class HotelImageEntity extends BaseEntity{
	
	@ManyToOne()
	@JoinColumn(name = "hotel_id")
	private HotelEntity hotel;

    @Column
    private String imageUrl;


	public HotelEntity getHotel() {
		return hotel;
	}

	public void setHotel(HotelEntity hotel) {
		this.hotel = hotel;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
    
	
    
}
