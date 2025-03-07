/*
 * package com.auctionservice;
 * 
 * import static org.junit.jupiter.api.Assertions.assertEquals; import static
 * org.mockito.Mockito.times; import static org.mockito.Mockito.verify; import
 * static org.mockito.Mockito.when;
 * 
 * import java.time.LocalDateTime; import java.util.Arrays; import
 * java.util.List;
 * 
 * import org.junit.jupiter.api.BeforeEach; import org.junit.jupiter.api.Test;
 * import org.mockito.InjectMocks; import org.mockito.Mock; import
 * org.mockito.MockitoAnnotations; import
 * org.springframework.boot.test.context.SpringBootTest;
 * 
 * import com.auctionservice.entity.Auction; import
 * com.auctionservice.entity.AuctionStatus; import
 * com.auctionservice.repository.AuctionRepository; import
 * com.auctionservice.service.AuctionSchedulerImpl;
 * 
 * @SpringBootTest class AuctionSchedulerImplTest {
 * 
 * @Mock private AuctionRepository auctionRepository;
 * 
 * @InjectMocks private AuctionSchedulerImpl auctionScheduler;
 * 
 * @BeforeEach public void setUp() { MockitoAnnotations.openMocks(this); }
 * 
 * @Test void testStartAuctions() { // Arrange LocalDateTime now =
 * LocalDateTime.now(); Auction auction1 = new Auction(1, 101, now.minusDays(2),
 * now.plusDays(1), 50.0, 75.0, 5.0, AuctionStatus.UPCOMING); Auction auction2 =
 * new Auction(2, 102, now.minusHours(1), now.plusHours(1), 100.0, 150.0, 10.0,
 * AuctionStatus.UPCOMING); List<Auction> upcomingAuctions =
 * Arrays.asList(auction1, auction2);
 * 
 * when(auctionRepository.findByStatus(AuctionStatus.UPCOMING)).thenReturn(
 * upcomingAuctions);
 * 
 * // Act auctionScheduler.startAuctions();
 * 
 * // Assert assertEquals(AuctionStatus.LIVE, auction1.getStatus());
 * assertEquals(AuctionStatus.LIVE, auction2.getStatus());
 * verify(auctionRepository, times(1)).save(auction1); verify(auctionRepository,
 * times(1)).save(auction2); }
 * 
 * @Test void testEndAuctions() { // Arrange LocalDateTime now =
 * LocalDateTime.now(); Auction auction1 = new Auction(1, 101, now.minusDays(2),
 * now.minusDays(1), 50.0, 75.0, 5.0, AuctionStatus.LIVE); Auction auction2 =
 * new Auction(2, 102, now.minusDays(1), now.minusHours(1), 100.0, 150.0, 10.0,
 * AuctionStatus.LIVE); List<Auction> ongoingAuctions = Arrays.asList(auction1,
 * auction2);
 * 
 * when(auctionRepository.findByStatus(AuctionStatus.LIVE)).thenReturn(
 * ongoingAuctions);
 * 
 * // Act auctionScheduler.endAuctions();
 * 
 * // Assert assertEquals(AuctionStatus.ENDED, auction1.getStatus());
 * assertEquals(AuctionStatus.ENDED, auction2.getStatus());
 * verify(auctionRepository, times(1)).save(auction1); verify(auctionRepository,
 * times(1)).save(auction2); }
 * 
 * }
 */