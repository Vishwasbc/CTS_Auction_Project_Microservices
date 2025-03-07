package com.userservice.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ErrorResponse> userNotFoundExceptionHandler(UserNotFoundException ex){
		ErrorResponse userNotFound= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "User Not Found");
		return new ResponseEntity<>(userNotFound,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(IncorrectPasswordException.class)
	public ResponseEntity<ErrorResponse> incorrectPasswordExceptionHandler(IncorrectPasswordException ex){
		ErrorResponse incorrectPassword = new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Incorrect Password");
		return new ResponseEntity<>(incorrectPassword,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(DuplicateEntityException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEntityException(DuplicateEntityException ex) {
		ErrorResponse duplicateEntity = new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Username already exists");
		return new ResponseEntity<>(duplicateEntity,HttpStatus.BAD_REQUEST);
    }
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> productNotFoundExceptionHandler(Exception ex){
		ErrorResponse exception= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Exception Found");
		return new ResponseEntity<>(exception,HttpStatus.NOT_FOUND);
	}
}
