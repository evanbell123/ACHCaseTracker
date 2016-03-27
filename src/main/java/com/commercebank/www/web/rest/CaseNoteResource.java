package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.domain.CaseNote;
import com.commercebank.www.repository.CaseNoteRepository;
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
 * REST controller for managing CaseNote.
 */
@RestController
@RequestMapping("/api")
public class CaseNoteResource {

    private final Logger log = LoggerFactory.getLogger(CaseNoteResource.class);
        
    @Inject
    private CaseNoteRepository caseNoteRepository;
    
    /**
     * POST  /case-notes : Create a new caseNote.
     *
     * @param caseNote the caseNote to create
     * @return the ResponseEntity with status 201 (Created) and with body the new caseNote, or with status 400 (Bad Request) if the caseNote has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/case-notes",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CaseNote> createCaseNote(@RequestBody CaseNote caseNote) throws URISyntaxException {
        log.debug("REST request to save CaseNote : {}", caseNote);
        if (caseNote.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("caseNote", "idexists", "A new caseNote cannot already have an ID")).body(null);
        }
        CaseNote result = caseNoteRepository.save(caseNote);
        return ResponseEntity.created(new URI("/api/case-notes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("caseNote", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /case-notes : Updates an existing caseNote.
     *
     * @param caseNote the caseNote to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated caseNote,
     * or with status 400 (Bad Request) if the caseNote is not valid,
     * or with status 500 (Internal Server Error) if the caseNote couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/case-notes",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CaseNote> updateCaseNote(@RequestBody CaseNote caseNote) throws URISyntaxException {
        log.debug("REST request to update CaseNote : {}", caseNote);
        if (caseNote.getId() == null) {
            return createCaseNote(caseNote);
        }
        CaseNote result = caseNoteRepository.save(caseNote);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("caseNote", caseNote.getId().toString()))
            .body(result);
    }

    /**
     * GET  /case-notes : get all the caseNotes.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of caseNotes in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/case-notes",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<CaseNote>> getAllCaseNotes(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of CaseNotes");
        Page<CaseNote> page = caseNoteRepository.findAll(pageable); 
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/case-notes");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /case-notes/:id : get the "id" caseNote.
     *
     * @param id the id of the caseNote to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the caseNote, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/case-notes/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CaseNote> getCaseNote(@PathVariable String id) {
        log.debug("REST request to get CaseNote : {}", id);
        CaseNote caseNote = caseNoteRepository.findOne(id);
        return Optional.ofNullable(caseNote)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /case-notes/:id : delete the "id" caseNote.
     *
     * @param id the id of the caseNote to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/case-notes/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCaseNote(@PathVariable String id) {
        log.debug("REST request to delete CaseNote : {}", id);
        caseNoteRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("caseNote", id.toString())).build();
    }

}
