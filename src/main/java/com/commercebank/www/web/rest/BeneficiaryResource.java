package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.Beneficiary;
import com.commercebank.www.repository.BeneficiaryRepository;
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
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Beneficiary.
 */
@RestController
@RequestMapping("/api")
public class BeneficiaryResource {

    private final Logger log = LoggerFactory.getLogger(BeneficiaryResource.class);

    @Inject
    private BeneficiaryRepository beneficiaryRepository;

    /**
     * POST  /beneficiaries : Create a new beneficiary.
     *
     * @param beneficiary the beneficiary to create
     * @return the ResponseEntity with status 201 (Created) and with body the new beneficiary, or with status 400 (Bad Request) if the beneficiary has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/beneficiaries",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Beneficiary> createBeneficiary(@RequestBody Beneficiary beneficiary) throws URISyntaxException {
        log.debug("REST request to save Beneficiary : {}", beneficiary);
        if (beneficiary.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("beneficiary", "idexists", "A new beneficiary cannot already have an ID")).body(null);
        }
        Beneficiary result = beneficiaryRepository.save(beneficiary);
        return ResponseEntity.created(new URI("/api/beneficiaries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("beneficiary", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /beneficiaries : Updates an existing beneficiary.
     *
     * @param beneficiary the beneficiary to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated beneficiary,
     * or with status 400 (Bad Request) if the beneficiary is not valid,
     * or with status 500 (Internal Server Error) if the beneficiary couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/beneficiaries",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Beneficiary> updateBeneficiary(@RequestBody Beneficiary beneficiary) throws URISyntaxException {
        log.debug("REST request to update Beneficiary : {}", beneficiary);
        if (beneficiary.getId() == null) {
            return createBeneficiary(beneficiary);
        }
        Beneficiary result = beneficiaryRepository.save(beneficiary);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("beneficiary", beneficiary.getId().toString()))
            .body(result);
    }

    /**
     * GET  /beneficiaries : get all the beneficiaries.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of beneficiaries in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/beneficiaries",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<Beneficiary>> getAllBeneficiaries(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Beneficiaries");
        Page<Beneficiary> page = beneficiaryRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/beneficiaries");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /beneficiaries/:id : get the "id" beneficiary.
     *
     * @param id the id of the beneficiary to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the beneficiary, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/beneficiaries/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Beneficiary> getBeneficiary(@PathVariable String id) {
        log.debug("REST request to get Beneficiary : {}", id);
        Beneficiary beneficiary = beneficiaryRepository.findOne(id);
        return Optional.ofNullable(beneficiary)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /beneficiaries/:id : delete the "id" beneficiary.
     *
     * @param id the id of the beneficiary to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/beneficiaries/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteBeneficiary(@PathVariable String id) {
        log.debug("REST request to delete Beneficiary : {}", id);
        beneficiaryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("beneficiary", id.toString())).build();
    }

}
