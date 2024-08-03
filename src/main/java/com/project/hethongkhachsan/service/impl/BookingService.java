package com.project.hethongkhachsan.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.BookingDTO;
import com.project.hethongkhachsan.entity.BookingEntity;
import com.project.hethongkhachsan.entity.RoomEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.repository.BookingRepository;
import com.project.hethongkhachsan.repository.RoomRepository;
import com.project.hethongkhachsan.repository.UserRepository;
import com.project.hethongkhachsan.service.IBookingService;

@Service
public class BookingService implements IBookingService {

	@Autowired
	private ModelMapper modelMapper;

	@Autowired
	private RoomRepository roomRepository;

	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public BookingDTO getBookingById(Long bookingId) {
		BookingEntity booking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));
		return modelMapper.map(booking, BookingDTO.class);
	}

	@Override
	public List<BookingDTO> getAllBookings() {
		List<BookingEntity> bookings = bookingRepository.findAll();
		return bookings.stream().map(booking -> modelMapper.map(booking, BookingDTO.class))
				.collect(Collectors.toList());
	}

	@Transactional
	public BookingDTO addBooking(BookingDTO bookingDTO) {
		BookingEntity booking = modelMapper.map(bookingDTO, BookingEntity.class);

		if (bookingDTO.getUserId() != null) {
			UserEntity user = userRepository.findById(bookingDTO.getUserId())
					.orElseThrow(() -> new IllegalArgumentException("User not found"));
			booking.setUser(user);
		} else {
			booking.setCustomerName(bookingDTO.getCustomerName());
			booking.setCustomerEmail(bookingDTO.getCustomerEmail());
			booking.setCustomerPhone(bookingDTO.getCustomerPhone());
		}

		RoomEntity room = roomRepository.findById(bookingDTO.getRoomId())
				.orElseThrow(() -> new IllegalArgumentException("Room not found"));
		booking.setRoom(room);

		// Kiểm tra số lượng phòng đặt có lớn hơn số phòng còn trống không
		if (bookingDTO.getQuantity() > room.getAvailableQuantity()) {
			throw new IllegalArgumentException("Not enough available rooms");
		}
		room.updateAvailableQuantity(bookingDTO.getQuantity());
		booking.setQuantity(bookingDTO.getQuantity());

		booking.setBookingStatus(bookingDTO.getBookingStatus() != null ? bookingDTO.getBookingStatus()
				: BookingEntity.BookingStatus.PENDING);

		booking.calculateCheckOutDate();
		booking.calculateTotalPrice();
		booking.calculateTotalGuests();

		BookingEntity savedBooking = bookingRepository.save(booking);

		// Cập nhật lại room trong database sau khi số lượng availableQuantity thay đổi
		roomRepository.save(room);

		// Tạo lại DTO từ bản ghi đã lưu
		BookingDTO resultDTO = modelMapper.map(savedBooking, BookingDTO.class);
		resultDTO.setCheckOutDate(new java.sql.Date(savedBooking.getCheckOutDate().getTime()));
		resultDTO.setTotalPrice(savedBooking.getTotalPrice());
		resultDTO.setTotalGuests(savedBooking.getTotalGuests());
		resultDTO.setRoomId(savedBooking.getRoom().getId());
		resultDTO.setUserId(savedBooking.getUser() != null ? savedBooking.getUser().getId() : null);

		return resultDTO;
	}

	@Transactional
	public BookingDTO updateBooking(Long bookingId, BookingDTO bookingDTO) {
		BookingEntity existingBooking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));

		RoomEntity room = existingBooking.getRoom();
		int originalQuantity = existingBooking.getQuantity();

		existingBooking.setCustomerName(bookingDTO.getCustomerName());
		existingBooking.setCustomerEmail(bookingDTO.getCustomerEmail());
		existingBooking.setCustomerPhone(bookingDTO.getCustomerPhone());
		existingBooking.setCheckInDate(bookingDTO.getCheckInDate());
		existingBooking.setNumberOfNights(bookingDTO.getNumberOfNights());
		existingBooking.setQuantity(bookingDTO.getQuantity());
		existingBooking.setNumberOfAdults(bookingDTO.getNumberOfAdults());
		existingBooking.setNumberOfChildren(bookingDTO.getNumberOfChildren());

		int newQuantity = bookingDTO.getQuantity();
		int quantityDifference = newQuantity - originalQuantity;

		if (quantityDifference > 0) {
			if (quantityDifference > room.getAvailableQuantity()) {
				throw new IllegalArgumentException("Not enough available rooms");
			}
			room.setAvailableQuantity(room.getAvailableQuantity() - quantityDifference);
		} else {
			room.setAvailableQuantity(room.getAvailableQuantity() - quantityDifference);
		}

		existingBooking.calculateCheckOutDate();
		existingBooking.calculateTotalPrice();
		existingBooking.calculateTotalGuests();

		BookingEntity updatedBooking = bookingRepository.save(existingBooking);

		roomRepository.save(room);

		BookingDTO resultDTO = modelMapper.map(updatedBooking, BookingDTO.class);
		resultDTO.setRoomId(updatedBooking.getRoom().getId()); // Đảm bảo roomId được thiết lập
		resultDTO.setUserId(updatedBooking.getUser() != null ? updatedBooking.getUser().getId() : null);
		return resultDTO;
	}

	@Transactional
	public void deleteBooking(Long bookingId) {
		BookingEntity existingBooking = bookingRepository.findById(bookingId)
				.orElseThrow(() -> new IllegalArgumentException("Booking not found"));

		RoomEntity room = existingBooking.getRoom();
		int quantity = existingBooking.getQuantity();

		// Update the available quantity of the room
		room.DeleteAvailableQuantity(quantity);

		// Delete the booking
		bookingRepository.delete(existingBooking);

		// Save the room with updated available quantity
		roomRepository.save(room);
	}

}
