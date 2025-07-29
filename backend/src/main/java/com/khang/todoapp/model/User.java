package com.khang.todoapp.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder 

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String password;

    // One user can have many todos
    // CascadeType.ALL means that any operation on User will also apply to its todos
    // orphanRemoval = true means that if a todo is removed from the user's todo list,
    // it will also be deleted from the database. If a user is deleted,
    // all their todos will also be deleted.
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Todo> todos;

}
