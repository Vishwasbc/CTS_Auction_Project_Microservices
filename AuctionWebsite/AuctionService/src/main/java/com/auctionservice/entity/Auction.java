package com.auctionservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Auction {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer auctionId;
	@NotNull
	private int productId;
	@NotNull
	private LocalDateTime startDate;
	@NotNull
	private LocalDateTime endDate;
	@NotNull
	private double startPrice;
	@NotNull
	private double currentHighestBid;
	private double minBidAmount;
	@NotNull
	@Enumerated(EnumType.STRING)
	private AuctionStatus status=AuctionStatus.UPCOMING;
}
