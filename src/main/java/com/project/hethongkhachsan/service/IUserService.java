package com.project.hethongkhachsan.service;

import java.util.List;

import com.project.hethongkhachsan.dto.UserDTO;

public interface IUserService {

	UserDTO registerUser(UserDTO userDTO);

	UserDTO updateUser(Long userId, UserDTO userDTO);

	List<UserDTO> getUsers();

	UserDTO getUserById(Long userId);

	UserDTO getUserByEmail(String email);

	void deleteUser(Long userId);

//	String loginWithGoogle(String tokenId);
}
