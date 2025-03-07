package com.product.exception;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ErrorResponse {
	private LocalDateTime timestamp;
	private String message;
	private String details;
	public ErrorResponse(LocalDateTime timestamp,String message,String details) {
		this.timestamp=timestamp;
		this.message=message;
		this.details=details;
	}
}
