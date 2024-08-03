	package com.project.hethongkhachsan.entity;
	
	import java.math.BigDecimal;
	import java.util.ArrayList;
	import java.util.Calendar;
	import java.util.Date;
	import java.util.List;
	
	import javax.persistence.CascadeType;
	import javax.persistence.Column;
	import javax.persistence.Entity;
	import javax.persistence.EnumType;
	import javax.persistence.Enumerated;
	import javax.persistence.JoinColumn;
	import javax.persistence.ManyToOne;
	import javax.persistence.OneToMany;
	import javax.persistence.Table;
	
	@Entity
	@Table(name = "bookingsT")
	public class BookingEntity extends BaseEntity {
	
		@ManyToOne()
		@JoinColumn(name = "user_id", nullable = true)
		private UserEntity user;
	
		@ManyToOne()
		@JoinColumn(name = "room_id")
		private RoomEntity room;
	
		@OneToMany(mappedBy = "booking", cascade = CascadeType.ALL)
		private List<PaymentEntity> payments = new ArrayList<>();
	
		@Column
		private String customerName;
	
		@Column
		private String customerEmail;
	
		@Column
		private String customerPhone;
	
		@Column
		private String note;
	
		@Column
		private Date checkInDate;
	
		@Column
		private Integer numberOfNights;
	
		@Column
		private Date checkOutDate;
	
		@Column
		private Integer quantity;
	
		@Column
		private BigDecimal totalPrice;
	
		@Enumerated(EnumType.STRING)
		@Column
		private BookingStatus bookingStatus;
	
		@Column
		private Integer numberOfAdults;
	
		@Column
		private Integer numberOfChildren;
	
		@Column
		private Integer totalGuests;
	
		public void calculateTotalGuests() {
			if (numberOfAdults != null && numberOfChildren != null) {
				totalGuests = numberOfAdults + numberOfChildren;
			} else {
				totalGuests = null;
			}
		}
	
		public void calculateCheckOutDate() {
			if (checkInDate != null && numberOfNights != null && numberOfNights > 0) {
				Calendar calendar = Calendar.getInstance();
				calendar.setTime(checkInDate);
				calendar.add(Calendar.DAY_OF_MONTH, numberOfNights);
				this.checkOutDate = calendar.getTime();
			}
		}
	
		public void calculateTotalPrice() {
			if (room != null && room.getPricePerNight() != null && quantity != null) {
				this.totalPrice = room.getPricePerNight().multiply(new BigDecimal(quantity));
			} else {
				this.totalPrice = null; // or some default value
			}
		}
	
		public enum BookingStatus {
			PENDING, // Đang chờ xử lý
			CONFIRMED, // Đã xác nhận
			PAID, // Đã thanh toán
			CANCELLED // Đã hủy
		}
	
		public BigDecimal getTotalPrice() {
			return totalPrice;
		}
	
		public void setTotalPrice(BigDecimal totalPrice) {
			this.totalPrice = totalPrice;
		}
	
		public Date getCheckInDate() {
			return checkInDate;
		}
	
		public void setCheckInDate(Date checkInDate) {
			this.checkInDate = checkInDate;
		}
	
		public Date getCheckOutDate() {
			return checkOutDate;
		}
	
		public void setCheckOutDate(Date checkOutDate) {
			this.checkOutDate = checkOutDate;
		}
	
		public UserEntity getUser() {
			return user;
		}
	
		public void setUser(UserEntity user) {
			this.user = user;
		}
	
		public RoomEntity getRoom() {
			return room;
		}
	
		public void setRoom(RoomEntity room) {
			this.room = room;
		}
	
		public List<PaymentEntity> getPayments() {
			return payments;
		}
	
		public void setPayments(List<PaymentEntity> payments) {
			this.payments = payments;
		}
	
		public void setNumberOfAdults(Integer numberOfAdults) {
			this.numberOfAdults = numberOfAdults;
			calculateTotalGuests();
		}
	
		public Integer getNumberOfAdults() {
			return numberOfAdults;
		}
	
		public void setNumberOfChildren(Integer numberOfChildren) {
			this.numberOfChildren = numberOfChildren;
			calculateTotalGuests();
		}
	
		public Integer getNumberOfChildren() {
			return numberOfChildren;
		}
	
		public Integer getNumberOfNights() {
			return numberOfNights;
		}
	
		public void setNumberOfNights(Integer numberOfNights) {
			this.numberOfNights = numberOfNights;
			calculateCheckOutDate();
		}
	
		public Integer getTotalGuests() {
			return totalGuests;
		}
	
		public void setTotalGuests(Integer totalGuests) {
			this.totalGuests = totalGuests;
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
	
		public BookingStatus getBookingStatus() {
			return bookingStatus;
		}
	
		public void setBookingStatus(BookingStatus bookingStatus) {
			this.bookingStatus = bookingStatus;
		}
	
		public String getNote() {
			return note;
		}
	
		public void setNote(String note) {
			this.note = note;
		}
	
		public Integer getQuantity() {
			return quantity;
		}
	
		public void setQuantity(Integer quantity) {
			this.quantity = quantity;
			calculateTotalPrice();
		}
	
	
	}
