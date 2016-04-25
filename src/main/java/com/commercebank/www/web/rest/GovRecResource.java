package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.GovRec;
import com.commercebank.www.repository.GovRecRepository;
import com.commercebank.www.service.GovRecService;
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
 * REST controller for managing GovRec.
 */
@RestController
@RequestMapping("/api")
public class GovRecResource {

    private final Logger log = LoggerFactory.getLogger(GovRecResource.class);

    @Inject
    private GovRecRepository govRecRepository;

    @Inject
    private GovRecService govRecService;

    /**
     * POST  /gov-recs : Create a new govRec.
     *
     * @param govRec the govRec to create
     * @return the ResponseEntity with status 201 (Created) and with body the new govRec, or with status 400 (Bad Request) if the govRec has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/gov-recs",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<GovRec> createGovRec(@Valid @RequestBody GovRec govRec) throws URISyntaxException {
        log.debug("REST request to save GovRec : {}", govRec);
        if (govRec.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("govRec", "idexists", "A new govRec cannot already have an ID")).body(null);
        }
        //GovRec result = govRecRepository.save(govRec);
        GovRec result = govRecService.cascadeSave(govRec);
        return ResponseEntity.created(new URI("/api/gov-recs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("govRec", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /gov-recs : Updates an existing govRec.
     *
     * @param govRec the govRec to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated govRec,
     * or with status 400 (Bad Request) if the govRec is not valid,
     * or with status 500 (Internal Server Error) if the govRec couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/gov-recs",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<GovRec> updateGovRec(@Valid @RequestBody GovRec govRec) throws URISyntaxException {
        log.debug("REST request to update GovRec : {}", govRec);
        if (govRec.getId() == null) {
            return createGovRec(govRec);
        }
        //GovRec result = govRecRepository.save(govRec);
        GovRec result = govRecService.cascadeSave(govRec);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("govRec", govRec.getId().toString()))
            .body(result);
    }

    /**
     * GET  /gov-recs : get all the govRecs.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of govRecs in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/gov-recs",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<GovRec>> getAllGovRecs(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of GovRecs");
        Page<GovRec> page = govRecRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/gov-recs");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /gov-recs/:id : get the "id" govRec.
     *
     * @param id the id of the govRec to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the govRec, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/gov-recs/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<GovRec> getGovRec(@PathVariable String id) {
        log.debug("REST request to get GovRec : {}", id);
        GovRec govRec = govRecRepository.findOne(id);
        return Optional.ofNullable(govRec)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /gov-recs/:id : delete the "id" govRec.
     *
     * @param id the id of the govRec to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/gov-recs/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteGovRec(@PathVariable String id) {
        log.debug("REST request to delete GovRec : {}", id);
        govRecRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("govRec", id.toString())).build();
    }

}
