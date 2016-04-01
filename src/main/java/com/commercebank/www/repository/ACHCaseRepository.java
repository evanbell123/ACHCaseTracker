package com.commercebank.www.repository;

import com.commercebank.www.domain.ACHCase;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the ACHCase entity.
 */
@JaversSpringDataAuditable
public interface ACHCaseRepository extends MongoRepository<ACHCase,String>
{
}
