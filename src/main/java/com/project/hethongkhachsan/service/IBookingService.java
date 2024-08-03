package com.project.hethongkhachsan.service;

import java.util.List;

import com.project.hethongkhachsan.dto.BookingDTO;

public interface IBookingService {

	BookingDTO getBookingById(Long bookingId);

	List<BookingDTO> getAllBookings();

	BookingDTO addBooking(BookingDTO bookingDTO);

	BookingDTO updateBooking(Long bookingId, BookingDTO bookingDTO);

	void deleteBooking(Long bookingId);
}
