package com.khang.todoapp.repository;

import com.khang.todoapp.model.Folder;
import com.khang.todoapp.model.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface FolderRepository extends JpaRepository<Folder, Long> {
    // Custom query to find folders by user
    List<Folder> findByUser(User user);
}