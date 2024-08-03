package com.project.hethongkhachsan.service;

import com.project.hethongkhachsan.dto.CommentDTO;

public interface ICommentService {
	
	CommentDTO addComment(CommentDTO commentDTO);

	int countCommentsByHotel(Long hotelId);

	void deleteComment(Long commentId);
}
