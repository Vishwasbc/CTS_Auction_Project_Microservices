package com.bidservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bidservice.entity.Bid;
import com.bidservice.service.BidService;

import lombok.AllArgsConstructor;

/**
 * Controller class for managing bid-related operations.
 */
@RestController
@RequestMapping("/bids")
@AllArgsConstructor
public class BidController {
    private BidService bidService;

    /**
     * Places a new bid.
     * 
     * @param bid the bid details to place
     * @return a ResponseEntity containing the placed bid
     */
    @PostMapping
    public ResponseEntity<Bid> placeBid(@RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.placeBid(bid));
    }

    /**
     * Retrieves all bids for a specific auction.
     * 
     * @param auctionId the ID of the auction
     * @return a ResponseEntity containing a list of bids for the auction
     */
    @GetMapping("/{auctionId}")
    public ResponseEntity<List<Bid>> getBidsByAuction(@PathVariable int auctionId) {
        return ResponseEntity.ok(bidService.getBidsByAuction(auctionId));
    }

    /**
     * Retrieves the highest bid for a specific auction.
     * 
     * @param auctionId the ID of the auction
     * @return a ResponseEntity containing the highest bid amount
     */
    @GetMapping("/highest")
    public ResponseEntity<Double> getHighestBid(@RequestParam int auctionId) {
        return ResponseEntity.ok(bidService.getHighestBid(auctionId));
    }
    /**
     * Retrieves the highest bidder for a specific auction after it is completed.
     * 
     * @param auctionId the ID of the auction
     * @return a ResponseEntity containing the highest bidder and the bid.
     */
    @GetMapping
    public ResponseEntity<Bid> getHighestBidder(@RequestParam int auctionId){
    	return ResponseEntity.ok(bidService.getHighestBidder(auctionId));
    }
}
