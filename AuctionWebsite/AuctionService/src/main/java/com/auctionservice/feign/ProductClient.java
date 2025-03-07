package com.auctionservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.auctionservice.dto.ProductDTO;

@FeignClient("PRODUCTSERVICE")
public interface ProductClient {
	@GetMapping("/product/{id}")
	ProductDTO getByProductId(@PathVariable int id);
	@PostMapping("/product/{productId}/{status}")
	void setUpdatedStatus(@PathVariable int productId,@PathVariable String status);
}
