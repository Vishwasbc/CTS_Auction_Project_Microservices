package com.product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.product.dto.ProductDTO;
import com.product.entity.Product;
import com.product.service.ProductService;

import lombok.AllArgsConstructor;

/**
 * Controller class for managing product-related operations.
 */
@RestController
@RequestMapping("/product")
@AllArgsConstructor
public class ProductController {

    private ProductService productService;

    /**
     * Retrieves all products.
     * 
     * @return a ResponseEntity containing a list of all products
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /**
     * Retrieves a product by its ID.
     * 
     * @param id the ID of the product to retrieve
     * @return a ResponseEntity containing the product details
     */
    @GetMapping("/get")
    public ResponseEntity<Product> getProduct(@RequestParam int id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    /**
     * Saves a new product.
     * 
     * @param product the product details to save
     * @return a ResponseEntity containing the saved product and HTTP status CREATED
     */
    @PostMapping
    public ResponseEntity<Product> saveProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productService.saveProduct(product), HttpStatus.CREATED);
    }

    /**
     * Updates an existing product.
     * 
     * @param id the ID of the product to update
     * @param product the updated product details
     * @return a ResponseEntity containing the updated product
     */
    @PutMapping
    public ResponseEntity<Product> updateProduct(@RequestParam int id, @RequestBody Product product) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }

    /**
     * Deletes a product by its ID.
     * 
     * @param id the ID of the product to delete
     * @return a ResponseEntity containing the deletion status
     */
    @DeleteMapping
    public ResponseEntity<String> deleteProduct(@RequestParam int id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    /**
     * Retrieves product details by its ID.
     * 
     * @param id the ID of the product to retrieve
     * @return the product details as a ProductDTO
     */
    @GetMapping("{id}")
    public ProductDTO getByProductId(@PathVariable int id) {
        return productService.getByProductId(id);
    }
    @PostMapping("/{id}/{status}")
    public void setUpdatedStatus(@PathVariable int id,@PathVariable String status) {
    	productService.setStatus(id,status);
    }
}
