package com.bidservice.dto;

import lombok.Data;

@Data
public class UserDto {
	private String userName;
	private String firstName;
	private String lastName;
	private String email;
	private String role;
}
