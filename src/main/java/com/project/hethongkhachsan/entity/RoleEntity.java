package com.project.hethongkhachsan.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rolesT")
public class RoleEntity extends BaseEntity {

	@Column
	private String name;

	@JsonIgnore
	@ManyToMany(mappedBy = "roles")
	private Collection<UserEntity> users = new HashSet<>();
	
	public RoleEntity() { }
	
	public RoleEntity(String name) {
		this.name = name;
	}

	public void assignRoleToUser(UserEntity user) {
		user.getRoles().add(this);
		this.getUsers().add(user);
	}

	public void removeUserFromRole(UserEntity user) {
		user.getRoles().remove(this);
		this.getUsers().remove(user);

	}

	public void removeAllUsersFromRole() {
        if (this.getUsers() != null) {
            List<UserEntity> roleUsers = this.getUsers().stream().collect(Collectors.toList());
            roleUsers.forEach(this::removeUserFromRole);
        }
    }

	public String getName() {
		return name != null ? name : "";
	}

	public void setName(String name) {
		this.name = name;
	}

	public Collection<UserEntity> getUsers() {
		return users;
	}

	public void setUsers(Collection<UserEntity> users) {
		this.users = users;
	}

}
