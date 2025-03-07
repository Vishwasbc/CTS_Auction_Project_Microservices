// src/services/auctionService.js

import apiClient from '../api/apiClient';

const auctionService = {
  getAllAuctions: () => apiClient.get('/auction/all'),
  getAuctionById: (id) => apiClient.get(`/auction/${id}`),
  createAuction: (auctionData) => apiClient.post('/auction/create', auctionData),
  updateAuction: (id, auctionData) => apiClient.put('/auction/update', auctionData, { params: { id } }),
  deleteAuction: (id) => apiClient.delete('/auction/delete', { params: { id } }),
  startAuction: (id) => apiClient.post('/auction/start', null, { params: { id } }),
  endAuction: (id) => apiClient.post('/auction/end', null, { params: { id } }),
  updateHighestBid: (id, price) => apiClient.post(`/auction/${id}/${price}`)
};

export default auctionService;
