package com.project.hethongkhachsan.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.project.hethongkhachsan.dto.HotelDTO;
import com.project.hethongkhachsan.dto.HotelImageDTO;

public interface IHotelService {

	HotelDTO getOneHotel(Long hotelId);

	List<HotelDTO> getAllHotels();

	HotelDTO addHotel(HotelDTO hotelDTO);

	HotelDTO updateHotel(long hotelId, HotelDTO hotelDTO);

	boolean deleteHotel(long hotelId);

	void updateHotelThumbnail(Long hotelId, MultipartFile thumbnail)  throws IOException;

	List<HotelImageDTO> getImagesByHotel(Long id);

	void addHotelImages(Long hotelId, List<MultipartFile> hotelImages);

	boolean deleteHotelImage(Long imageId);
}
