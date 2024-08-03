package com.project.hethongkhachsan.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.project.hethongkhachsan.dto.CommentDTO;
import com.project.hethongkhachsan.service.ICommentService;

@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/comments")
public class CommentController {
	@Autowired
	private ICommentService commentService;

	@PostMapping("/add-comment")
	public ResponseEntity<CommentDTO> addComment(@RequestBody CommentDTO commentDTO) {
		CommentDTO savedCommentDTO = commentService.addComment(commentDTO);
		return ResponseEntity.status(HttpStatus.CREATED).body(savedCommentDTO);
	}

	@GetMapping("/count-comment/{hotelId}")
	public ResponseEntity<Integer> countCommentsByHotel(@PathVariable("hotelId") Long hotelId) {
		int commentCount = commentService.countCommentsByHotel(hotelId);
		return ResponseEntity.ok(commentCount);
	}

	@DeleteMapping("/delete-comment/{commentId}")
	public ResponseEntity<Void> deleteComment(@PathVariable("commentId") Long commentId) {
		commentService.deleteComment(commentId);
		return ResponseEntity.noContent().build();
	}
}
