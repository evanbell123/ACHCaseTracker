package com.commercebank.www.repository;

import com.commercebank.www.domain.GovRec;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the GovRec entity.
 */
public interface GovRecRepository extends MongoRepository<GovRec,String> {

}
