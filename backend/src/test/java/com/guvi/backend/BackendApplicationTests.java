package com.guvi.backend;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.guvi.backend.controller.AuthController;
import com.guvi.backend.dto.LoginRequest;
import com.guvi.backend.dto.Response;
import com.guvi.backend.dto.UserDto;
import com.guvi.backend.entity.User;
import com.guvi.backend.repository.UserRepo;
import com.guvi.backend.security.JwtUtils;
import com.guvi.backend.service.impl.UserServiceImpl;

@SpringBootTest
class BackendApplicationTests {

	@Mock
	private UserRepo userRepository;

	@Mock
	private JwtUtils jwtUtil;

	@InjectMocks
	private UserServiceImpl userService;

	@InjectMocks
	private AuthController authController;

	public BackendApplicationTests() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void contextLoads() {
		assertTrue(true);
	}

	@Test
	void testRegisterUserSuccess() {
		UserDto dto = new UserDto();
		dto.setEmail("test@example.com");
		dto.setName("Test User");
		dto.setPhoneNumber("9876543210");
		dto.setPassword("pass123");

		when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.empty());
		when(userRepository.save(any(User.class))).thenAnswer(i -> {
			User u = i.getArgument(0);
			u.setId(1L);
			return u;
		});

		Response response = userService.registerUser(dto);
		assertEquals("User Successfully Registered with role: ROLE_USER", response.getMessage());
	}

	@Test
	void testRegisterUserFailsIfAlreadyExists() {
		UserDto dto = new UserDto();
		dto.setEmail("test@example.com");

		when(userRepository.findByEmail(dto.getEmail())).thenReturn(Optional.of(new User()));

		Exception exception = assertThrows(RuntimeException.class, () -> {
			userService.registerUser(dto);
		});

		assertTrue(exception.getMessage().contains("already exists"));
	}

	@Test
	void testLoginUserSuccess() {
		User user = new User();
		user.setEmail("test@example.com");
		user.setPassword("password123");

		LoginRequest request = new LoginRequest();
		request.setEmail("test@example.com");
		request.setPassword("password123");

		when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
		when(jwtUtil.generateToken(any(User.class))).thenReturn("mocked-jwt-token");

		Response response = userService.loginUser(request);
		assertEquals("User Successfully Logged In", response.getMessage());
		assertEquals("mocked-jwt-token", response.getToken());
	}
}
