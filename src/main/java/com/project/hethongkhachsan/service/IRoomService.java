package com.project.hethongkhachsan.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.project.hethongkhachsan.dto.RoomDTO;
import com.project.hethongkhachsan.dto.RoomImageDTO;

import javassist.NotFoundException;

public interface IRoomService {
	RoomDTO getOneRoom(Long hotelId, Long roomId);

	List<RoomDTO> getAllRooms(Long hotelId);
	
	List<RoomImageDTO> getImagesByRoom(Long hotelId, Long roomId);
	
	RoomDTO addRoom(Long hotelId, RoomDTO roomDTO)throws NotFoundException;
	
	void addRoomImages(Long hotelId, Long roomId, List<MultipartFile> roomImages);

	RoomDTO updateRoom(Long hotelId, Long roomId, RoomDTO roomDTO) ;

	boolean deleteRoom(Long hotelId, Long roomId);
	
	boolean deleteRoomImage(Long imageId);


}
