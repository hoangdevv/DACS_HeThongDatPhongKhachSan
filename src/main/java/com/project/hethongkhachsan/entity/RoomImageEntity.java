package com.project.hethongkhachsan.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "room_imagesT")
public class RoomImageEntity extends BaseEntity {

	@ManyToOne()
	@JoinColumn(name = "room_id")
	private RoomEntity room;

	@Column(nullable = false)
	private String imageUrl;

	public RoomEntity getRoom() {
		return room;
	}

	public void setRoom(RoomEntity room) {
		this.room = room;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
	

}
