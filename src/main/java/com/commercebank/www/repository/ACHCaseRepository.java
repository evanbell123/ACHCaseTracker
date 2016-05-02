package com.commercebank.www.repository;

import com.commercebank.www.domain.ACHCase;

import com.commercebank.www.domain.enumeration.Status;
import org.javers.spring.annotation.JaversSpringDataAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;


/**
 * Spring Data MongoDB repository for the ACHCase entity.
 */

@JaversSpringDataAuditable
public interface ACHCaseRepository extends MongoRepository<ACHCase,String>
{
    Page<ACHCase> findByAssignedToAndStatusNot(String currentUserLogin, Status closed, Pageable pageable);

    Page<ACHCase> findAllByStatusNotOrderBySlaDeadlineAsc(Status closed, Pageable pageable);

    Set<ACHCase> findByCreatedDateBetweenOrCompletedOnBetween(LocalDateTime from1, LocalDateTime to1, LocalDateTime from2, LocalDateTime to2);

    Long countByTotalAmountGreaterThanAndCreatedDateBetweenOrCompletedOnBetween(double v, LocalDateTime from1, LocalDateTime to1, LocalDateTime from2, LocalDateTime to2);

    Long countByMissedSLACountGreaterThanAndCreatedDateBetweenOrCompletedOnBetween(int i, LocalDateTime from1, LocalDateTime to1, LocalDateTime from2, LocalDateTime to2);

    Long countByCreatedDateBetween(LocalDateTime from, LocalDateTime to);

    Long countByCompletedOnBetween(LocalDateTime from, LocalDateTime to);

    Page<ACHCase> findAllByStatusOrderBySlaDeadlineAsc(Status status, Pageable pageable);

    Page<ACHCase> findAllByStatusNotAndCreatedDateBetweenOrderBySlaDeadlineAsc(Status closed, LocalDate fromDate, LocalDate toDate, Pageable pageable);

    Page<ACHCase> findAllByStatusAndCreatedDateBetweenOrderBySlaDeadlineAsc(Status status, LocalDate toDate, LocalDate fromDate, Pageable pageable);
}

