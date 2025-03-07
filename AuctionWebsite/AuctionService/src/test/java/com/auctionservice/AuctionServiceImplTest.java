package com.auctionservice;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.auctionservice.dto.ProductDTO;
import com.auctionservice.entity.Auction;
import com.auctionservice.entity.AuctionStatus;
import com.auctionservice.exception.AuctionNotFoundException;
import com.auctionservice.feign.ProductClient;
import com.auctionservice.repository.AuctionRepository;
import com.auctionservice.service.AuctionServiceImpl;

@SpringBootTest
class AuctionServiceImplTest {

	@Mock
	private AuctionRepository auctionRepository;

	@Mock
	private ProductClient productClient;

	@InjectMocks
	private AuctionServiceImpl auctionService;

	@BeforeEach
	void setUp() {
		MockitoAnnotations.openMocks(this);
	}

	// Positive Test Cases
	@Test
	void testCreateAuction() {
		Auction auction = new Auction();
		auction.setProductId(1);
		ProductDTO productDTO = new ProductDTO();
		when(productClient.getByProductId(1)).thenReturn(productDTO);
		when(auctionRepository.save(auction)).thenReturn(auction);

		String result = auctionService.createAuction(auction);

		assertEquals("Auction Created", result);
		verify(auctionRepository, times(1)).save(auction);
	}

	@Test
	void testUpdateAuction() {
		Auction auction = new Auction();
		auction.setProductId(1);
		when(auctionRepository.findById(1)).thenReturn(Optional.of(auction));
		when(auctionRepository.save(auction)).thenReturn(auction);

		Auction updatedAuction = auctionService.updateAuction(1, auction);

		assertEquals(auction, updatedAuction);
		verify(auctionRepository, times(1)).save(auction);
	}

	@Test
	void testGetAuctionById() {
		Auction auction = new Auction();
		when(auctionRepository.findById(1)).thenReturn(Optional.of(auction));

		Auction result = auctionService.getAuctionById(1);

		assertEquals(auction, result);
	}

	@Test
	void testDeleteAuction() {
		doNothing().when(auctionRepository).deleteById(1);

		String result = auctionService.deleteAuction(1);

		assertEquals("Auction Successfully Deleted", result);
		verify(auctionRepository, times(1)).deleteById(1);
	}

	@Test
	void testEndAuction() {
		Auction auction = new Auction();
		when(auctionRepository.findById(1)).thenReturn(Optional.of(auction));
		when(auctionRepository.save(auction)).thenReturn(auction);

		String result = auctionService.endAuction(1);

		assertEquals("Auction Ended", result);
		assertEquals(AuctionStatus.ENDED, auction.getStatus());
		verify(auctionRepository, times(1)).save(auction);
	}

	@Test
	void testStartAuction() {
		Auction auction = new Auction();
		when(auctionRepository.findById(1)).thenReturn(Optional.of(auction));
		when(auctionRepository.save(auction)).thenReturn(auction);

		String result = auctionService.startAuction(1);

		assertEquals("Auction Started", result);
		assertEquals(AuctionStatus.LIVE, auction.getStatus());
		verify(auctionRepository, times(1)).save(auction);
	}

	// Negative Test Cases
	@Test
	void testUpdateAuction_AuctionNotFoundException() {
		Auction auction = new Auction();
		when(auctionRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(AuctionNotFoundException.class, () -> auctionService.updateAuction(1, auction));
	}

	@Test
	void testGetAuctionById_AuctionNotFoundException() {
		when(auctionRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(AuctionNotFoundException.class, () -> auctionService.getAuctionById(1));
	}

	@Test
	void testDeleteAuction_AuctionNotFoundException() {
		doThrow(new AuctionNotFoundException("Auction with id:1 does not exist")).when(auctionRepository).deleteById(1);

		assertThrows(AuctionNotFoundException.class, () -> auctionService.deleteAuction(1));
	}

	@Test
	void testEndAuction_AuctionNotFoundException() {
		when(auctionRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(AuctionNotFoundException.class, () -> auctionService.endAuction(1));
	}

	@Test
	void testStartAuction_AuctionNotFoundException() {
		when(auctionRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(AuctionNotFoundException.class, () -> auctionService.startAuction(1));
	}
}