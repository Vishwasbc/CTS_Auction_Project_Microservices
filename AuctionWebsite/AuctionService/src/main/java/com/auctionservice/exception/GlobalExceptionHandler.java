package com.auctionservice.exception;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(AuctionNotFoundException.class)
	public ResponseEntity<ErrorResponse> auctionNotFoundExceptionHandler(AuctionNotFoundException ex){
		ErrorResponse auctionNotFound= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Auction doesnot Exist");
		return new ResponseEntity<>(auctionNotFound,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> productNotFoundExceptionHandler(Exception ex){
		ErrorResponse exception= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Exception Found");
		return new ResponseEntity<>(exception,HttpStatus.NOT_FOUND);
	}
	@ExceptionHandler(InvalidProductException.class)
	public ResponseEntity<ErrorResponse> invalidProductExceptionHandler(InvalidProductException ex){
		ErrorResponse auctionNotFound= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Product is already up for Auction");
		return new ResponseEntity<>(auctionNotFound,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
	}
}
