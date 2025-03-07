package com.auctionservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.auctionservice.entity.Auction;
import com.auctionservice.entity.AuctionStatus;

public interface AuctionRepository extends JpaRepository<Auction, Integer>{

	List<Auction> findByStatus(AuctionStatus upcoming);

}
