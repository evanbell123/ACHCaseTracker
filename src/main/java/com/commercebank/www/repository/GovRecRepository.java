package com.commercebank.www.repository;

import com.commercebank.www.domain.GovRec;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the GovRec entity.
 */
@JaversSpringDataAuditable
public interface GovRecRepository extends MongoRepository<GovRec,String> {

}
