package com.yhm.gims.controller;


import com.yhm.gims.dto.UserDto;
import com.yhm.gims.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;


@RestController
@Validated
@RequestMapping(path = {"/api/users"})
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("")
    public ResponseEntity<UserDto> getUser(Principal principal) {
        return ResponseEntity.ok(UserDto.fromPrincipal(principal));
    }


    @PutMapping("")
    public ResponseEntity<String> update(@RequestBody UserDto user,Principal principal) {
        userService.updateUser(principal,user);
        return ResponseEntity.ok(user.getUsername());
    }
}
