import apiClient from '../api/apiClient';

const productService = {
    getAllProducts: () => apiClient.get('/product'),
    addProduct: (productData) => apiClient.post('/product', productData),
    getProductById: (productId) => apiClient.get(`/product/${productId}`),
    updateProduct: (productId, productData) =>
        apiClient.put('/product', productData, { params: { id: productId } })
};

export default productService;
