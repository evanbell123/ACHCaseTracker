package com.commercebank.www.repository;

import com.commercebank.www.domain.Beneficiary;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Beneficiary entity.
 */
public interface BeneficiaryRepository extends MongoRepository<Beneficiary,String> {

}
