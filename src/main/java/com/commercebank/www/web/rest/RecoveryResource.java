package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.Recovery;
import com.commercebank.www.repository.RecoveryRepository;
import com.commercebank.www.web.rest.util.HeaderUtil;
import com.commercebank.www.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Recovery.
 */
@RestController
@RequestMapping("/api")
public class RecoveryResource {

    private final Logger log = LoggerFactory.getLogger(RecoveryResource.class);
        
    @Inject
    private RecoveryRepository recoveryRepository;
    
    /**
     * POST  /recoveries : Create a new recovery.
     *
     * @param recovery the recovery to create
     * @return the ResponseEntity with status 201 (Created) and with body the new recovery, or with status 400 (Bad Request) if the recovery has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/recoveries",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Recovery> createRecovery(@Valid @RequestBody Recovery recovery) throws URISyntaxException {
        log.debug("REST request to save Recovery : {}", recovery);
        if (recovery.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("recovery", "idexists", "A new recovery cannot already have an ID")).body(null);
        }
        Recovery result = recoveryRepository.save(recovery);
        return ResponseEntity.created(new URI("/api/recoveries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("recovery", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /recoveries : Updates an existing recovery.
     *
     * @param recovery the recovery to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated recovery,
     * or with status 400 (Bad Request) if the recovery is not valid,
     * or with status 500 (Internal Server Error) if the recovery couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/recoveries",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Recovery> updateRecovery(@Valid @RequestBody Recovery recovery) throws URISyntaxException {
        log.debug("REST request to update Recovery : {}", recovery);
        if (recovery.getId() == null) {
            return createRecovery(recovery);
        }
        Recovery result = recoveryRepository.save(recovery);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("recovery", recovery.getId().toString()))
            .body(result);
    }

    /**
     * GET  /recoveries : get all the recoveries.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of recoveries in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/recoveries",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Recovery>> getAllRecoveries(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Recoveries");
        Page<Recovery> page = recoveryRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/recoveries");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /recoveries/:id : get the "id" recovery.
     *
     * @param id the id of the recovery to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the recovery, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/recoveries/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Recovery> getRecovery(@PathVariable String id) {
        log.debug("REST request to get Recovery : {}", id);
        Recovery recovery = recoveryRepository.findOne(id);
        return Optional.ofNullable(recovery)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /recoveries/:id : delete the "id" recovery.
     *
     * @param id the id of the recovery to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/recoveries/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteRecovery(@PathVariable String id) {
        log.debug("REST request to delete Recovery : {}", id);
        recoveryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("recovery", id.toString())).build();
    }

}
