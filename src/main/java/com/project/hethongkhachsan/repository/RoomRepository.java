package com.project.hethongkhachsan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.RoomEntity;
import com.project.hethongkhachsan.entity.TypeEntity;

@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, Long> {

	Optional<RoomEntity> findByIdAndHotelId(Long id, Long homeId);

	Optional<RoomEntity> findById(Long id);

	List<RoomEntity> findByHotelId(Long homeId);

	List<RoomEntity> findByType(TypeEntity typeEntity);

	
}