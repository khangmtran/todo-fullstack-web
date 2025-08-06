// FolderController.java
package com.khang.todoapp.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.khang.todoapp.model.Folder;
import com.khang.todoapp.model.User;
import com.khang.todoapp.service.FolderService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/folders")
public class FolderController{
    @Autowired
    FolderService folderService;
    
    @GetMapping
    public ResponseEntity<?> getFolders() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return folderService.getFolders(user);
    }

    @PostMapping
    public ResponseEntity<?> createFolder(@RequestBody Folder folder){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        folder.setUser(user);
        return folderService.createFolder(folder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFolder(@PathVariable long id, @RequestBody Folder folderDetails){
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return folderService.updateFolder(id, folderDetails, user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFolder(@PathVariable long id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return folderService.deleteFolder(id, user);
    }
}
