package com.guvi.backend.service.interf;

import com.guvi.backend.dto.LoginRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.dto.UserDto;
import com.guvi.backend.entity.User;

public interface UserService {
    Response registerUser(UserDto registrationRequest);

    Response loginUser(LoginRequest loginRequest);

    Response getAllUsers();

    User getLoginUser();

    Response getUserInfoAndOrderHistory();
}