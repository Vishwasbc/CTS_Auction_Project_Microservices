package com.bidservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bidservice.dto.AuctionDto;
import com.bidservice.dto.UserDto;
import com.bidservice.entity.Bid;
import com.bidservice.exception.AuctionNotStartedException;
import com.bidservice.exception.InvalidBidAmountException;
import com.bidservice.exception.InvalidBidderException;
import com.bidservice.feign.AuctionClient;
import com.bidservice.feign.UserClient;
import com.bidservice.repository.BidRepository;

import lombok.AllArgsConstructor;

/**
 * Service implementation class for managing bid-related operations.
 */
@Service
@AllArgsConstructor
public class BidServiceImpl implements BidService {
    private BidRepository bidRepository;
    private UserClient userClient;
    private AuctionClient auctionClient;

    /**
     * Places a new bid.
     * 
     * @param bid the bid details to place
     * @return the placed bid
     * @throws InvalidBidderException if the bidder is not found
     * @throws AuctionNotFoundException if the auction is not found
     * @throws InvalidBidderException if the user is not a bidder
     * @throws InvalidBidAmountException if the bid amount is invalid
     */
    @Override
    public Bid placeBid(Bid bid) {

        // Validate auction
        AuctionDto auction = auctionClient.getAuctionById(bid.getAuctionId());

        // Check bid validity
        if (bid.getBidAmount() < auction.getCurrentHighestBid() + auction.getMinBidAmount()) {
            throw new InvalidBidAmountException("Invalid Bid Amount");
        }
        auctionClient.updateHighestBid(bid.getAuctionId(), bid.getBidAmount());
        return bidRepository.save(bid);
    }

    /**
     * Retrieves all bids for a specific auction.
     * 
     * @param auctionId the ID of the auction
     * @return a list of bids for the auction
     */
    @Override
    public List<Bid> getBidsByAuction(int auctionId) {
        return bidRepository.findAllByAuctionId(auctionId);
    }

    /**
     * Retrieves the highest bid for a specific auction.
     * 
     * @param auctionId the ID of the auction
     * @return the highest bid amount
     */
    @Override
    public double getHighestBid(int auctionId) {
        return auctionClient.getAuctionById(auctionId).getCurrentHighestBid();
    }
    /**
     * Retrieves the highest bidder and bid for a specific auction.
     * 
     * @param auctionId the ID of the auction.
     * @throws AuctionNotStartedException if the auction is yet to start.
     * @return the highest bidder.
     */
	@Override
	public Bid getHighestBidder(int auctionId) {
		AuctionDto auction=auctionClient.getAuctionById(auctionId);
		if(auction.getStatus().equalsIgnoreCase("upcoming")) {
			throw new AuctionNotStartedException("Auction has not yet Started");
		}
		double bid=auction.getCurrentHighestBid();
		return bidRepository.findByBidAmount(bid);
	}
}
