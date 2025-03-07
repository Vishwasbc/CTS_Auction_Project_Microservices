package com.product.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ProductNotFoundException.class)
	public ResponseEntity<ErrorResponse> productNotFoundExceptionHandler(ProductNotFoundException ex){
		ErrorResponse productNotFound= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Product doesnot Exist");
		return new ResponseEntity<>(productNotFound,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> productNotFoundExceptionHandler(Exception ex){
		ErrorResponse exception= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Exception Found");
		return new ResponseEntity<>(exception,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(InvalidUserException.class)
	public ResponseEntity<ErrorResponse> invalidUserExceptionHandler(InvalidUserException ex){
		ErrorResponse productNotFound= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Cannot put the product");
		return new ResponseEntity<>(productNotFound,HttpStatus.NOT_FOUND);
	}
}
