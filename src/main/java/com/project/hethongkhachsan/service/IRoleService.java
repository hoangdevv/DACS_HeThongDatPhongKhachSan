package com.project.hethongkhachsan.service;

import java.util.List;

import com.project.hethongkhachsan.entity.RoleEntity;
import com.project.hethongkhachsan.entity.UserEntity;

public interface IRoleService {

	List<RoleEntity> getRoles();

	RoleEntity createRole(RoleEntity roleEntity);

	void deleteRole(Long roleId);

	RoleEntity findByName(String name);

	UserEntity removeUserFromRole(Long userId, Long roleId);

	UserEntity assignRoleToUser(Long userId, Long roleId);

	RoleEntity removeAllUsersFromRole(Long roleId);

}
