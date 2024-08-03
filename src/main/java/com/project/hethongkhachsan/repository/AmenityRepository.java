package com.project.hethongkhachsan.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.AmenityEntity;

@Repository
public interface AmenityRepository extends JpaRepository<AmenityEntity, Long> {

	Optional<AmenityEntity> findById(Long id);

	Optional<AmenityEntity> findByName(String name);
	
}