package com.bidservice.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AuctionDto {
	private Integer auctionId;
	private int productId;
	private String description;
	private int sellerId;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private double startPrice;
	private double currentHighestBid;
	private double minBidAmount;
	private String status;
}
