package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.SLA;
import com.commercebank.www.repository.SLARepository;
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
 * REST controller for managing SLA.
 */
@RestController
@RequestMapping("/api")
public class SLAResource {

    private final Logger log = LoggerFactory.getLogger(SLAResource.class);

    @Inject
    private SLARepository slaRepository;

    /**
     * POST  /sla : Create a new SLA.
     *
     * @param SLA the SLA to create
     * @return the ResponseEntity with status 201 (Created) and with body the new SLA, or with status 400 (Bad Request) if the SLA has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/sla",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> createSLA(@Valid @RequestBody SLA SLA) throws URISyntaxException {
        log.debug("REST request to save SLA : {}", SLA);
        if (SLA.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("SLA", "idexists", "A new SLA cannot already have an ID")).body(null);
        }
        SLA result = slaRepository.save(SLA);
        return ResponseEntity.created(new URI("/api/sla/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("SLA", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /sla : Updates an existing SLA.
     *
     * @param SLA the SLA to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated SLA,
     * or with status 400 (Bad Request) if the SLA is not valid,
     * or with status 500 (Internal Server Error) if the SLA couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/sla",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> updateSLA(@Valid @RequestBody SLA SLA) throws URISyntaxException {
        log.debug("REST request to update SLA : {}", SLA);
        if (SLA.getId() == null) {
            return createSLA(SLA);
        }
        SLA result = slaRepository.save(SLA);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("SLA", SLA.getId().toString()))
            .body(result);
    }

    /**
     * GET  /sla : get all the SLAs.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of SLAs in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/sla",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SLA>> getAllSLAS(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of SLAS");
        Page<SLA> page = slaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/sla");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /sla/:id : get the "id" SLA.
     *
     * @param id the id of the SLA to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the SLA, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/sla/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> getSLA(@PathVariable String id) {
        log.debug("REST request to get sla : {}", id);
        SLA sla = slaRepository.findOne(id);
        return Optional.ofNullable(sla)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /sla/:id : delete the "id" SLA.
     *
     * @param id the id of the SLA to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/sla/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSLA(@PathVariable String id) {
        log.debug("REST request to delete SLA : {}", id);
        slaRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("SLA", id.toString())).build();
    }

}
