package com.posthub.service;

import com.posthub.dto.PostRequest;
import com.posthub.exception.PostNotFoundException;
import com.posthub.model.Post;
import com.posthub.model.PostStatus;
import com.posthub.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException(id));
    }

    public Post createPost(PostRequest request) {

        PostStatus status = request.getStatus();

        if (status == null) {
            status = PostStatus.DRAFT;
        }

        if (status == PostStatus.SCHEDULED
                && request.getScheduledAt() == null) {
            throw new IllegalArgumentException(
                    "Scheduled date and time are required"
            );
        }

        Post post = new Post();

        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setStatus(status);

        if (status == PostStatus.SCHEDULED) {
            post.setScheduledAt(request.getScheduledAt());
        }

        return postRepository.save(post);
    }

    public Post updatePost(Long id, PostRequest request) {

        Post post = getPostById(id);

        PostStatus status = request.getStatus();

        if (status == null) {
            status = PostStatus.DRAFT;
        }

        if (status == PostStatus.SCHEDULED
                && request.getScheduledAt() == null) {
            throw new IllegalArgumentException(
                    "Scheduled date and time are required"
            );
        }

        post.setTitle(request.getTitle().trim());
        post.setContent(request.getContent().trim());
        post.setStatus(status);

        if (status == PostStatus.SCHEDULED) {
            post.setScheduledAt(request.getScheduledAt());
        } else {
            post.setScheduledAt(null);
        }

        return postRepository.save(post);
    }

    public void deletePost(Long id) {

        Post post = getPostById(id);

        postRepository.delete(post);
    }

    public List<Post> getScheduledPosts() {
        return postRepository.findByStatus(PostStatus.SCHEDULED);
    }

    public Post schedulePost(Long id, LocalDateTime scheduledAt) {

        if (scheduledAt == null) {
            throw new IllegalArgumentException(
                    "Scheduled date and time are required"
            );
        }

        Post post = getPostById(id);

        post.setStatus(PostStatus.SCHEDULED);
        post.setScheduledAt(scheduledAt);

        return postRepository.save(post);
    }
}