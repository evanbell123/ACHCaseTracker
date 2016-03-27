package com.commercebank.www.repository;

import com.commercebank.www.domain.SLA;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the SLA entity.
 */
public interface SLARepository extends MongoRepository<SLA,String> {

}
