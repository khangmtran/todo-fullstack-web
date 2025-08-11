package com.khang.todoapp.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoDto {
    private Long id;
    private String title;
    private String note;
    private Long folderId; 
    private LocalDate dueDate; 
    private String priority;
    private Boolean completed;
}