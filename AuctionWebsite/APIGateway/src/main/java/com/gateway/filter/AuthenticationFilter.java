package com.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;

import com.gateway.util.JwtUtil;
import com.google.common.net.HttpHeaders;

import reactor.core.publisher.Mono;

@Component
public class AuthenticationFilter extends AbstractGatewayFilterFactory<AuthenticationFilter.Config> {

	private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

	@Autowired
	private RouteValidator validator;

	@Autowired
	private JwtUtil util;

	public static class Config {
	}

	public AuthenticationFilter() {
		super(Config.class);
	}

	@Override
	public GatewayFilter apply(Config config) {
		return (exchange, chain) -> {
			if (validator.isSecured.test(exchange.getRequest())) {
				if (!exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
					return handleUnauthorized(exchange.getResponse(), "Missing authorization header");
				}

				String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
				if (authHeader != null && authHeader.startsWith("Bearer ")) {
					authHeader = authHeader.substring(7);
				}

				try {
					String role = util.extractRolesFromToken(authHeader);
					String requestedPath = exchange.getRequest().getPath().toString();
					String method = exchange.getRequest().getMethod().name();

					if (!isAuthorized(role, requestedPath, method)) {
						return handleUnauthorized(exchange.getResponse(), "Unauthorized access");
					}

				} catch (Exception e) {
					return handleUnauthorized(exchange.getResponse(), "Invalid token");
				}
			}
			return chain.filter(exchange);
		};
	}

	private boolean isAuthorized(String role, String path, String method) {
		logger.info("Role: {}, Path: {}, Method: {}", role, path, method);
		if ("ADMIN".equalsIgnoreCase(role)) {
			return path.startsWith("/user") || path.startsWith("/product") || path.startsWith("/auction")
					|| path.startsWith("/bids");
		} else if ("BIDDER".equalsIgnoreCase(role)) {
			return (path.startsWith("/auction") && method.equalsIgnoreCase("GET"))
					|| (path.startsWith("/product") && method.equalsIgnoreCase("GET")) || path.startsWith("bids")
					|| (path.startsWith("/user") && (!method.equalsIgnoreCase("DELETE")))
					|| (path.startsWith("/bids")&&method.equalsIgnoreCase("GET")||method.equalsIgnoreCase("POST"));
		} else if ("SELLER".equalsIgnoreCase(role)) {
			return (path.startsWith("/user") && (method.equalsIgnoreCase("GET") || method.equalsIgnoreCase("PUT")))
					|| (path.startsWith("/product") && (!method.equalsIgnoreCase("DELETE")))
					|| (path.startsWith("/auction") && method.equalsIgnoreCase("GET"))
					|| (path.startsWith("/bids") && method.equalsIgnoreCase("GET"));
		}
		return false;
	}

	private Mono<Void> handleUnauthorized(ServerHttpResponse response, String message) {
		response.setStatusCode(HttpStatus.FORBIDDEN);
		response.getHeaders().add("Error-Message", message);
		return response.setComplete();
	}
}
