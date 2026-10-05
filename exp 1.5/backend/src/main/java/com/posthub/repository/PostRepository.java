package com.posthub.repository;

import com.posthub.model.Post;
import com.posthub.model.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findByStatus(PostStatus status);
}