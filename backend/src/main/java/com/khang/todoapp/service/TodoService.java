package com.khang.todoapp.service;

import com.khang.todoapp.model.Folder;
import com.khang.todoapp.model.Todo;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.FolderRepository;
import com.khang.todoapp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Tells Spring this class holds business logic
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private FolderRepository folderRepository;

    public List<Todo> getTodosByUser(User user) {
        return todoRepository.findByUser(user);
    }

    public List<Todo> getTodos(){
        return todoRepository.findAll();
    }

    public Optional<Todo> getTodoById(Long id) {
        return todoRepository.findById(id);
    }

    public ResponseEntity<?> createTodo(Todo todo, User user) {
        Optional<Folder> optFolder = folderRepository.findById(todo.getFolder().getId());
        if(optFolder.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }
        Folder folder = optFolder.get();
        if(!folder.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to add todo to this folder");
        }
        todo.setFolder(folder);
        todo.setUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(todoRepository.save(todo));
    }

    public ResponseEntity<?> updateTodo(Long id, Todo updatedTodo, User user) {
        Optional<Todo> optTodo = todoRepository.findById(id);
        if(optTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        Todo existing = optTodo.get();
        if(!existing.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this todo");
        }
        if(!updatedTodo.getTitle().isEmpty()) existing.setTitle(updatedTodo.getTitle());
        if(!updatedTodo.getNote().isEmpty()) existing.setNote(updatedTodo.getNote());
        if(!updatedTodo.getCompleted()) existing.setCompleted(updatedTodo.getCompleted());

        return ResponseEntity.ok(todoRepository.save(existing));
    }

    public ResponseEntity<?> deleteTodo(Long id, User user) {
        Optional<Todo> optTodo = todoRepository.findById(id);
        if(optTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        Todo existing = optTodo.get();
        if(!existing.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this todo");
        }
        todoRepository.delete(existing);
        return ResponseEntity.ok("Todo deleted successfully");
    }
}
