package com.commercebank.www.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.commercebank.www.repository.ACHCaseRepository;
import com.commercebank.www.repository.GovRecRepository;
import com.commercebank.www.web.rest.dto.DashboardDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.inject.Inject;
import java.net.URISyntaxException;
import java.time.LocalDate;

@RestController
@RequestMapping(value = "/api/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
public class DashboardResource {
    private final Logger log = LoggerFactory.getLogger(UserResource.class);

    @Inject
    private ACHCaseRepository achCaseRepository;

    /**
     * GET  /dashboard : get an object with totals for the dashboard.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of AuditEvents in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(method = RequestMethod.GET, params = {"fromDate", "toDate"})
    @Timed
    public ResponseEntity<DashboardDTO> getTotals(@RequestParam(value = "fromDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fromDate,
                                                      @RequestParam(value = "toDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate toDate) throws URISyntaxException
    {
        log.debug("REST request to get dashboard totals. ");

        DashboardDTO totals = new DashboardDTO();
        totals.setCreatedCount(achCaseRepository.countByCreatedDateBetween(fromDate, toDate));
        totals.setClosedCount(achCaseRepository.countByCompletedOnBetween(fromDate, toDate));
        totals.setPaymentsReturned(achCaseRepository.countByTotalAmountBetween(fromDate, toDate));
        totals.setSlaAverage(new Long(0));

        return new ResponseEntity<DashboardDTO>(totals, HttpStatus.OK);
    }
}
