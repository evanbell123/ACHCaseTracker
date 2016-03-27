package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.ACHCase;
import com.commercebank.www.repository.ACHCaseRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.domain.enumeration.CaseType;

/**
 * Test class for the ACHCaseResource REST controller.
 *
 * @see ACHCaseResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class ACHCaseResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneId.of("Z"));


    private static final BigDecimal DEFAULT_TOTAL_AMOUNT = new BigDecimal(1);
    private static final BigDecimal UPDATED_TOTAL_AMOUNT = new BigDecimal(2);

    private static final Status DEFAULT_STATUS = Status.OPEN;
    private static final Status UPDATED_STATUS = Status.IN_PROGRESS;

    private static final ZonedDateTime DEFAULT_LAST_PAYMENT_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_LAST_PAYMENT_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_LAST_PAYMENT_ON_STR = dateTimeFormatter.format(DEFAULT_LAST_PAYMENT_ON);

    private static final ZonedDateTime DEFAULT_SLA_DEADLINE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_SLA_DEADLINE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_SLA_DEADLINE_STR = dateTimeFormatter.format(DEFAULT_SLA_DEADLINE);

    private static final Long DEFAULT_DAYS_OPEN = 0L;
    private static final Long UPDATED_DAYS_OPEN = 1L;

    private static final CaseType DEFAULT_TYPE = CaseType.DNE;
    private static final CaseType UPDATED_TYPE = CaseType.CRF;

    @Inject
    private ACHCaseRepository aCHCaseRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restACHCaseMockMvc;

    private ACHCase aCHCase;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        ACHCaseResource aCHCaseResource = new ACHCaseResource();
        ReflectionTestUtils.setField(aCHCaseResource, "aCHCaseRepository", aCHCaseRepository);
        this.restACHCaseMockMvc = MockMvcBuilders.standaloneSetup(aCHCaseResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        aCHCaseRepository.deleteAll();
        aCHCase = new ACHCase();
        aCHCase.setTotalAmount(DEFAULT_TOTAL_AMOUNT);
        aCHCase.setStatus(DEFAULT_STATUS);
        aCHCase.setLastPaymentOn(DEFAULT_LAST_PAYMENT_ON);
        aCHCase.setSlaDeadline(DEFAULT_SLA_DEADLINE);
        aCHCase.setDaysOpen(DEFAULT_DAYS_OPEN);
        aCHCase.setType(DEFAULT_TYPE);
    }

    @Test
    public void createACHCase() throws Exception {
        int databaseSizeBeforeCreate = aCHCaseRepository.findAll().size();

        // Create the ACHCase

        restACHCaseMockMvc.perform(post("/api/a-ch-cases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(aCHCase)))
                .andExpect(status().isCreated());

        // Validate the ACHCase in the database
        List<ACHCase> aCHCases = aCHCaseRepository.findAll();
        assertThat(aCHCases).hasSize(databaseSizeBeforeCreate + 1);
        ACHCase testACHCase = aCHCases.get(aCHCases.size() - 1);
        assertThat(testACHCase.getTotalAmount()).isEqualTo(DEFAULT_TOTAL_AMOUNT);
        assertThat(testACHCase.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testACHCase.getLastPaymentOn()).isEqualTo(DEFAULT_LAST_PAYMENT_ON);
        assertThat(testACHCase.getSlaDeadline()).isEqualTo(DEFAULT_SLA_DEADLINE);
        assertThat(testACHCase.getDaysOpen()).isEqualTo(DEFAULT_DAYS_OPEN);
        assertThat(testACHCase.getType()).isEqualTo(DEFAULT_TYPE);
    }

    @Test
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = aCHCaseRepository.findAll().size();
        // set the field null
        aCHCase.setStatus(null);

        // Create the ACHCase, which fails.

        restACHCaseMockMvc.perform(post("/api/a-ch-cases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(aCHCase)))
                .andExpect(status().isBadRequest());

        List<ACHCase> aCHCases = aCHCaseRepository.findAll();
        assertThat(aCHCases).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void checkTypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = aCHCaseRepository.findAll().size();
        // set the field null
        aCHCase.setType(null);

        // Create the ACHCase, which fails.

        restACHCaseMockMvc.perform(post("/api/a-ch-cases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(aCHCase)))
                .andExpect(status().isBadRequest());

        List<ACHCase> aCHCases = aCHCaseRepository.findAll();
        assertThat(aCHCases).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllACHCases() throws Exception {
        // Initialize the database
        aCHCaseRepository.save(aCHCase);

        // Get all the aCHCases
        restACHCaseMockMvc.perform(get("/api/a-ch-cases?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(aCHCase.getId())))
                .andExpect(jsonPath("$.[*].totalAmount").value(hasItem(DEFAULT_TOTAL_AMOUNT.intValue())))
                .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
                .andExpect(jsonPath("$.[*].lastPaymentOn").value(hasItem(DEFAULT_LAST_PAYMENT_ON_STR)))
                .andExpect(jsonPath("$.[*].slaDeadline").value(hasItem(DEFAULT_SLA_DEADLINE_STR)))
                .andExpect(jsonPath("$.[*].daysOpen").value(hasItem(DEFAULT_DAYS_OPEN.intValue())))
                .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())));
    }

    @Test
    public void getACHCase() throws Exception {
        // Initialize the database
        aCHCaseRepository.save(aCHCase);

        // Get the aCHCase
        restACHCaseMockMvc.perform(get("/api/a-ch-cases/{id}", aCHCase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(aCHCase.getId()))
            .andExpect(jsonPath("$.totalAmount").value(DEFAULT_TOTAL_AMOUNT.intValue()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.lastPaymentOn").value(DEFAULT_LAST_PAYMENT_ON_STR))
            .andExpect(jsonPath("$.slaDeadline").value(DEFAULT_SLA_DEADLINE_STR))
            .andExpect(jsonPath("$.daysOpen").value(DEFAULT_DAYS_OPEN.intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()));
    }

    @Test
    public void getNonExistingACHCase() throws Exception {
        // Get the aCHCase
        restACHCaseMockMvc.perform(get("/api/a-ch-cases/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateACHCase() throws Exception {
        // Initialize the database
        aCHCaseRepository.save(aCHCase);
        int databaseSizeBeforeUpdate = aCHCaseRepository.findAll().size();

        // Update the aCHCase
        ACHCase updatedACHCase = new ACHCase();
        updatedACHCase.setId(aCHCase.getId());
        updatedACHCase.setTotalAmount(UPDATED_TOTAL_AMOUNT);
        updatedACHCase.setStatus(UPDATED_STATUS);
        updatedACHCase.setLastPaymentOn(UPDATED_LAST_PAYMENT_ON);
        updatedACHCase.setSlaDeadline(UPDATED_SLA_DEADLINE);
        updatedACHCase.setDaysOpen(UPDATED_DAYS_OPEN);
        updatedACHCase.setType(UPDATED_TYPE);

        restACHCaseMockMvc.perform(put("/api/a-ch-cases")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedACHCase)))
                .andExpect(status().isOk());

        // Validate the ACHCase in the database
        List<ACHCase> aCHCases = aCHCaseRepository.findAll();
        assertThat(aCHCases).hasSize(databaseSizeBeforeUpdate);
        ACHCase testACHCase = aCHCases.get(aCHCases.size() - 1);
        assertThat(testACHCase.getTotalAmount()).isEqualTo(UPDATED_TOTAL_AMOUNT);
        assertThat(testACHCase.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testACHCase.getLastPaymentOn()).isEqualTo(UPDATED_LAST_PAYMENT_ON);
        assertThat(testACHCase.getSlaDeadline()).isEqualTo(UPDATED_SLA_DEADLINE);
        assertThat(testACHCase.getDaysOpen()).isEqualTo(UPDATED_DAYS_OPEN);
        assertThat(testACHCase.getType()).isEqualTo(UPDATED_TYPE);
    }

    @Test
    public void deleteACHCase() throws Exception {
        // Initialize the database
        aCHCaseRepository.save(aCHCase);
        int databaseSizeBeforeDelete = aCHCaseRepository.findAll().size();

        // Get the aCHCase
        restACHCaseMockMvc.perform(delete("/api/a-ch-cases/{id}", aCHCase.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<ACHCase> aCHCases = aCHCaseRepository.findAll();
        assertThat(aCHCases).hasSize(databaseSizeBeforeDelete - 1);
    }
}