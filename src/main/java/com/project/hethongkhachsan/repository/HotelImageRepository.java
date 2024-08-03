package com.project.hethongkhachsan.repository;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.HotelImageEntity;

@Repository
public interface HotelImageRepository extends JpaRepository<HotelImageEntity, Long> {
	
	Optional<HotelImageEntity> findById(Long imageId);
	
	@Transactional
    @Modifying
    @Query("DELETE FROM HotelImageEntity i WHERE i IN ?1")
	void deleteAllInBatch(List<HotelImageEntity> hotelImages);

}