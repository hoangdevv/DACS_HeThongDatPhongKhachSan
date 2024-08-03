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
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.dto.TypeDTO;
import com.project.hethongkhachsan.service.IRoomTypeService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/types")
public class TypeController {
	@Autowired
	private IRoomTypeService roomTypeService;

	@GetMapping("/list-types")
	public ResponseEntity<List<TypeDTO>> getAllRoomTypes() {
		List<TypeDTO> roomTypes = roomTypeService.getAllRoomTypes();
		return new ResponseEntity<>(roomTypes, HttpStatus.OK);
	}

	@PostMapping("/add-type")
	public ResponseEntity<TypeDTO> addRoomType(@RequestBody TypeDTO typeDTO) {
		TypeDTO createdType = roomTypeService.addRoomType(typeDTO);
		return new ResponseEntity<>(createdType, HttpStatus.CREATED);
	}

	@PutMapping("/update-type/{typeId}")
	public ResponseEntity<TypeDTO> updateRoomType(@PathVariable Long typeId, @RequestBody TypeDTO typeDTO) {
		TypeDTO updatedType = roomTypeService.updateRoomType(typeId, typeDTO);
		return new ResponseEntity<>(updatedType, HttpStatus.OK);
	}

	@DeleteMapping("/delete-type/{typeId}")
	public ResponseEntity<?> deleteRoomType(@PathVariable("typeId") Long typeId) {
	    try {
	        roomTypeService.deleteRoomType(typeId);
	        return ResponseEntity.ok().build();
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete room type");
	    }
	}
}
