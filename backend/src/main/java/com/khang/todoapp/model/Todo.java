package com.khang.todoapp.model;

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
    private boolean completed;

    @ManyToOne // Many todos can belong to one user
    @JoinColumn(name = "user_id") // Foreign key column in the todos table
    private User user;

    
}
