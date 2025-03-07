package com.auctionservice.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.auctionservice.dto.AuctionDTO;
import com.auctionservice.entity.Auction;
import com.auctionservice.service.AuctionService;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

/**
 * Controller class for managing auction-related operations.
 */
@RestController
@RequestMapping("/auction")
@AllArgsConstructor
public class AuctionController {
	private AuctionService auctionService;

	/**
	 * Creates a new auction.
	 * 
	 * @param auction the auction details to create
	 * @return a ResponseEntity containing the creation status and HTTP status
	 *         CREATED
	 */
	@PostMapping("/create")
	public ResponseEntity<String> createAuction(@RequestBody Auction auction) {
		return new ResponseEntity<>(auctionService.createAuction(auction), HttpStatus.CREATED);
	}

	/**
	 * Updates an existing auction.
	 * 
	 * @param id      the ID of the auction to update
	 * @param auction the updated auction details
	 * @return a ResponseEntity containing the updated auction
	 */
	@PutMapping("/update")
	public ResponseEntity<Auction> updateAuction(@RequestParam int id, @RequestBody Auction auction) {
		return ResponseEntity.ok(auctionService.updateAuction(id, auction));
	}

	/**
	 * Retrieves all auctions.
	 * 
	 * @return a ResponseEntity containing a list of all auctions
	 */
	@GetMapping("/all")
	public ResponseEntity<List<Auction>> getAllAuction() {
		return ResponseEntity.ok(auctionService.getAllAuction());
	}

	/**
	 * Retrieves an auction by its ID.
	 * 
	 * @param id the ID of the auction to retrieve
	 * @return a ResponseEntity containing the auction details
	 */
	@GetMapping
	public ResponseEntity<Auction> getAuctionById(@RequestParam int id) {
		return ResponseEntity.ok(auctionService.getAuctionById(id));
	}

	/**
	 * Deletes an auction by its ID.
	 * 
	 * @param id the ID of the auction to delete
	 * @return a ResponseEntity containing the deletion status
	 */
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteAuction(@RequestParam int id) {
		return ResponseEntity.ok(auctionService.deleteAuction(id));
	}

	/**
	 * Starts an auction by its ID.
	 * 
	 * @param id the ID of the auction to start
	 * @return a ResponseEntity containing the start status
	 */
	@PostMapping("/start")
	public ResponseEntity<String> startAuction(@RequestParam int id) {
		return ResponseEntity.ok(auctionService.startAuction(id));
	}

	/**
	 * Ends an auction by its ID.
	 * 
	 * @param id the ID of the auction to end
	 * @return a ResponseEntity containing the end status
	 */
	@PostMapping("/end")
	public ResponseEntity<String> endAuction(@RequestParam int id) {
		return ResponseEntity.ok(auctionService.endAuction(id));
	}

	/**
	 * Retrieves auction details by its ID.
	 * 
	 * @param id the ID of the auction to retrieve
	 * @return the auction details as an AuctionDTO
	 */
	@GetMapping("/{id}")
	public AuctionDTO getByAuctionId(@PathVariable int id) {
		return auctionService.getByAuctionId(id);
	}

	/**
	 * Updates the highest bid for an auction.
	 * 
	 * @param id    the ID of the auction
	 * @param price the new highest bid price
	 */
	@PostMapping("/{id}/{price}")
	public void updateHighestBid(@PathVariable int id, @PathVariable double price) {
		auctionService.updateHighestBid(id, price);
	}
}
