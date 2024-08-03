package com.project.hethongkhachsan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.HotelEntity;
@Repository
public interface HotelRepository extends JpaRepository<HotelEntity, Long> {
	Optional<HotelEntity> findById(Long id);
	
	boolean existsById(Long id);

}