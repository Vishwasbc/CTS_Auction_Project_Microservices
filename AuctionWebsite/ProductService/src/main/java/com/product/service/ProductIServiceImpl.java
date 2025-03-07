package com.product.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.product.dto.ProductDTO;
import com.product.entity.Product;
import com.product.entity.Status;
import com.product.exception.InvalidUserException;
import com.product.exception.ProductNotFoundException;
import com.product.repository.ProductRepository;

import lombok.AllArgsConstructor;

/**
 * Service implementation class for managing product-related operations.
 */
@Service
@AllArgsConstructor
public class ProductIServiceImpl implements ProductService {
	private ProductRepository productRepository;

	/**
	 * Retrieves all products.
	 * 
	 * @return a list of all products
	 */
	@Override
	public List<Product> getAllProducts() {
		return productRepository.findAll();
	}

	/**
	 * Retrieves a product by its ID.
	 * 
	 * @param id the ID of the product to retrieve
	 * @return the product details
	 * @throws ProductNotFoundException if the product is not found
	 */
	@Override
	public Product getProductById(int id) {
		return productRepository.findById(id)
				.orElseThrow(() -> new ProductNotFoundException("Product with id:" + id + " not Found"));
	}

	/**
	 * Saves a new product.
	 * 
	 * @param product the product details to save
	 * @throws InvalidUserException if user is not a seller
	 * @return the saved product
	 */
	@Override
	public Product saveProduct(Product product) {
		return productRepository.save(product);
	}

	/**
	 * Deletes a product by its ID.
	 * 
	 * @param id the ID of the product to delete
	 * @return a message indicating the deletion status
	 */
	@Override
	public String deleteProduct(int id) {
		productRepository.deleteById(id);
		return "Product Deleted";
	}

	/**
	 * Updates an existing product.
	 * 
	 * @param id      the ID of the product to update
	 * @param product the updated product details
	 * @throws InvalidUserException if user is not a seller
	 * @return the updated product
	 */
	@Override
	public Product updateProduct(int id, Product product) {
		Product update = new Product();
		update.setProductId(id);
		update.setProductName(product.getProductName());
		update.setProductDescription(product.getProductDescription());
		update.setPrice(product.getPrice());
		update.setStatus(product.getStatus());
		update.setSellerName(product.getSellerName());
		return productRepository.save(update);
	}

	/**
	 * Retrieves product details by its ID.
	 * 
	 * @param id the ID of the product to retrieve
	 * @return the product details as a ProductDTO
	 * @throws ProductNotFoundException if the product is not found
	 */
	@Override
	public ProductDTO getByProductId(int id) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ProductNotFoundException("Product with id:" + id + " not Found"));
		ProductDTO productDTO = new ProductDTO();
		productDTO.setProductId(product.getProductId());
		productDTO.setProductName(product.getProductName());
		productDTO.setProductDescription(product.getProductDescription());
		productDTO.setPrice(product.getPrice());
		productDTO.setSellerName(product.getSellerName());
		productDTO.setStatus(product.getStatus().name());
		return productDTO;
	}

	@Override
	public void setStatus(int id, String status) {
		Product product = productRepository.findById(id)
				.orElseThrow(() -> new ProductNotFoundException("Product with id:" + id + " not Found"));
		product.setStatus(Status.valueOf(status));
		productRepository.save(product);
	}
}
