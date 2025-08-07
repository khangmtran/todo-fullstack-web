package com.khang.todoapp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FolderDto {
    private Long id;
    private String title;
    private List<TodoDto> todos; // Only lightweight todos
}
