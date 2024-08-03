package com.project.hethongkhachsan.controller;

import static org.springframework.http.HttpStatus.FOUND;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.entity.RoleEntity;
import com.project.hethongkhachsan.entity.UserEntity;
import com.project.hethongkhachsan.exception.RoleAlreadyExistException;
import com.project.hethongkhachsan.service.IRoleService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/roles")
public class RoleController {

	@Autowired
	private IRoleService roleService;

	@GetMapping("/get-all-roles")	
	public ResponseEntity<List<RoleEntity>> getAllRoles() {
		return new ResponseEntity<>(roleService.getRoles(), FOUND);
	}

	@PostMapping("/add-role")
	public ResponseEntity<String> createRole(@RequestBody RoleEntity roleEntity) {
		try {
			roleService.createRole(roleEntity);
			return ResponseEntity.ok("New role created successfully!");
		} catch (RoleAlreadyExistException re) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body(re.getMessage());

		}
	}

	@DeleteMapping("/delete/{roleId}")
	public void deleteRole(@PathVariable("roleId") Long roleId) {
		roleService.deleteRole(roleId);
	}

	@PostMapping("/remove-all-users-from-role/{roleId}")
	public RoleEntity removeAllUsersFromRole(@PathVariable("roleId") Long roleId) {
		return roleService.removeAllUsersFromRole(roleId);
	}

	@PostMapping("/remove-user-from-role")
	public UserEntity removeUserFromRole(@RequestParam("userId") Long userId, @RequestParam("roleId") Long roleId) {
		return roleService.removeUserFromRole(userId, roleId);
	}

	@PostMapping("/assign-user-to-role")
	public UserEntity assignUserToRole(@RequestParam("userId") Long userId, @RequestParam("roleId") Long roleId) {
		return roleService.assignRoleToUser(userId, roleId);
	}
}
