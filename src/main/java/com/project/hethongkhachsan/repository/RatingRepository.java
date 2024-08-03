package com.project.hethongkhachsan.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.RatingEntity;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {

	Optional<RatingEntity> findById(Long id);

	void deleteById(Long id);

	List<RatingEntity> findByHotelId(Long hotelId);

	RatingEntity findByUserIdAndHotelId(Long userId, Long hotelId);
	
	@Query("SELECT AVG(r.ratingScore) FROM RatingEntity r WHERE r.hotel.id = :hotelId")
	BigDecimal calculateAverageRatingByHotel(Long hotelId);
}
