package com.commercebank.www.repository;

import com.commercebank.www.domain.Beneficiary;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Beneficiary entity.
 */
@JaversSpringDataAuditable
public interface BeneficiaryRepository extends MongoRepository<Beneficiary,String> {

}
