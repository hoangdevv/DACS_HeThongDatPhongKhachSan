package com.project.hethongkhachsan.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.RatingDTO;
import com.project.hethongkhachsan.entity.HotelEntity;
import com.project.hethongkhachsan.entity.RatingEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.repository.HotelRepository;
import com.project.hethongkhachsan.repository.RatingRepository;
import com.project.hethongkhachsan.repository.UserRepository;
import com.project.hethongkhachsan.service.IRatingService;

@Service
public class RatingService implements IRatingService {

	@Autowired
	private RatingRepository ratingRepository;

	@Autowired
	private HotelRepository hotelRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ModelMapper modelMapper;

	private RatingDTO convertToDTO(RatingEntity ratingEntity) {
		return modelMapper.map(ratingEntity, RatingDTO.class);
	}

	private RatingEntity convertToEntity(RatingDTO ratingDTO) {
		return modelMapper.map(ratingDTO, RatingEntity.class);
	}

	@Override
	public RatingDTO getRatingById(Long id) {
		RatingEntity ratingEntity = ratingRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Rating not found with id: " + id));
		return convertToDTO(ratingEntity);
	}

	@Override
	public List<RatingDTO> getRatingsByHotel(Long hotelId) {
		List<RatingEntity> ratingEntities = ratingRepository.findByHotelId(hotelId);
		return ratingEntities.stream().map(this::convertToDTO).collect(Collectors.toList());
	}

	@Override
	public boolean deleteRating(Long id) {
		RatingEntity ratingEntity = ratingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rating not found with id: " + id));

        ratingRepository.delete(ratingEntity);
        return true;
	}

	@Transactional
	@Override
	public RatingDTO addOrUpdateRating(RatingDTO ratingDTO) {
		// Check if user has already rated this hotel
		RatingEntity existingRating = ratingRepository.findByUserIdAndHotelId(ratingDTO.getUserId(),
				ratingDTO.getHotelId());
		if (existingRating != null) {
			// Update existing rating
			existingRating.setRatingScore(ratingDTO.getRatingScore());
			RatingEntity updatedRatingEntity = ratingRepository.save(existingRating);
			return convertToDTO(updatedRatingEntity);
		}

		// Otherwise, add new rating
		RatingEntity ratingEntity = convertToEntity(ratingDTO);
		UserEntity userEntity = userRepository.findById(ratingDTO.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("User not found with id: " + ratingDTO.getUserId()));
		ratingEntity.setUser(userEntity);

		HotelEntity hotelEntity = hotelRepository.findById(ratingDTO.getHotelId())
				.orElseThrow(() -> new EntityNotFoundException("Hotel not found with id: " + ratingDTO.getHotelId()));
		ratingEntity.setHotel(hotelEntity);

		RatingEntity savedRatingEntity = ratingRepository.save(ratingEntity);
		return convertToDTO(savedRatingEntity);
	}

	@Override
	public BigDecimal getAverageRatingByHotel(Long hotelId) {
		BigDecimal averageRating = ratingRepository.calculateAverageRatingByHotel(hotelId);
        if (averageRating == null) {
            return BigDecimal.ZERO; // Or handle appropriately for your application
        }
        return averageRating;
	}

}
