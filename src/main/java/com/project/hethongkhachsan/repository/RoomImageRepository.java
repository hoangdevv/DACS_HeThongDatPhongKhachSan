package com.project.hethongkhachsan.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.RoomImageEntity;
@Repository
public interface RoomImageRepository extends JpaRepository<RoomImageEntity, Long> {

	List<RoomImageEntity> findByRoomId(Long roomId);

	Optional<RoomImageEntity> findById(Long imageId);


    
}