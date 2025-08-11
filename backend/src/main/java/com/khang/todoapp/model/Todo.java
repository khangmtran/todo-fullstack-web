package com.khang.todoapp.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.*;

//Maps this class to a database table
@Entity 
//Lombok - remove the need for boilerplate code
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder 

public class Todo {

    //Marks id as the primary key
    @Id 
    //Auto-increments the ID
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String note;
    private LocalDate dueDate;
    private String priority;
    private Boolean completed;

    @ManyToOne
    @JoinColumn(name = "folder_id")
    private Folder folder;
}
