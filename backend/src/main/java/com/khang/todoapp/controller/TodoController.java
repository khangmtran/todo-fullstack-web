package com.khang.todoapp.controller;

import com.khang.todoapp.model.Todo;
import com.khang.todoapp.service.TodoService;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;
    @Autowired
    private UserRepository userRepository;

    // GET all todos
    @GetMapping
    public List<Todo> getTodosByUser(@RequestParam String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return todoService.getTodosByUser(user);
    }

    @GetMapping("/all")
    public List<Todo> getTodos() {
        return todoService.getTodos();
    }

    // GET a todo by ID
    @GetMapping("/{id}")
    public Optional<Todo> getTodoById(@PathVariable Long id) {
        return todoService.getTodoById(id);
    }

    // POST create a new todo
    @PostMapping
    public Todo createTodo(@RequestBody Todo todo, @RequestParam String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        todo.setUser(user);
        return todoService.createTodo(todo);
    }

    // PUT update a todo
    @PutMapping("/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        return todoService.updateTodo(id, todoDetails);
    }

    // DELETE a todo
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }
}
