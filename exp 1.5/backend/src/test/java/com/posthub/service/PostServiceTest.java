package com.posthub.service;

import com.posthub.dto.PostRequest;
import com.posthub.exception.PostNotFoundException;
import com.posthub.model.Post;
import com.posthub.model.PostStatus;
import com.posthub.repository.PostRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    @Test
    void getAllPosts_shouldReturnPosts() {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test Post");
        post.setContent("Test content");
        post.setStatus(PostStatus.DRAFT);

        when(postRepository.findAll())
                .thenReturn(List.of(post));

        List<Post> result = postService.getAllPosts();

        assertEquals(1, result.size());
        assertEquals("Test Post", result.get(0).getTitle());

        verify(postRepository).findAll();
    }

    @Test
    void getPostById_shouldReturnPost() {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test Post");
        post.setContent("Test content");
        post.setStatus(PostStatus.DRAFT);

        when(postRepository.findById(1L))
                .thenReturn(Optional.of(post));

        Post result = postService.getPostById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test Post", result.getTitle());
    }

    @Test
    void getPostById_whenPostDoesNotExist_shouldThrowException() {

        when(postRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                PostNotFoundException.class,
                () -> postService.getPostById(99L)
        );
    }

    @Test
    void createPost_shouldSavePost() {

        PostRequest request = new PostRequest();

        request.setTitle("New Post");
        request.setContent("New post content");
        request.setStatus(PostStatus.DRAFT);

        Post savedPost = new Post();
        savedPost.setId(1L);
        savedPost.setTitle("New Post");
        savedPost.setContent("New post content");
        savedPost.setStatus(PostStatus.DRAFT);

        when(postRepository.save(any(Post.class)))
                .thenReturn(savedPost);

        Post result = postService.createPost(request);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("New Post", result.getTitle());

        verify(postRepository).save(any(Post.class));
    }

    @Test
    void updatePost_shouldUpdateExistingPost() {

        Post existingPost = new Post();
        existingPost.setId(1L);
        existingPost.setTitle("Old Title");
        existingPost.setContent("Old content");
        existingPost.setStatus(PostStatus.DRAFT);

        PostRequest request = new PostRequest();
        request.setTitle("Updated Title");
        request.setContent("Updated content");
        request.setStatus(PostStatus.PUBLISHED);

        when(postRepository.findById(1L))
                .thenReturn(Optional.of(existingPost));

        when(postRepository.save(any(Post.class)))
                .thenReturn(existingPost);

        Post result = postService.updatePost(1L, request);

        assertEquals("Updated Title", result.getTitle());
        assertEquals("Updated content", result.getContent());
        assertEquals(PostStatus.PUBLISHED, result.getStatus());

        verify(postRepository).save(existingPost);
    }

    @Test
    void deletePost_shouldDeleteExistingPost() {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Delete Me");
        post.setContent("Delete this post");
        post.setStatus(PostStatus.DRAFT);

        when(postRepository.findById(1L))
                .thenReturn(Optional.of(post));

        postService.deletePost(1L);

        verify(postRepository).delete(post);
    }

    @Test
    void getScheduledPosts_shouldReturnScheduledPosts() {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Scheduled Post");
        post.setContent("Scheduled content");
        post.setStatus(PostStatus.SCHEDULED);

        when(postRepository.findByStatus(PostStatus.SCHEDULED))
                .thenReturn(List.of(post));

        List<Post> result = postService.getScheduledPosts();

        assertEquals(1, result.size());
        assertEquals(
                PostStatus.SCHEDULED,
                result.get(0).getStatus()
        );
    }
}