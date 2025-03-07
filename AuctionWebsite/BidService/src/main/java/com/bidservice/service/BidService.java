package com.bidservice.service;

import java.util.List;

import com.bidservice.entity.Bid;

public interface BidService {
	Bid placeBid(Bid bid);

	List<Bid> getBidsByAuction(int auctionId);

	double getHighestBid(int auctionId);

	Bid getHighestBidder(int auctionId);
}
