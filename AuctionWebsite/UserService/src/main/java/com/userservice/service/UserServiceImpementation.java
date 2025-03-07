package com.userservice.service;


import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.userservice.DTO.UserDTO;
import com.userservice.entity.User;
import com.userservice.exception.DuplicateEntityException;
import com.userservice.exception.UserNotFoundException;
import com.userservice.repository.UserRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service implementation class for managing user-related operations.
 */
@Service
@AllArgsConstructor
@Slf4j
public class UserServiceImpementation implements UserService {

	private UserRepository userRepository;
	
	private PasswordEncoder passwordEncoder;

	/**
	 * Logs in a user with the given username and password.
	 * 
	 * @param userName the username of the user
	 * @param password the password of the user
	 * @return a message indicating the login status
	 * @throws UserNotFoundException      if the user is not found
	 * @throws IncorrectPasswordException if the password is incorrect
	 */
//	@Override
//	public String loginUser(String userName, String password) {
//		User user = userRepository.findById(userName)
//				.orElseThrow(() -> new UserNotFoundException(userName + " not Found"));
//		if (!Objects.equals(user.getPassword(), password)) {
//			throw new IncorrectPasswordException("Wrong Password");
//		}
//		return "Logged In";
//	}

	/**
     * Registers a new user.
     *
     * @param user the user details to register
     * @return the registered user
     * @throws DuplicateEntityException if the user exists in database
     */
    @Override
    public String registerUser(User user) {
        try {
            if (userRepository.findById(user.getUserName()).isPresent()) {
                throw new DuplicateEntityException("The User is Already Registered");
            }
            log.info("Registering user: {}", user.getUserName());
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return "Registered Successfully";
        } catch (DuplicateEntityException e) {
            log.error("User registration failed: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("An unexpected error occurred during registration: {}", e.getMessage());
            throw new RuntimeException("User registration failed. Please try again later.");
        }
    }

	/**
	 * Deletes a user with the given username.
	 * 
	 * @param userName the username of the user to delete
	 * @return a message indicating the deletion status
	 * @throws UserNotFoundException if the user is not found
	 */
	@Override
	public String deleteUser(String userName) {
		User user = userRepository.findById(userName)
				.orElseThrow(() -> new UserNotFoundException(userName + " not Found"));
		userRepository.delete(user);
		return "User Deleted";
	}

	/**
	 * Updates the details of an existing user.
	 * 
	 * @param userName the username of the user to update
	 * @param user     the updated user details
	 * @return the updated user
	 * @throws UserNotFoundException if the user is not found
	 */
	@Override
	public User updateUser(String userName, User user) {
		User existingUser = userRepository.findById(userName)
				.orElseThrow(() -> new UserNotFoundException(userName + " not Found"));
		existingUser.setFirstName(user.getFirstName());
		existingUser.setLastName(user.getLastName());
		existingUser.setEmail(user.getEmail());
		existingUser.setPassword(user.getPassword());
		existingUser.setContactNo(user.getContactNo());
		existingUser.setBirthDate(user.getBirthDate());
		existingUser.setGender(user.getGender());
		existingUser.setRole(user.getRole());

		return userRepository.save(existingUser);
	}

	/**
	 * Retrieves user details by username.
	 * 
	 * @param userName the username of the user to retrieve
	 * @return the user details as a UserDTO
	 * @throws UserNotFoundException if the user is not found
	 */
	@Override
	public UserDTO getByUserName(String userName) {
		User user = userRepository.findById(userName)
				.orElseThrow(() -> new UserNotFoundException(userName + " not Found"));
		UserDTO userDTO = new UserDTO();
		userDTO.setUserName(user.getUserName());
		userDTO.setFirstName(user.getFirstName());
		userDTO.setLastName(user.getLastName());
		userDTO.setEmail(user.getEmail());
		userDTO.setRole(user.getRole().name());
		return userDTO;
	}
	@Override
	public User getFullUserByUserName(String userName) {
	    return userRepository.findById(userName)
	            .orElseThrow(() -> new UserNotFoundException(userName + " not found"));
	}

}
