package com.project.hethongkhachsan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.TypeEntity;
@Repository
public interface TypeRepository extends JpaRepository<TypeEntity, Long>{

	Optional<TypeEntity> findById(Long id);


}
