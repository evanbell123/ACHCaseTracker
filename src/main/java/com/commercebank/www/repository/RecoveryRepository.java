package com.commercebank.www.repository;

import com.commercebank.www.domain.Recovery;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the Recovery entity.
 */
@JaversSpringDataAuditable
public interface RecoveryRepository extends MongoRepository<Recovery,String> {

}
