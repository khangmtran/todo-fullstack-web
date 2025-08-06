package com.khang.todoapp.controller;

import com.khang.todoapp.model.Todo;
import com.khang.todoapp.service.TodoService;
import com.khang.todoapp.model.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;
    
    // POST create a new todo
    @PostMapping
    public ResponseEntity<?> createTodo(@RequestBody Todo todo) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return todoService.createTodo(todo, user);
    }

    // PUT update a todo
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTodo(@PathVariable Long id, @RequestBody Todo todoDetails) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return todoService.updateTodo(id, todoDetails, user);
    }

    // DELETE a todo
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return todoService.deleteTodo(id, user);
    }
}
