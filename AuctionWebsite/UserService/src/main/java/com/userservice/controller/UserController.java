package com.userservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.userservice.DTO.AuthRequest;
import com.userservice.DTO.UserDTO;
import com.userservice.entity.User;
import com.userservice.exception.DuplicateEntityException;
import com.userservice.repository.UserRepository;
import com.userservice.service.JwtService;
import com.userservice.service.UserService;

import lombok.AllArgsConstructor;

/**
 * Controller class for managing user-related operations.
 */
@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
	private JwtService jwtService;
	private UserService userService;
	private UserRepository userRepository;
	private AuthenticationManager authenticationManager;

	/**
	 * Handles user login requests.
	 * 
	 * @param userName the username of the user
	 * @param password the password of the user
	 * @return a ResponseEntity containing the login status
	 */
	@PostMapping("/login")
	public String authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
		if (authentication.isAuthenticated()) {
			User user = userRepository.findById(authRequest.getUsername())
					.orElseThrow(() -> new UsernameNotFoundException("Invalid User Request"));
			return jwtService.generateToken(authRequest.getUsername(), user.getRole().name());
		} else {
			throw new UsernameNotFoundException("invalid user request !");
		}
	}

	/**
	 * Handles user registration requests.
	 *
	 * @param user the user details to register
	 * @return a ResponseEntity containing the registered user and HTTP status
	 *         CREATED
	 */
	@PostMapping("/register")
	public ResponseEntity<String> register(@RequestBody User user) {
		try {
			return new ResponseEntity<>(userService.registerUser(user), HttpStatus.CREATED);
		} catch (DuplicateEntityException e) {
			return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
		} catch (Exception e) {
			return new ResponseEntity<>("User registration failed. Please try again later.",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Handles user deletion requests.
	 * 
	 * @param userName the username of the user to delete
	 * @return a ResponseEntity containing the deletion status
	 */
	@DeleteMapping("/delete")
	public ResponseEntity<String> delete(@RequestParam String userName) {
		return ResponseEntity.ok(userService.deleteUser(userName));
	}

	/**
	 * Handles user update requests.
	 * 
	 * @param userName the username of the user to update
	 * @param user     the updated user details
	 * @return a ResponseEntity containing the updated user
	 */
	@PutMapping("/update/{userName}")
	public ResponseEntity<User> update(@PathVariable String userName, @RequestBody User user) {
		return ResponseEntity.ok(userService.updateUser(userName, user));
	}

	/**
	 * Retrieves user details by username. This is for Other Services
	 * 
	 * @param userName the username of the user to retrieve
	 * @return the user details as a UserDTO
	 */
	@GetMapping("/{userName}")
	public UserDTO getByUserName(@PathVariable String userName) {
		return userService.getByUserName(userName);
	}
	@GetMapping("/full-info/{userName}")
	public ResponseEntity<User> getFullUserInfoByUsername(@PathVariable String userName) {
	    User user = userService.getFullUserByUserName(userName);
	    return new ResponseEntity<>(user, HttpStatus.OK);
	}

}
