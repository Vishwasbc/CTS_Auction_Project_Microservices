package com.auctionservice.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDTO {
	private Integer auctionId;
	private int productId;
	private LocalDateTime startDate;
	private LocalDateTime endDate;
	private double startPrice;
	private double currentHighestBid;
	private double minBidAmount;
	private String status;
}
