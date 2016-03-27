package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.ACHCase;
import com.commercebank.www.repository.ACHCaseRepository;
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
 * REST controller for managing ACHCase.
 */
@RestController
@RequestMapping("/api")
public class ACHCaseResource {

    private final Logger log = LoggerFactory.getLogger(ACHCaseResource.class);
        
    @Inject
    private ACHCaseRepository aCHCaseRepository;
    
    /**
     * POST  /a-ch-cases : Create a new aCHCase.
     *
     * @param aCHCase the aCHCase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new aCHCase, or with status 400 (Bad Request) if the aCHCase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/a-ch-cases",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> createACHCase(@Valid @RequestBody ACHCase aCHCase) throws URISyntaxException {
        log.debug("REST request to save ACHCase : {}", aCHCase);
        if (aCHCase.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("aCHCase", "idexists", "A new aCHCase cannot already have an ID")).body(null);
        }
        ACHCase result = aCHCaseRepository.save(aCHCase);
        return ResponseEntity.created(new URI("/api/a-ch-cases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("aCHCase", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /a-ch-cases : Updates an existing aCHCase.
     *
     * @param aCHCase the aCHCase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated aCHCase,
     * or with status 400 (Bad Request) if the aCHCase is not valid,
     * or with status 500 (Internal Server Error) if the aCHCase couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/a-ch-cases",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> updateACHCase(@Valid @RequestBody ACHCase aCHCase) throws URISyntaxException {
        log.debug("REST request to update ACHCase : {}", aCHCase);
        if (aCHCase.getId() == null) {
            return createACHCase(aCHCase);
        }
        ACHCase result = aCHCaseRepository.save(aCHCase);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("aCHCase", aCHCase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /a-ch-cases : get all the aCHCases.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of aCHCases in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/a-ch-cases",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ACHCase>> getAllACHCases(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of ACHCases");
        Page<ACHCase> page = aCHCaseRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/a-ch-cases");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /a-ch-cases/:id : get the "id" aCHCase.
     *
     * @param id the id of the aCHCase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the aCHCase, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/a-ch-cases/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> getACHCase(@PathVariable String id) {
        log.debug("REST request to get ACHCase : {}", id);
        ACHCase aCHCase = aCHCaseRepository.findOne(id);
        return Optional.ofNullable(aCHCase)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /a-ch-cases/:id : delete the "id" aCHCase.
     *
     * @param id the id of the aCHCase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/a-ch-cases/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteACHCase(@PathVariable String id) {
        log.debug("REST request to delete ACHCase : {}", id);
        aCHCaseRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("aCHCase", id.toString())).build();
    }

}
