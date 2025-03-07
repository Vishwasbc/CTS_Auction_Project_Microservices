package com.product.service;

import java.util.List;

import com.product.dto.ProductDTO;
import com.product.entity.Product;

public interface ProductService {

	List<Product> getAllProducts();

	Product getProductById(int id);

	Product saveProduct(Product product);

	String deleteProduct(int id);

	Product updateProduct(int id, Product product);

	ProductDTO getByProductId(int id);

	void setStatus(int id, String status);

}
