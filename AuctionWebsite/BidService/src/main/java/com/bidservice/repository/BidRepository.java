package com.bidservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bidservice.entity.Bid;

public interface BidRepository extends JpaRepository<Bid, Integer> {
	List<Bid> findAllByAuctionId(int auctionId);
	Bid findByBidAmount(double amount);
}
