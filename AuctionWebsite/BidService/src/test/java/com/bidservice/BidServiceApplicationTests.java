package com.bidservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.bidservice.dto.AuctionDto;
import com.bidservice.dto.UserDto;
import com.bidservice.entity.Bid;
import com.bidservice.exception.InvalidBidAmountException;
import com.bidservice.feign.AuctionClient;
import com.bidservice.feign.UserClient;
import com.bidservice.repository.BidRepository;
import com.bidservice.service.BidServiceImpl;

@SpringBootTest
class BidServiceImplTest {

	@Mock
	private BidRepository bidRepository;

	@Mock
	private UserClient userClient;

	@Mock
	private AuctionClient auctionClient;

	@InjectMocks
	private BidServiceImpl bidService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	@Test
	void testPlaceBid_ValidBid() {
		Bid bid = new Bid();
		bid.setBidderName("testUser");
		bid.setAuctionId(1);
		bid.setBidAmount(150.0);

		UserDto userDto = new UserDto();
		userDto.setUserName("testUser");

		AuctionDto auctionDto = new AuctionDto();
		auctionDto.setAuctionId(1);
		auctionDto.setCurrentHighestBid(100.0);
		auctionDto.setMinBidAmount(10.0);

		when(userClient.getByUserName("testUser")).thenReturn(userDto);
		when(auctionClient.getAuctionById(1)).thenReturn(auctionDto);
		when(bidRepository.save(bid)).thenReturn(bid);

		Bid result = bidService.placeBid(bid);

		assertEquals(bid, result);
		verify(auctionClient).updateHighestBid(1, 150.0);
	}

	@Test
	void testPlaceBid_InvalidBidAmount() {
		Bid bid = new Bid();
		bid.setBidderName("testUser");
		bid.setAuctionId(1);
		bid.setBidAmount(105.0);

		UserDto userDto = new UserDto();
		userDto.setUserName("testUser");

		AuctionDto auctionDto = new AuctionDto();
		auctionDto.setAuctionId(1);
		auctionDto.setCurrentHighestBid(100.0);
		auctionDto.setMinBidAmount(10.0);

		when(userClient.getByUserName("testUser")).thenReturn(userDto);
		when(auctionClient.getAuctionById(1)).thenReturn(auctionDto);

		assertThrows(InvalidBidAmountException.class, () -> bidService.placeBid(bid));
	}

	@Test
	void testGetBidsByAuction() {
		Bid bid1 = new Bid();
		bid1.setAuctionId(1);
		Bid bid2 = new Bid();
		bid2.setAuctionId(1);

		List<Bid> bids = Arrays.asList(bid1, bid2);

		when(bidRepository.findAllByAuctionId(1)).thenReturn(bids);

		List<Bid> result = bidService.getBidsByAuction(1);

		assertEquals(bids, result);
	}

	@Test
	void testGetHighestBid() {
		AuctionDto auctionDto = new AuctionDto();
		auctionDto.setCurrentHighestBid(200.0);

		when(auctionClient.getAuctionById(1)).thenReturn(auctionDto);

		double result = bidService.getHighestBid(1);

		assertEquals(200.0, result);
	}
}