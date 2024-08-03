package com.project.hethongkhachsan.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.project.hethongkhachsan.entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

	Optional<UserEntity> findById(Long userId);

	boolean existsByEmail(String email);

	boolean existsById(Long userId);

	void deleteById(Long userId);

	Optional<UserEntity> findByEmail(String email);


}
