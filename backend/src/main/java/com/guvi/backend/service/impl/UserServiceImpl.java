package com.guvi.backend.service.impl;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.guvi.backend.dto.LoginRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.dto.UserDto;
import com.guvi.backend.entity.User;
import com.guvi.backend.enums.UserRole;
import com.guvi.backend.exception.InvalidCredentialsException;
import com.guvi.backend.exception.NotFoundException;
import com.guvi.backend.mapper.EntityDtoMapper;
import com.guvi.backend.repository.UserRepo;
import com.guvi.backend.security.JwtUtils;
import com.guvi.backend.service.interf.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final EntityDtoMapper entityDtoMapper;

    @Override
    public Response registerUser(UserDto registrationRequest) {
        // Default role
        UserRole role = UserRole.ROLE_USER;

        try {
            if (registrationRequest.getRole() != null) {
                String inputRole = registrationRequest.getRole().toUpperCase();
                switch (inputRole) {
                    case "ADMIN", "ROLE_ADMIN" -> role = UserRole.ROLE_ADMIN;
                    case "USER", "ROLE_USER" -> role = UserRole.ROLE_USER;
                    default -> {
                        return Response.builder()
                                .status(400)
                                .message("Invalid role provided. Allowed: ADMIN, USER")
                                .build();
                    }
                }
            }
        } catch (Exception e) {
            return Response.builder()
                    .status(400)
                    .message("Error processing role: " + e.getMessage())
                    .build();
        }

        // Save user
        User user = User.builder()
                .name(registrationRequest.getName())
                .email(registrationRequest.getEmail())
                .password(passwordEncoder.encode(registrationRequest.getPassword()))
                .phoneNumber(registrationRequest.getPhoneNumber())
                .role(role)
                .build();

        User savedUser = userRepo.save(user);
        UserDto userDto = entityDtoMapper.mapUserToDtoBasic(savedUser);

        return Response.builder()
                .status(200)
                .message("User Successfully Registered with role: " + role.name())
                .user(userDto)
                .build();
    }

    @Override
    public Response loginUser(LoginRequest loginRequest) {
        User user = userRepo.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new NotFoundException("Email not found"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Password does not match");
        }

        String token = jwtUtils.generateToken(user);

        return Response.builder()
                .status(200)
                .message("User Successfully Logged In")
                .token(token)
                .expirationTime("6 Month")
                .role(user.getRole().name())
                .build();
    }

    @Override
    public Response getAllUsers() {
        List<User> users = userRepo.findAll();
        List<UserDto> userDtos = users.stream()
                .map(entityDtoMapper::mapUserToDtoBasic)
                .toList();

        return Response.builder()
                .status(200)
                .userList(userDtos)
                .build();
    }

    @Override
    public User getLoginUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        log.info("User Email is: " + email);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not found"));
    }

    @Override
    public Response getUserInfoAndOrderHistory() {
        User user = getLoginUser();
        UserDto userDto = entityDtoMapper.mapUserToDtoPlusAddressAndOrderHistory(user);

        return Response.builder()
                .status(200)
                .user(userDto)
                .build();
    }
}
