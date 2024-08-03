package com.project.hethongkhachsan.service;

import java.util.List;

import com.project.hethongkhachsan.dto.TypeDTO;

public interface IRoomTypeService {

	List<TypeDTO> getAllRoomTypes();

	TypeDTO addRoomType(TypeDTO typeDTO);

	TypeDTO updateRoomType(Long typeId, TypeDTO typeDTO);

	void deleteRoomType(Long id);
}
