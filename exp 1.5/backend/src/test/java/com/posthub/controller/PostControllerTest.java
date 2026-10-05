package com.posthub.controller;

import com.posthub.model.Post;
import com.posthub.model.PostStatus;
import com.posthub.service.PostService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Test
    void getAllPosts_shouldReturnPosts() throws Exception {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("Test Post");
        post.setContent("This is a test post.");
        post.setStatus(PostStatus.DRAFT);

        when(postService.getAllPosts())
                .thenReturn(List.of(post));

        mockMvc.perform(
                        get("/api/posts")
                                .contentType(MediaType.APPLICATION_JSON)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.data[0].id").value(1))
                .andExpect(jsonPath("$.data[0].title")
                        .value("Test Post"));
    }

    @Test
    void createPost_shouldCreatePost() throws Exception {

        Post post = new Post();
        post.setId(1L);
        post.setTitle("New Post");
        post.setContent("This is new content.");
        post.setStatus(PostStatus.DRAFT);

        when(postService.createPost(any()))
                .thenReturn(post);

        String requestBody = """
                {
                    "title": "New Post",
                    "content": "This is new content.",
                    "status": "DRAFT"
                }
                """;

        mockMvc.perform(
                        post("/api/posts")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status")
                        .value("success"))
                .andExpect(jsonPath("$.data.id")
                        .value(1))
                .andExpect(jsonPath("$.data.title")
                        .value("New Post"));
    }

    @Test
    void createPost_withEmptyContent_shouldReturnBadRequest()
            throws Exception {

        String requestBody = """
                {
                    "title": "Invalid Post",
                    "content": "",
                    "status": "DRAFT"
                }
                """;

        mockMvc.perform(
                        post("/api/posts")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestBody)
                )
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status")
                        .value("error"))
                .andExpect(jsonPath("$.message")
                        .value("Validation failed"));
    }
}