package com.khang.todoapp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.khang.todoapp.model.Folder;
import com.khang.todoapp.model.User;
import com.khang.todoapp.repository.FolderRepository;

@Service
public class FolderService {
    @Autowired
    FolderRepository folderRepository;
    
    public ResponseEntity<?> getFolders(User user){
        List<Folder> folders = folderRepository.findByUser(user);
        return ResponseEntity.ok(folders);
    }

    public ResponseEntity<?> createFolder(Folder folder){
        return ResponseEntity.status(HttpStatus.CREATED).body(folderRepository.save(folder));
    }

    public ResponseEntity<?> updateFolder(long id, Folder folderDetails, User user){
        Optional<Folder> optFolder = folderRepository.findById(id);
        if(!optFolder.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }
        Folder folder = optFolder.get();
        if(!folder.getUser().getId().equals(user.getId())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to update this folder");
        }
        folder.setTitle(folderDetails.getTitle());
        return ResponseEntity.ok(folderRepository.save(folder));
    }

    public ResponseEntity<?> deleteFolder(long id, User user){
        Optional<Folder> optFolder = folderRepository.findById(id);
        if(!optFolder.isPresent()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Folder not found");
        }
        Folder folder = optFolder.get();
        if(!folder.getUser().equals(user)){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You don't have permission to delete this folder");
        }
        folderRepository.delete(folder);
        return ResponseEntity.ok("Folder deleted successfully");
    }
}
