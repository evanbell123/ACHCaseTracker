package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.ACHCase;
import com.commercebank.www.domain.GovRec;
import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.repository.ACHCaseRepository;
import com.commercebank.www.repository.GovRecRepository;
import com.commercebank.www.security.SecurityUtils;
import com.commercebank.www.service.ACHCaseService;
import com.commercebank.www.web.rest.util.HeaderUtil;
import com.commercebank.www.web.rest.util.PaginationUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

import static com.commercebank.www.AchCaseTrackingApp.NACHA_DIR_NAME;

/**
 * REST controller for managing ACHCase.
 */
@RestController
@RequestMapping("/api")
public class ACHCaseResource {

    private final Logger log = LoggerFactory.getLogger(ACHCaseResource.class);

    @Inject
    private ACHCaseRepository achCaseRepository;

    @Inject
    private GovRecRepository govRecRepository;

    @Inject
    private ACHCaseService achCaseService;

    /**
     * POST  /ach-case : Create a new achCase.
     *
     * @param achCase the achCase to create
     * @return the ResponseEntity with status 201 (Created) and with body the new achCase, or with status 400 (Bad Request) if the achCase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/ach-case",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> createACHCase(@Valid @RequestBody ACHCase achCase) throws URISyntaxException {
        log.debug("REST request to save achCase : {}", achCase);
        if (achCase.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("achCase", "idexists", "A new achCase cannot already have an ID")).body(null);
        }
        //achCase result = achCaseRepository.save(achCase);
        achCase.setStatus(Status.OPEN);
        ACHCase result = achCaseService.cascadeSave(achCase);
        return ResponseEntity.created(new URI("/api/ach-case/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("achCase", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /ach-case : Updates an existing achCase.
     *
     * @param achCase the achCase to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated achCase,
     * or with status 400 (Bad Request) if the achCase is not valid,
     * or with status 500 (Internal Server Error) if the achCase couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/ach-case",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> updateACHCase(@Valid @RequestBody ACHCase achCase) throws URISyntaxException {
        log.debug("REST request to update achCase : {}", achCase);
        if (achCase.getId() == null) { return createACHCase(achCase); }
        //achCase.setStatus(Status.IN_PROGRESS);
        ACHCase result = achCaseService.cascadeSave(achCase);
        //achCase result = achCaseRepository.save(achCase);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("achCase", achCase.getId().toString()))
            .body(result);
    }

    /**
     * GET  /ach-case : get all the ACHCases.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of ACHCases in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/ach-case",
        method = RequestMethod.GET, params = {"status", "fromDate, toDate"},
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ACHCase>> getAllACHCases(Pageable pageable, @RequestParam(value = "status") Status status,
                                                                            @RequestParam(value = "fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                                             @RequestParam(value = "toDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate)
        throws URISyntaxException {
        log.debug("REST request to get a page of ACHCases");
        Page<ACHCase> page;
        if (status == null)
            page = achCaseRepository.findAllByStatusNotAndCreatedDateBetweenOrderBySlaDeadlineAsc(Status.CLOSED, fromDate, toDate, pageable);
        else
            page = achCaseRepository.findAllByStatusAndCreatedDateBetweenOrderBySlaDeadlineAsc(status, toDate, fromDate, pageable);

        page.forEach(achCase ->  achCase.setDaysOpen(achCase.getCreatedDate().until(ZonedDateTime.now(), ChronoUnit.DAYS)));
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/ach-case");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /ach-case/:id : get the "id" ACHCase.
     *
     * @param id the id of the ACHCase to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the ACHCase, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/ach-case/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<ACHCase> getACHCase(@PathVariable String id) {
        log.debug("REST request to get ACHCase : {}", id);
        ACHCase ACHCase = achCaseRepository.findOne(id);
        return Optional.ofNullable(ACHCase)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /ach-case/:id : delete the "id" ACHCase.
     *
     * @param id the id of the ACHCase to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/ach-case/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteACHCase(@PathVariable String id) {
        log.debug("REST request to delete ACHCase : {}", id);
        //achCaseRepository.delete(id);
        ACHCase achCase = achCaseRepository.findOne(id);
        if (!achCaseService.closeCase(achCase)) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("ACH Case", "invalid", "Required fields are missing or have invalid values.")).body(null);
        }
        return ResponseEntity.ok().headers(HeaderUtil.createEntityClosedAlert("ACH Case", id.toString())).build();
    }

    /**
     * GET  /my-cases : get all the ACH Cases that belong to the current user.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of ACHCases in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/my-cases",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<ACHCase>> getMyACHCases(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of ACHCases");
        Page<ACHCase> page = achCaseRepository.findByAssignedToAndStatusNot(SecurityUtils.getCurrentUserLogin(), Status.CLOSED, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/my-cases");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * POST  /import : Import a NACHA file to be processed
     *
     * @param request the file to be added
     * @return the ResponseEntity with status 201 (Created) and with body the new achCase, or with status 400 (Bad Request) if the achCase has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/import",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity importNachaFile(MultipartHttpServletRequest request) throws URISyntaxException {
        log.debug("REST request to import a NACHA file : {}", request);
        try {
                Iterator<String> itr = request.getFileNames();

                while (itr.hasNext()) {
                    String uploadedFile = itr.next();
                    MultipartFile file = request.getFile(uploadedFile);
                    File destination = new File(NACHA_DIR_NAME + "\\" + file.getOriginalFilename() + "\\" + LocalDate.now());
                    file.transferTo(destination);
                }
            }

        catch (Exception e) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("NACHA File", "invalid", e.getMessage())).body(null);
        }
        return ResponseEntity.accepted()
            .headers(HeaderUtil.createAlert("Nacha file imported", ""))
            .body("");
    }
}
