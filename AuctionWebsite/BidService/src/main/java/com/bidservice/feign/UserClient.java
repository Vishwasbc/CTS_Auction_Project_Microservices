package com.bidservice.feign;
 
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bidservice.dto.UserDto;

 
@FeignClient("USERSERVICE")
public interface UserClient {
	@GetMapping("/user/{userName}")
	public UserDto getByUserName(@PathVariable String userName);
}