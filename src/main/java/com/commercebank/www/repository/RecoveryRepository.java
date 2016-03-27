package com.commercebank.www.repository;

import com.commercebank.www.domain.Recovery;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Recovery entity.
 */
public interface RecoveryRepository extends MongoRepository<Recovery,String> {

}
