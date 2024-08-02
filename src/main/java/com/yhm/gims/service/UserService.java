package com.yhm.gims.service;

import com.yhm.gims.dto.UserDto;
import com.yhm.gims.entity.User;
import com.yhm.gims.exception.ResourceNotFoundException;
import com.yhm.gims.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Principal;


@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public void updateUser(Principal principal,UserDto user) {
        User updateUser = userRepository.findByUsername(principal.getName()).orElseThrow(() -> new ResourceNotFoundException("User not exist with username " + principal.getName()));
        updateUser.setUsername(user.getUsername());
        if (!user.getPassword().isBlank()) {
            updateUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userRepository.save(updateUser);


    }
}
