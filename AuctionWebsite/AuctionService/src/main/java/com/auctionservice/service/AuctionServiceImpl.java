package com.auctionservice.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.auctionservice.dto.AuctionDTO;
import com.auctionservice.dto.ProductDTO;
import com.auctionservice.entity.Auction;
import com.auctionservice.entity.AuctionStatus;
import com.auctionservice.exception.AuctionNotFoundException;
import com.auctionservice.exception.InvalidProductException;
import com.auctionservice.feign.ProductClient;
import com.auctionservice.repository.AuctionRepository;

import lombok.AllArgsConstructor;

/**
 * Service implementation class for managing auction-related operations.
 */
@Service
@AllArgsConstructor
public class AuctionServiceImpl implements AuctionService {
	private AuctionRepository auctionRepository;
	private ProductClient productClient;

	/**
	 * Creates a new auction.
	 * 
	 * @param auction the auction details to create
	 * @return a message indicating the creation status
	 */
	@Override
	public String createAuction(Auction auction) {
		ProductDTO product = productClient.getByProductId(auction.getProductId());
		if(!product.getStatus().equals("PENDING")) {
			throw new InvalidProductException("Product "+product.getProductId()+" is already up for auction");
		}
		auctionRepository.save(auction);
		productClient.setUpdatedStatus(auction.getProductId(),"ACTIVE");
		return "Auction Created";
	}

	/**
	 * Updates an existing auction.
	 * 
	 * @param id      the ID of the auction to update
	 * @param auction the updated auction details
	 * @return the updated auction
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public Auction updateAuction(int id, Auction auction) {
		Auction existingAuction = auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));

		existingAuction.setProductId(auction.getProductId());
		existingAuction.setStartDate(auction.getStartDate());
		existingAuction.setEndDate(auction.getEndDate());
		existingAuction.setStartPrice(auction.getStartPrice());
		existingAuction.setCurrentHighestBid(auction.getCurrentHighestBid());
		existingAuction.setMinBidAmount(auction.getMinBidAmount());
		existingAuction.setStatus(auction.getStatus());

		return auctionRepository.save(existingAuction);
	}

	/**
	 * Retrieves all auctions.
	 * 
	 * @return a list of all auctions
	 */
	@Override
	public List<Auction> getAllAuction() {
		return auctionRepository.findAll();
	}

	/**
	 * Retrieves an auction by its ID.
	 * 
	 * @param id the ID of the auction to retrieve
	 * @return the auction details
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public Auction getAuctionById(int id) {
		return auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));
	}

	/**
	 * Deletes an auction by its ID.
	 * 
	 * @param id the ID of the auction to delete
	 * @return a message indicating the deletion status
	 */
	@Override
	public String deleteAuction(int id) {
		auctionRepository.deleteById(id);
		return "Auction Successfully Deleted";
	}

	/**
	 * Ends an ongoing auction by its ID.
	 * 
	 * @param id the ID of the auction to end
	 * @return a message indicating the end status
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public String endAuction(int id) {
		Auction ongoingAuction = auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));
		ongoingAuction.setStatus(AuctionStatus.ENDED);
		if(ongoingAuction.getCurrentHighestBid()>0) {
        	productClient.setUpdatedStatus(ongoingAuction.getProductId(),"SOLD");
        }else {
        	productClient.setUpdatedStatus(ongoingAuction.getProductId(),"UNSOLD");
        }
		auctionRepository.save(ongoingAuction);
		return "Auction Ended";
	}

	/**
	 * Starts an auction by its ID.
	 * 
	 * @param id the ID of the auction to start
	 * @return a message indicating the start status
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public String startAuction(int id) {
		Auction existingAuction = auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));
		existingAuction.setStatus(AuctionStatus.LIVE);
		auctionRepository.save(existingAuction);
		return "Auction Started";
	}

	/**
	 * Retrieves auction details by its ID.
	 * 
	 * @param id the ID of the auction to retrieve
	 * @return the auction details as an AuctionDTO
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public AuctionDTO getByAuctionId(int id) {
		Auction auction = auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));
		AuctionDTO auctionDTO = new AuctionDTO();
		auctionDTO.setAuctionId(auction.getAuctionId());
		auctionDTO.setProductId(auction.getProductId());
		auctionDTO.setStartDate(auction.getStartDate());
		auctionDTO.setEndDate(auction.getEndDate());
		auctionDTO.setStartPrice(auction.getStartPrice());
		auctionDTO.setCurrentHighestBid(auction.getCurrentHighestBid());
		auctionDTO.setMinBidAmount(auction.getMinBidAmount());
		auctionDTO.setStatus(auction.getStatus().name());
		return auctionDTO;
	}

	/**
	 * Updates the highest bid for an auction.
	 * 
	 * @param id    the ID of the auction
	 * @param price the new highest bid price
	 * @throws AuctionNotFound if the auction is not found
	 */
	@Override
	public void updateHighestBid(int id, double price) {
		Auction auction = auctionRepository.findById(id)
				.orElseThrow(() -> new AuctionNotFoundException("Auction with id:" + id + " does not exist"));
		auction.setCurrentHighestBid(price);
		auctionRepository.save(auction);
	}
}
