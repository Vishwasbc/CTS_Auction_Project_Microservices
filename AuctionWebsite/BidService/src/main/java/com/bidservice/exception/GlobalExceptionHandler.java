package com.bidservice.exception;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(InvalidBidAmountException.class)
	public ResponseEntity<ErrorResponse> invalidBidAmountExceptionHandler(InvalidBidAmountException ex){
		ErrorResponse invalidBid= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Please Enter Valid Bid Amount");
		return new ResponseEntity<>(invalidBid,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(InvalidBidderException.class)
	public ResponseEntity<ErrorResponse> invalidBidderExceptionHandler(InvalidBidderException ex){
		ErrorResponse invalidBid= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "The user is not a Bidder");
		return new ResponseEntity<>(invalidBid,HttpStatus.BAD_REQUEST);
	}
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> productNotFoundExceptionHandler(Exception ex){
		ErrorResponse exception= new ErrorResponse(LocalDateTime.now(), ex.getMessage(), "Exception Found");
		return new ResponseEntity<>(exception,HttpStatus.NOT_FOUND);
	}
}
