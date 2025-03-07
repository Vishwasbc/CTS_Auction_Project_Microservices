package com.bidservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
public class Bid {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	@NotNull
	private String bidderName;
	@NotNull
	private int auctionId;
	@NotNull
	private double bidAmount;
	@Column(nullable = false,updatable = false)
	private LocalDateTime bidTime=LocalDateTime.now();
}
