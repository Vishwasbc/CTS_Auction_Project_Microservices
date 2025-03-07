package com.bidservice.exception;

public class InvalidBidderException extends RuntimeException {
	public InvalidBidderException(String msg) {
		super(msg);
	}
}
