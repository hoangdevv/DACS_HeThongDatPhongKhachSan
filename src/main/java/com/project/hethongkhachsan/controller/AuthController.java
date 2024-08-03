package com.project.hethongkhachsan.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.dto.UserDTO;
import com.project.hethongkhachsan.exception.UserAlreadyExistsException;
import com.project.hethongkhachsan.request.LoginRequest;
import com.project.hethongkhachsan.security.jwt.JwtUtils;
import com.project.hethongkhachsan.security.user.HotelUserDetails;
import com.project.hethongkhachsan.service.IUserService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/auths")
public class AuthController {
	
	@Autowired
	private AuthenticationManager authenticationManager;
	@Autowired
	private IUserService userService;
	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/register-user")
	public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
		try {
			UserDTO registeredUser = userService.registerUser(userDTO);
			return ResponseEntity.ok(registeredUser);
		} catch (UserAlreadyExistsException e) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}
	
	@PostMapping("/login-user")
	 public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest request){
        Authentication authentication =
                authenticationManager
                        .authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtTokenForUser(authentication);
        HotelUserDetails userDetails = (HotelUserDetails) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return ResponseEntity.ok(new UserDTO(
                userDetails.getId(),
                userDetails.getEmail(),
                jwt,
                roles));
    }
}
