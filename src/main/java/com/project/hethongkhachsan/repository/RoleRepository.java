package com.project.hethongkhachsan.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.hethongkhachsan.entity.RoleEntity;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {

	boolean existsByName(String roleName);

	Optional<RoleEntity> findByName(String role);

	Optional<RoleEntity> findById(Long roleId);

	void deleteById(Long roleId);
}
