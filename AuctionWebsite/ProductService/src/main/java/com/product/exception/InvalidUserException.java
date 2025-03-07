package com.product.exception;

public class InvalidUserException extends RuntimeException {
	public InvalidUserException(String msg) {
		super(msg);
	}
}
