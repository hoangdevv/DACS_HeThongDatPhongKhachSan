package com.project.hethongkhachsan.service.impl;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.hethongkhachsan.dto.UserDTO;
import com.project.hethongkhachsan.entity.RoleEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.exception.UserAlreadyExistsException;
import com.project.hethongkhachsan.repository.RoleRepository;
import com.project.hethongkhachsan.repository.UserRepository;
import com.project.hethongkhachsan.service.IUserService;

@Service
public class UserService implements IUserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private ModelMapper modelMapper;

	@Override
	public UserDTO registerUser(UserDTO userDTO) {
		if (userRepository.existsByEmail(userDTO.getEmail())) {
			throw new UserAlreadyExistsException(userDTO.getEmail() + " already exists");
		}

		UserEntity user = new UserEntity();
		user.setEmail(userDTO.getEmail());
		user.setPhone(userDTO.getPhone());
		user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

		if (userDTO.getFullName() != null) {
			user.setFullName(userDTO.getFullName());
		}
		if (userDTO.getAddress() != null) {
			user.setAddress(userDTO.getAddress());
		}
		if (userDTO.getGender() != null) {
			user.setGender(userDTO.getGender());
		}
		if (userDTO.getBirthDate() != null) {
			user.setBirthDate(userDTO.getBirthDate());
		}

		RoleEntity userRole = roleRepository.findByName("ROLE_USER")
				.orElseThrow(() -> new RuntimeException("Role not found"));
		user.setRoles(Collections.singletonList(userRole));

		UserEntity savedUser = userRepository.save(user);
		return modelMapper.map(savedUser, UserDTO.class);
	}

	@Override
	public UserDTO updateUser(Long userId, UserDTO userDTO) {
		UserEntity user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		user.setEmail(userDTO.getEmail());
		user.setPhone(userDTO.getPhone());
		user.setFullName(userDTO.getFullName());
		user.setAddress(userDTO.getAddress());
		user.setGender(userDTO.getGender());
		user.setBirthDate(userDTO.getBirthDate());

		UserEntity updatedUser = userRepository.save(user);

		return modelMapper.map(updatedUser, UserDTO.class);
	}

	@Override
	public List<UserDTO> getUsers() {
		List<UserEntity> users = userRepository.findAll();
		return users.stream().map(user -> modelMapper.map(user, UserDTO.class)).collect(Collectors.toList());
	}

	@Override
	public UserDTO getUserById(Long userId) {
		UserEntity user = userRepository.findById(userId)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return modelMapper.map(user, UserDTO.class);
	}

	@Transactional
	@Override
	public void deleteUser(Long userId) {
		if (!userRepository.existsById(userId)) {
			throw new UsernameNotFoundException("User not found");
		}
		userRepository.deleteById(userId);
	}

	@Override
	public UserDTO getUserByEmail(String email) {
		UserEntity userEntity = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return modelMapper.map(userEntity, UserDTO.class);
	}

}
