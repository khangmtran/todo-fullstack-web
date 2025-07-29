package com.khang.todoapp.service;

import com.khang.todoapp.model.Todo;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Tells Spring this class holds business logic
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getTodosByUser(User user) {
        return todoRepository.findByUser(user);
    }

    public List<Todo> getTodos(){
        return todoRepository.findAll();
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public Todo createTodo(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found with id " + id));
        todo.setTitle(updatedTodo.getTitle());
        todo.setCompleted(updatedTodo.isCompleted());
        return todoRepository.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepository.deleteById(id);
    }
}
