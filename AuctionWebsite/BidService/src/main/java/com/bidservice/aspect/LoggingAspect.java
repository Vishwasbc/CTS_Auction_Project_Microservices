package com.bidservice.aspect;

import java.util.Arrays;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
	private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

	// Pointcut to match all methods in the service, repository, and controller
	// layers
	@Pointcut("execution(* com.bidservice..*(..))")
	public void applicationMethods() {
	}

	// Before method execution
	@Before("applicationMethods()")
	public void logBefore(JoinPoint joinPoint) {
		logger.info("Entering: {} with arguments = {}", joinPoint.getSignature(), Arrays.toString(joinPoint.getArgs()));
	}

	// After successful method execution
	@AfterReturning(pointcut = "applicationMethods()", returning = "result")
	public void logAfterReturning(JoinPoint joinPoint, Object result) {
		logger.info("Exiting: {} with result = {}", joinPoint.getSignature(), result);
	}

	// After method execution (whether successful or exception)
	@After("applicationMethods()")
	public void logAfter(JoinPoint joinPoint) {
		logger.info("Method executed: {}", joinPoint.getSignature());
	}

	// After method throws an exception
	@AfterThrowing(pointcut = "applicationMethods()", throwing = "ex")
	public void logAfterThrowing(JoinPoint joinPoint, Throwable ex) {
		logger.error("Exception in {} with cause = {}", joinPoint.getSignature(), ex.getMessage());
	}
}
