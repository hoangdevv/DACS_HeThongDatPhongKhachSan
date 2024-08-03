package com.project.hethongkhachsan.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.CommentEntity;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

	int countByHotelId(Long hotelId);

	void deleteById(Long commentId);

}
