import apiClient from '../api/apiClient';

const bidService = {
    placeBid: (bidData) => apiClient.post('/bids', bidData),
    getBidsByAuction: (auctionId) => apiClient.get(`/bids/${auctionId}`),
    getHighestBid: (auctionId) => apiClient.get('/bids/highest', { params: { auctionId } }),
    getHighestBidder: (auctionId) => apiClient.get('/bids', { params: { auctionId } })
};

export default bidService;
