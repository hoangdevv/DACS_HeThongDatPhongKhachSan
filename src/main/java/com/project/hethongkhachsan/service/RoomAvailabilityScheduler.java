package com.project.hethongkhachsan.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.entity.BookingEntity;
import com.project.hethongkhachsan.entity.RoomEntity;
import com.project.hethongkhachsan.repository.BookingRepository;
import com.project.hethongkhachsan.repository.RoomRepository;

@Service
public class RoomAvailabilityScheduler {
	@Autowired
	private BookingRepository bookingRepository;

	@Autowired
	private RoomRepository roomRepository;

	@Scheduled(cron = "0 0 0 * * ?") // Chạy mỗi ngày vào nửa đêm
	public void updateRoomAvailability() {
		Date currentDate = new Date();
		List<BookingEntity> bookings = bookingRepository.findAll();

		for (BookingEntity booking : bookings) {
			if (booking.getCheckOutDate().before(currentDate) || booking.getCheckOutDate().equals(currentDate)) {
				RoomEntity room = booking.getRoom();
				room.setAvailableQuantity(room.getAvailableQuantity() + booking.getQuantity());
				roomRepository.save(room);
			}
		}
	}
}
