package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.GovRec;
import com.commercebank.www.repository.GovRecRepository;

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

import com.commercebank.www.domain.enumeration.CaseSubtype;

/**
 * Test class for the GovRecResource REST controller.
 *
 * @see GovRecResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class GovRecResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneId.of("Z"));

    private static final String DEFAULT_CLAIM_NUMBER = "AAAAA";
    private static final String UPDATED_CLAIM_NUMBER = "BBBBB";

    private static final ZonedDateTime DEFAULT_COMPLETED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_COMPLETED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_COMPLETED_ON_STR = dateTimeFormatter.format(DEFAULT_COMPLETED_ON);

    private static final ZonedDateTime DEFAULT_VERIFIED_ON = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_VERIFIED_ON = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_VERIFIED_ON_STR = dateTimeFormatter.format(DEFAULT_VERIFIED_ON);

    private static final BigDecimal DEFAULT_PAYMENT_TOTAL = new BigDecimal(1);
    private static final BigDecimal UPDATED_PAYMENT_TOTAL = new BigDecimal(2);

    private static final Long DEFAULT_PAYMENT_COUNT = 0L;
    private static final Long UPDATED_PAYMENT_COUNT = 1L;

    private static final CaseSubtype DEFAULT_SUBTYPE = CaseSubtype.GOV_REC;
    private static final CaseSubtype UPDATED_SUBTYPE = CaseSubtype.POA;

    @Inject
    private GovRecRepository govRecRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restGovRecMockMvc;

    private GovRec govRec;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        GovRecResource govRecResource = new GovRecResource();
        ReflectionTestUtils.setField(govRecResource, "govRecRepository", govRecRepository);
        this.restGovRecMockMvc = MockMvcBuilders.standaloneSetup(govRecResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        govRecRepository.deleteAll();
        govRec = new GovRec();
        govRec.setClaimNumber(DEFAULT_CLAIM_NUMBER);
        govRec.setCompletedOn(DEFAULT_COMPLETED_ON);
        govRec.setVerifiedOn(DEFAULT_VERIFIED_ON);
        govRec.setPaymentTotal(DEFAULT_PAYMENT_TOTAL);
        govRec.setPaymentCount(DEFAULT_PAYMENT_COUNT);
        govRec.setSubtype(DEFAULT_SUBTYPE);
    }

    @Test
    public void createGovRec() throws Exception {
        int databaseSizeBeforeCreate = govRecRepository.findAll().size();

        // Create the GovRec

        restGovRecMockMvc.perform(post("/api/gov-recs")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(govRec)))
                .andExpect(status().isCreated());

        // Validate the GovRec in the database
        List<GovRec> govRecs = govRecRepository.findAll();
        assertThat(govRecs).hasSize(databaseSizeBeforeCreate + 1);
        GovRec testGovRec = govRecs.get(govRecs.size() - 1);
        assertThat(testGovRec.getClaimNumber()).isEqualTo(DEFAULT_CLAIM_NUMBER);
        assertThat(testGovRec.getCompletedOn()).isEqualTo(DEFAULT_COMPLETED_ON);
        assertThat(testGovRec.getVerifiedOn()).isEqualTo(DEFAULT_VERIFIED_ON);
        assertThat(testGovRec.getPaymentTotal()).isEqualTo(DEFAULT_PAYMENT_TOTAL);
        assertThat(testGovRec.getPaymentCount()).isEqualTo(DEFAULT_PAYMENT_COUNT);
        assertThat(testGovRec.getSubtype()).isEqualTo(DEFAULT_SUBTYPE);
    }

    @Test
    public void checkSubtypeIsRequired() throws Exception {
        int databaseSizeBeforeTest = govRecRepository.findAll().size();
        // set the field null
        govRec.setSubtype(null);

        // Create the GovRec, which fails.

        restGovRecMockMvc.perform(post("/api/gov-recs")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(govRec)))
                .andExpect(status().isBadRequest());

        List<GovRec> govRecs = govRecRepository.findAll();
        assertThat(govRecs).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllGovRecs() throws Exception {
        // Initialize the database
        govRecRepository.save(govRec);

        // Get all the govRecs
        restGovRecMockMvc.perform(get("/api/gov-recs?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(govRec.getId())))
                .andExpect(jsonPath("$.[*].claimNumber").value(hasItem(DEFAULT_CLAIM_NUMBER.toString())))
                .andExpect(jsonPath("$.[*].completedOn").value(hasItem(DEFAULT_COMPLETED_ON_STR)))
                .andExpect(jsonPath("$.[*].verifiedOn").value(hasItem(DEFAULT_VERIFIED_ON_STR)))
                .andExpect(jsonPath("$.[*].paymentTotal").value(hasItem(DEFAULT_PAYMENT_TOTAL.intValue())))
                .andExpect(jsonPath("$.[*].paymentCount").value(hasItem(DEFAULT_PAYMENT_COUNT.intValue())))
                .andExpect(jsonPath("$.[*].subtype").value(hasItem(DEFAULT_SUBTYPE.toString())));
    }

    @Test
    public void getGovRec() throws Exception {
        // Initialize the database
        govRecRepository.save(govRec);

        // Get the govRec
        restGovRecMockMvc.perform(get("/api/gov-recs/{id}", govRec.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(govRec.getId()))
            .andExpect(jsonPath("$.claimNumber").value(DEFAULT_CLAIM_NUMBER.toString()))
            .andExpect(jsonPath("$.completedOn").value(DEFAULT_COMPLETED_ON_STR))
            .andExpect(jsonPath("$.verifiedOn").value(DEFAULT_VERIFIED_ON_STR))
            .andExpect(jsonPath("$.paymentTotal").value(DEFAULT_PAYMENT_TOTAL.intValue()))
            .andExpect(jsonPath("$.paymentCount").value(DEFAULT_PAYMENT_COUNT.intValue()))
            .andExpect(jsonPath("$.subtype").value(DEFAULT_SUBTYPE.toString()));
    }

    @Test
    public void getNonExistingGovRec() throws Exception {
        // Get the govRec
        restGovRecMockMvc.perform(get("/api/gov-recs/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateGovRec() throws Exception {
        // Initialize the database
        govRecRepository.save(govRec);
        int databaseSizeBeforeUpdate = govRecRepository.findAll().size();

        // Update the govRec
        GovRec updatedGovRec = new GovRec();
        updatedGovRec.setId(govRec.getId());
        updatedGovRec.setClaimNumber(UPDATED_CLAIM_NUMBER);
        updatedGovRec.setCompletedOn(UPDATED_COMPLETED_ON);
        updatedGovRec.setVerifiedOn(UPDATED_VERIFIED_ON);
        updatedGovRec.setPaymentTotal(UPDATED_PAYMENT_TOTAL);
        updatedGovRec.setPaymentCount(UPDATED_PAYMENT_COUNT);
        updatedGovRec.setSubtype(UPDATED_SUBTYPE);

        restGovRecMockMvc.perform(put("/api/gov-recs")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedGovRec)))
                .andExpect(status().isOk());

        // Validate the GovRec in the database
        List<GovRec> govRecs = govRecRepository.findAll();
        assertThat(govRecs).hasSize(databaseSizeBeforeUpdate);
        GovRec testGovRec = govRecs.get(govRecs.size() - 1);
        assertThat(testGovRec.getClaimNumber()).isEqualTo(UPDATED_CLAIM_NUMBER);
        assertThat(testGovRec.getCompletedOn()).isEqualTo(UPDATED_COMPLETED_ON);
        assertThat(testGovRec.getVerifiedOn()).isEqualTo(UPDATED_VERIFIED_ON);
        assertThat(testGovRec.getPaymentTotal()).isEqualTo(UPDATED_PAYMENT_TOTAL);
        assertThat(testGovRec.getPaymentCount()).isEqualTo(UPDATED_PAYMENT_COUNT);
        assertThat(testGovRec.getSubtype()).isEqualTo(UPDATED_SUBTYPE);
    }

    @Test
    public void deleteGovRec() throws Exception {
        // Initialize the database
        govRecRepository.save(govRec);
        int databaseSizeBeforeDelete = govRecRepository.findAll().size();

        // Get the govRec
        restGovRecMockMvc.perform(delete("/api/gov-recs/{id}", govRec.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<GovRec> govRecs = govRecRepository.findAll();
        assertThat(govRecs).hasSize(databaseSizeBeforeDelete - 1);
    }
}
