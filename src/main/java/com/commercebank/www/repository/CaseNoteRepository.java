package com.commercebank.www.repository;

import com.commercebank.www.domain.CaseNote;

import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the CaseNote entity.
 */
@JaversSpringDataAuditable
public interface CaseNoteRepository extends MongoRepository<CaseNote,String> {

}
