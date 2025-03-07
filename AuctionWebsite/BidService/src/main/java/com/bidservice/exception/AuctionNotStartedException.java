package com.bidservice.exception;

public class AuctionNotStartedException extends RuntimeException {
	public AuctionNotStartedException(String msg) {
		super(msg);
	}
}
