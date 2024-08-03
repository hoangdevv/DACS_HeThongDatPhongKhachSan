package com.project.hethongkhachsan.dto;

import java.math.BigDecimal;
import java.sql.Date;

import com.project.hethongkhachsan.entity.BookingEntity.BookingStatus;

public class BookingDTO {
	private Long userId;
	private Long roomId;
	private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String note;
	private Date checkInDate;
	private Integer numberOfNights;
	private Date checkOutDate;
	private Integer quantity;
	private BigDecimal totalPrice;
	private BookingStatus bookingStatus;
	private Integer numberOfAdults;
	private Integer numberOfChildren;
	private Integer totalGuests;
	
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Long getRoomId() {
		return roomId;
	}
	public void setRoomId(Long roomId) {
		this.roomId = roomId;
	}
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public String getCustomerEmail() {
		return customerEmail;
	}
	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
	}
	public String getCustomerPhone() {
		return customerPhone;
	}
	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}
	
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	public Date getCheckInDate() {
		return checkInDate;
	}
	public void setCheckInDate(Date checkInDate) {
		this.checkInDate = checkInDate;
	}
	public Integer getNumberOfNights() {
		return numberOfNights;
	}
	public void setNumberOfNights(Integer numberOfNights) {
		this.numberOfNights = numberOfNights;
	}
	
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public Integer getNumberOfAdults() {
		return numberOfAdults;
	}
	public void setNumberOfAdults(Integer numberOfAdults) {
		this.numberOfAdults = numberOfAdults;
	}
	public Integer getNumberOfChildren() {
		return numberOfChildren;
	}
	public void setNumberOfChildren(Integer numberOfChildren) {
		this.numberOfChildren = numberOfChildren;
	}
	public BookingStatus getBookingStatus() {
		return bookingStatus;
	}
	public void setBookingStatus(BookingStatus bookingStatus) {
		this.bookingStatus = bookingStatus;
	}
	public Date getCheckOutDate() {
		return checkOutDate;
	}
	public BigDecimal getTotalPrice() {
		return totalPrice;
	}
	public Integer getTotalGuests() {
		return totalGuests;
	}
	public void setCheckOutDate(Date checkOutDate) {
		this.checkOutDate = checkOutDate;
	}
	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}
	public void setTotalGuests(Integer totalGuests) {
		this.totalGuests = totalGuests;
	}
	
}
