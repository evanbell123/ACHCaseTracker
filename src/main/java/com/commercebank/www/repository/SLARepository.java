package com.commercebank.www.repository;

import com.commercebank.www.domain.SLA;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

/**
 * Spring Data MongoDB repository for the SLA entity.
 */
//@JaversSpringDataAuditable
public interface SLARepository extends MongoRepository<SLA,String>
{
    Optional<SLA> findOneById(String userId);
}
