package com.project.hethongkhachsan.service.impl;

import javax.persistence.EntityNotFoundException;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.CommentDTO;
import com.project.hethongkhachsan.entity.CommentEntity;
import com.project.hethongkhachsan.entity.HotelEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.repository.CommentRepository;
import com.project.hethongkhachsan.repository.HotelRepository;
import com.project.hethongkhachsan.repository.UserRepository;
import com.project.hethongkhachsan.service.ICommentService;

@Service
public class CommentService implements ICommentService {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private HotelRepository hotelRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	private CommentDTO convertToDTO(CommentEntity commentEntity) {
		return modelMapper.map(commentEntity, CommentDTO.class);
	}

	private CommentEntity convertToEntity(CommentDTO commentDTO) {
		return modelMapper.map(commentDTO, CommentEntity.class);
	}

	@Override
	public CommentDTO addComment(CommentDTO commentDTO) {
		CommentEntity commentEntity = convertToEntity(commentDTO);

		// Retrieve hotel and user entities
		HotelEntity hotelEntity = hotelRepository.findById(commentDTO.getHotelId())
				.orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + commentDTO.getHotelId()));
		UserEntity userEntity = userRepository.findById(commentDTO.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + commentDTO.getUserId()));

		// Set relationships
		commentEntity.setHotel(hotelEntity);
		commentEntity.setUser(userEntity);

		// Save comment entity
		CommentEntity savedCommentEntity = commentRepository.save(commentEntity);

		return convertToDTO(savedCommentEntity);
	}

	@Override
	public int countCommentsByHotel(Long hotelId) {
		return commentRepository.countByHotelId(hotelId);
	}

	@Override
	public void deleteComment(Long commentId) {
		 commentRepository.deleteById(commentId);
	}

}
