package com.project.hethongkhachsan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.BookingEntity;
@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

	Optional<BookingEntity> findById(Long bookingId);
    
}