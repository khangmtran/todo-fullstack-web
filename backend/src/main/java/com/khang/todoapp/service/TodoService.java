package com.khang.todoapp.service;

import com.khang.todoapp.dto.DtoMapper;
import com.khang.todoapp.dto.TodoDto;
import com.khang.todoapp.model.Folder;
import com.khang.todoapp.model.Todo;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.FolderRepository;
import com.khang.todoapp.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service // Tells Spring this class holds business logic
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private FolderRepository folderRepository;

    public ResponseEntity<?> createTodo(TodoDto todoDto, User user) {
        Optional<Folder> optFolder = folderRepository.findById(todoDto.getFolderId());
        if(optFolder.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }
        Folder folder = optFolder.get();
        if(!folder.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to add todo to this folder");
        }

        Todo todo = Todo.builder()
                .title(todoDto.getTitle())
                .note(todoDto.getNote())
                .folder(folder)
                .build();
        Todo saved = todoRepository.save(todo);

        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toTodoDto(saved));
    }

    public ResponseEntity<?> updateTodo(Long id, TodoDto todoDto, User user) {
        Optional<Todo> optTodo = todoRepository.findById(id);
        if(optTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        Todo existing = optTodo.get();
        if(!existing.getFolder().getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this todo");
        }

        if(!todoDto.getTitle().isEmpty()) existing.setTitle(todoDto.getTitle());
        if(!todoDto.getNote().isEmpty()) existing.setNote(todoDto.getNote());

        Todo updated = todoRepository.save(existing);
        return ResponseEntity.ok(DtoMapper.toTodoDto(updated));
    }

    public ResponseEntity<?> deleteTodo(Long id, User user) {
        Optional<Todo> optTodo = todoRepository.findById(id);
        if(optTodo.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
        Todo existing = optTodo.get();
        if(!existing.getFolder().getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this todo");
        }
        todoRepository.delete(existing);
        return ResponseEntity.ok("Todo deleted successfully");
    }
}
