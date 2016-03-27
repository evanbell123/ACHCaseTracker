package com.commercebank.www.repository;

import com.commercebank.www.domain.CaseNote;

import org.springframework.data.mongodb.repository.MongoRepository;

/**
 * Spring Data MongoDB repository for the CaseNote entity.
 */
public interface CaseNoteRepository extends MongoRepository<CaseNote,String> {

}
