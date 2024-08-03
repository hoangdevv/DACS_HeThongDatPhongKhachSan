package com.project.hethongkhachsan.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "roomsT")
public class RoomEntity extends BaseEntity {

	@ManyToOne()
	@JoinColumn(name = "hotel_id")
	private HotelEntity hotel;

	@Column
	private String name;

	@Column
	private BigDecimal pricePerNight;

	@Column
	private String description;

	@Column
	private Integer maxOccupancy;

	@Column
	private Boolean isAvailable;

	@Column
	private Integer totalQuantity;

	@Column
	private Integer availableQuantity;

	@ManyToOne()
	@JoinColumn(name = "type_id")
	private TypeEntity type;

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
	private List<BookingEntity> bookings = new ArrayList<>();

	@OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
	private List<RoomImageEntity> roomImages = new ArrayList<>();

	@ManyToMany(mappedBy = "rooms")
	private Set<AmenityEntity> amenities;

	public void updateAvailableQuantity(int quantity) {
		if (this.availableQuantity != null && this.availableQuantity >= quantity) {
			this.availableQuantity -= quantity;
		} else {
			throw new IllegalArgumentException("Not enough available rooms");
		}
	}

	public void DeleteAvailableQuantity(int change) {
		this.availableQuantity += change;
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

	public HotelEntity getHotel() {
		return hotel;
	}

	public void setHotel(HotelEntity hotel) {
		this.hotel = hotel;
	}

	public TypeEntity getType() {
		return type;
	}

	public void setType(TypeEntity type) {
		this.type = type;
	}

	public List<BookingEntity> getBookings() {
		return bookings;
	}

	public void setBookings(List<BookingEntity> bookings) {
		this.bookings = bookings;
	}

	public List<RoomImageEntity> getRoomImages() {
		return roomImages;
	}

	public void setRoomImages(List<RoomImageEntity> roomImages) {
		this.roomImages = roomImages;
	}

	public Set<AmenityEntity> getAmenities() {
		return amenities;
	}

	public void setAmenities(Set<AmenityEntity> amenities) {
		this.amenities = amenities;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAvailableQuantity() {
		return availableQuantity;
	}

	public void setAvailableQuantity(Integer availableQuantity) {
		this.availableQuantity = availableQuantity;
	}

	public Integer getTotalQuantity() {
		return totalQuantity;
	}

	public void setTotalQuantity(Integer totalQuantity) {
		this.totalQuantity = totalQuantity;
	}

}
