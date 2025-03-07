package com.product.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
	private int productId;
	private String productName;
	private String productDescription;
	private double price;
	private String sellerName;
	private String status;
}
