package com.project.hethongkhachsan.service;

import java.util.List;

import com.project.hethongkhachsan.dto.AmenityDTO;

public interface IAmenityService {

	List<AmenityDTO> getAllAmenities();

	AmenityDTO addAmenity(AmenityDTO amenityDTO);

	AmenityDTO updateAmenity(Long amenityId, AmenityDTO amenityDTO);

	void deleteAmenity(Long amenityId);
	
	List<String> getNameAmenitiesByRoom(Long roomId);
}
