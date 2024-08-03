package com.project.hethongkhachsan.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.TypeDTO;
import com.project.hethongkhachsan.entity.TypeEntity;
import com.project.hethongkhachsan.repository.TypeRepository;
import com.project.hethongkhachsan.service.IRoomTypeService;

@Service
public class RoomTypeService implements IRoomTypeService {

	@Autowired
	private TypeRepository roomTypeRepository;
	@Autowired
	private ModelMapper modelMapper;

	@Override
	public List<TypeDTO> getAllRoomTypes() {
		return roomTypeRepository.findAll().stream().map(roomType -> modelMapper.map(roomType, TypeDTO.class))
				.collect(Collectors.toList());
	}

//	private TypeDTO convertToDTO(TypeEntity roomType) {
//		return modelMapper.map(roomType, TypeDTO.class);
//	}
	@Override
	public TypeDTO addRoomType(TypeDTO typeDTO) {
		TypeEntity typeEntity = modelMapper.map(typeDTO, TypeEntity.class);
		TypeEntity savedType = roomTypeRepository.save(typeEntity);
		return modelMapper.map(savedType, TypeDTO.class);
	}

	@Override
	public TypeDTO updateRoomType(Long typeId, TypeDTO typeDTO) {
		TypeEntity existingType = roomTypeRepository.findById(typeId)
				.orElseThrow(() -> new IllegalArgumentException("Room type not found"));

		existingType.setName(typeDTO.getName());
		existingType.setDescription(typeDTO.getDescription());

		TypeEntity updatedType = roomTypeRepository.save(existingType);
		return modelMapper.map(updatedType, TypeDTO.class);
	}

	@Transactional
	public void deleteRoomType(Long id) {
		TypeEntity type = roomTypeRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Room type not found with id: " + id));
		roomTypeRepository.delete(type);
	}

}
