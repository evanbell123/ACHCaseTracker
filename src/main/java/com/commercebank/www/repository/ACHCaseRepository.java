package com.commercebank.www.repository;

import com.commercebank.www.domain.ACHCase;

import com.commercebank.www.domain.User;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * Spring Data MongoDB repository for the ACHCase entity.
 */

@JaversSpringDataAuditable
public interface ACHCaseRepository extends MongoRepository<ACHCase,String>
{
    Page<ACHCase> findByAssignedTo(String assignedTo, Pageable pageable);
}

