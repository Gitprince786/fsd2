package com.posthub.controller;

import com.posthub.dto.ApiResponse;
import com.posthub.dto.PostRequest;
import com.posthub.model.Post;
import com.posthub.service.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Post>>> getAllPosts() {

        List<Post> posts = postService.getAllPosts();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Posts retrieved successfully",
                        posts
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> getPostById(
            @PathVariable Long id
    ) {

        Post post = postService.getPostById(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Post retrieved successfully",
                        post
                )
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Post>> createPost(
            @Valid @RequestBody PostRequest request
    ) {

        Post post = postService.createPost(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        ApiResponse.success(
                                "Post created successfully",
                                post
                        )
                );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Post>> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequest request
    ) {

        Post post = postService.updatePost(id, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Post updated successfully",
                        post
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @PathVariable Long id
    ) {

        postService.deletePost(id);

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Post deleted successfully",
                        null
                )
        );
    }

    @GetMapping("/scheduled")
    public ResponseEntity<ApiResponse<List<Post>>> getScheduledPosts() {

        List<Post> posts = postService.getScheduledPosts();

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Scheduled posts retrieved successfully",
                        posts
                )
        );
    }

    @PostMapping("/{id}/schedule")
    public ResponseEntity<ApiResponse<Post>> schedulePost(
            @PathVariable Long id,
            @RequestBody ScheduleRequest request
    ) {

        Post post = postService.schedulePost(
                id,
                request.scheduledAt()
        );

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Post scheduled successfully",
                        post
                )
        );
    }

    public record ScheduleRequest(
            LocalDateTime scheduledAt
    ) {
    }
}