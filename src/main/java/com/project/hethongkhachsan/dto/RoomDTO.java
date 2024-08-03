package com.project.hethongkhachsan.dto;

import java.math.BigDecimal;
import java.util.List;

public class RoomDTO {
	private Long id;
	private String name;
	private BigDecimal pricePerNight;
	private String description;
	private Integer maxOccupancy;
	private Boolean isAvailable;
	private Integer totalQuantity;
	private Integer availableQuantity;
	private TypeDTO type;
	private List<RoomImageDTO> roomImages;
	private List<AmenityDTO> amenities;
	
	
	public void setAvailableQuantity(Integer availableQuantity) {
		this.availableQuantity = availableQuantity;
	}
	public Integer getAvailableQuantity() {
		return availableQuantity;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public BigDecimal getPricePerNight() {
		return pricePerNight;
	}
	public void setPricePerNight(BigDecimal pricePerNight) {
		this.pricePerNight = pricePerNight;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Integer getMaxOccupancy() {
		return maxOccupancy;
	}
	public void setMaxOccupancy(Integer maxOccupancy) {
		this.maxOccupancy = maxOccupancy;
	}
	public Boolean getIsAvailable() {
		return isAvailable;
	}
	public void setIsAvailable(Boolean isAvailable) {
		this.isAvailable = isAvailable;
	}

	public TypeDTO getType() {
		return type;
	}
	public void setType(TypeDTO type) {
		this.type = type;
	}
	
	public List<RoomImageDTO> getRoomImages() {
		return roomImages;
	}
	public void setRoomImages(List<RoomImageDTO> roomImages) {
		this.roomImages = roomImages;
	}
	public List<AmenityDTO> getAmenities() {
		return amenities;
	}
	public void setAmenities(List<AmenityDTO> amenities) {
		this.amenities = amenities;
	}
	public Integer getTotalQuantity() {
		return totalQuantity;
	}
	public void setTotalQuantity(Integer totalQuantity) {
		this.totalQuantity = totalQuantity;
	}
	
	
}
