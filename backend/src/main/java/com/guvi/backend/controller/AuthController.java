package com.guvi.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.guvi.backend.dto.LoginRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.dto.UserDto;
import com.guvi.backend.service.interf.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Response> registerUser(@RequestBody UserDto registrationRequest) {
        System.out.println(registrationRequest);
        return ResponseEntity.ok(userService.registerUser(registrationRequest));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<Response> registerAdmin(@RequestBody UserDto registrationRequest) {
        registrationRequest.setRole("ROLE_ADMIN"); 
        return ResponseEntity.ok(userService.registerUser(registrationRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<Response> loginUser(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(userService.loginUser(loginRequest));
    }
}