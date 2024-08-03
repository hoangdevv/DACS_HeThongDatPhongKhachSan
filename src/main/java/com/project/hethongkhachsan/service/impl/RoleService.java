package com.project.hethongkhachsan.service.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.entity.RoleEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.exception.RoleAlreadyExistException;
import com.project.hethongkhachsan.exception.UserAlreadyExistsException;
import com.project.hethongkhachsan.repository.RoleRepository;
import com.project.hethongkhachsan.repository.UserRepository;
import com.project.hethongkhachsan.service.IRoleService;

@Service
public class RoleService implements IRoleService {

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public List<RoleEntity> getRoles() {
		return roleRepository.findAll();
	}

	@Override
	public RoleEntity createRole(RoleEntity roleEntity) {
		String roleName = "ROLE_" + roleEntity.getName().toUpperCase();
		RoleEntity role = new RoleEntity(roleName);
		if (roleRepository.existsByName(roleName)) {
			throw new RoleAlreadyExistException(roleEntity.getName() + " role already exists");
		}
		return roleRepository.save(role);
	}

	@Transactional
	@Override
	public void deleteRole(Long roleId) {
		this.removeAllUsersFromRole(roleId);
		roleRepository.deleteById(roleId);
	}

	@Override
	public RoleEntity findByName(String name) {
		return roleRepository.findByName(name).get();
	}

	@Override
	public UserEntity removeUserFromRole(Long userId, Long roleId) {
		Optional<UserEntity> user = userRepository.findById(userId);
		Optional<RoleEntity> role = roleRepository.findById(roleId);
		if (role.isPresent() && role.get().getUsers().contains(user.get())) {
			role.get().removeUserFromRole(user.get());
			roleRepository.save(role.get());
			return user.get();
		}
		throw new UsernameNotFoundException("User not found");
	}
	
	@Transactional
	@Override
	public UserEntity assignRoleToUser(Long userId, Long roleId) {
		Optional<UserEntity> user = userRepository.findById(userId);
		Optional<RoleEntity> role = roleRepository.findById(roleId);
		if (user.isPresent() && user.get().getRoles().contains(role.get())) {
			throw new UserAlreadyExistsException(
					user.get().getFullName() + " is already assigned to the" + role.get().getName() + " role");
		}
		if (role.isPresent()) {
			role.get().assignRoleToUser(user.get());
			roleRepository.save(role.get());
		}
		return user.get();
	}

	@Override
	public RoleEntity removeAllUsersFromRole(Long roleId) {
		Optional<RoleEntity> role = roleRepository.findById(roleId);
		role.ifPresent(RoleEntity::removeAllUsersFromRole);
		return roleRepository.save(role.get());
	}

}
