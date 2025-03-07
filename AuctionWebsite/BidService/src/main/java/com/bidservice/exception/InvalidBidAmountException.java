package com.bidservice.exception;

public class InvalidBidAmountException extends RuntimeException {
	public InvalidBidAmountException(String msg) {
		super(msg);
	}
}
