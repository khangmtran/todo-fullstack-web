package com.khang.todoapp.dto;

import com.khang.todoapp.model.*;

import java.util.List;
import java.util.stream.Collectors;

public class DtoMapper {

    public static TodoDto toTodoDto(Todo todo) {
        return TodoDto.builder()
                .id(todo.getId())
                .title(todo.getTitle())
                .note(todo.getNote())
                .folderId(todo.getFolder().getId())
                .dueDate(todo.getDueDate())
                .priority(todo.getPriority())
                .completed(todo.getCompleted())
                .build();
    }

    public static FolderDto toFolderDto(Folder folder) {
        List<TodoDto> todoDtos = folder.getTodos() == null ? List.of() :
            folder.getTodos().stream()
                .map(todo -> DtoMapper.toTodoDto(todo))
                .collect(Collectors.toList());

        return FolderDto.builder()
                .id(folder.getId())
                .title(folder.getTitle())
                .todos(todoDtos)
                .build();
    }

    public static List<FolderDto> toListFoldersDto(List<Folder> folders){
        return folders.stream().map(folder -> DtoMapper.toFolderDto(folder)).collect(Collectors.toList());
    }

    public static UserDto toUserDto(User user) {
        List<FolderDto> folderDtos = user.getFolders() == null ? List.of() :
            user.getFolders().stream()
                .map(folder -> DtoMapper.toFolderDto(folder))
                .collect(Collectors.toList());

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .folders(folderDtos)
                .build();
    }
}
