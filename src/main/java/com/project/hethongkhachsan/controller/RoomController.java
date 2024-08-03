package com.project.hethongkhachsan.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.project.hethongkhachsan.dto.RoomDTO;
import com.project.hethongkhachsan.dto.RoomImageDTO;
import com.project.hethongkhachsan.service.IRoomService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/rooms")
public class RoomController {

	@Autowired
	private IRoomService roomService;

	@GetMapping("/hotel/{hotelId}/get-room/{roomId}")
	public ResponseEntity<RoomDTO> getOneRoom(@PathVariable("hotelId") Long hotelId, @PathVariable("roomId") Long roomId) {
		RoomDTO roomDTO = roomService.getOneRoom(hotelId, roomId);
		return ResponseEntity.ok(roomDTO);
	}

	@GetMapping("/hotel/{hotelId}/get-all-rooms")
	public ResponseEntity<List<RoomDTO>> getAllRooms(@PathVariable("hotelId") Long hotelId) {
		List<RoomDTO> roomDTOs = roomService.getAllRooms(hotelId);
		return ResponseEntity.ok(roomDTOs);
	}

	@GetMapping("/hotel/{hotelId}/get-image-room/{roomId}")
	public ResponseEntity<List<RoomImageDTO>> getImagesByRoom(@PathVariable Long hotelId, @PathVariable Long roomId) {
		List<RoomImageDTO> roomImages = roomService.getImagesByRoom(hotelId, roomId);
		if (roomImages.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(roomImages);
	}

	@PostMapping("/hotel/{hotelId}/add-room")
	public ResponseEntity<RoomDTO> addRoom(@PathVariable Long hotelId, @RequestBody RoomDTO roomDTO) {
		try {
			RoomDTO addedRoom = roomService.addRoom(hotelId, roomDTO);
			return ResponseEntity.ok(addedRoom);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PostMapping("/hotel/{hotelId}/add-image/{roomId}")
	public ResponseEntity<Void> addRoomImages(@PathVariable Long hotelId,@PathVariable Long roomId,
			@RequestParam("roomImages") List<MultipartFile> roomImages) {
		try {
			roomService.addRoomImages(hotelId, roomId, roomImages);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PutMapping("/hotel/{hotelId}/update-room/{id}")
	public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long hotelId, @PathVariable Long id,
			@RequestBody RoomDTO roomDTO) {
		try {
			RoomDTO updatedRoom = roomService.updateRoom(hotelId, id, roomDTO);
			return ResponseEntity.ok(updatedRoom);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	@DeleteMapping("/hotel/{hotelId}/delete-room/{id}")
	public ResponseEntity<String> deleteRoom(@PathVariable("hotelId") Long hotelId, @PathVariable("id") Long id) {
		boolean isDeleted = roomService.deleteRoom(hotelId, id);
		if (isDeleted) {
			return new ResponseEntity<>("Room deleted successfully", HttpStatus.OK);
		} else {
			return new ResponseEntity<>("Room not found or unable to delete", HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/delte-image/{imageId}")
	public ResponseEntity<String> deleteRoomImage(@PathVariable Long imageId) {
		boolean isDeleted = roomService.deleteRoomImage(imageId);
		if (isDeleted) {
			return ResponseEntity.ok("Room image with ID " + imageId + " has been deleted successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body("Room image with ID " + imageId + " not found or could not be deleted.");
		}
	}

}
