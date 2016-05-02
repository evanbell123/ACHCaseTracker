package com.commercebank.www.repository;

import com.commercebank.www.domain.Payment;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Payment entity.
 */
//@JaversSpringDataAuditable
public interface PaymentRepository extends MongoRepository<Payment,String> {

}
