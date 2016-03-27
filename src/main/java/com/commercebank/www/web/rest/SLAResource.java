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
    private SLARepository sLARepository;
    
    /**
     * POST  /s-las : Create a new sLA.
     *
     * @param sLA the sLA to create
     * @return the ResponseEntity with status 201 (Created) and with body the new sLA, or with status 400 (Bad Request) if the sLA has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/s-las",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> createSLA(@Valid @RequestBody SLA sLA) throws URISyntaxException {
        log.debug("REST request to save SLA : {}", sLA);
        if (sLA.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("sLA", "idexists", "A new sLA cannot already have an ID")).body(null);
        }
        SLA result = sLARepository.save(sLA);
        return ResponseEntity.created(new URI("/api/s-las/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("sLA", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /s-las : Updates an existing sLA.
     *
     * @param sLA the sLA to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated sLA,
     * or with status 400 (Bad Request) if the sLA is not valid,
     * or with status 500 (Internal Server Error) if the sLA couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/s-las",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> updateSLA(@Valid @RequestBody SLA sLA) throws URISyntaxException {
        log.debug("REST request to update SLA : {}", sLA);
        if (sLA.getId() == null) {
            return createSLA(sLA);
        }
        SLA result = sLARepository.save(sLA);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("sLA", sLA.getId().toString()))
            .body(result);
    }

    /**
     * GET  /s-las : get all the sLAS.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of sLAS in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/s-las",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<SLA>> getAllSLAS(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of SLAS");
        Page<SLA> page = sLARepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/s-las");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /s-las/:id : get the "id" sLA.
     *
     * @param id the id of the sLA to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the sLA, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/s-las/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<SLA> getSLA(@PathVariable String id) {
        log.debug("REST request to get SLA : {}", id);
        SLA sLA = sLARepository.findOne(id);
        return Optional.ofNullable(sLA)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /s-las/:id : delete the "id" sLA.
     *
     * @param id the id of the sLA to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/s-las/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteSLA(@PathVariable String id) {
        log.debug("REST request to delete SLA : {}", id);
        sLARepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("sLA", id.toString())).build();
    }

}
