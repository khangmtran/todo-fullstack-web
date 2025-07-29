package com.khang.todoapp.repository;

import com.khang.todoapp.model.Todo;
import com.khang.todoapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser(User user);
}
