package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.Beneficiary;
import com.commercebank.www.repository.BeneficiaryRepository;

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
import java.time.LocalDate;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.ZoneId;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the BeneficiaryResource REST controller.
 *
 * @see BeneficiaryResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class BeneficiaryResourceIntTest {

    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'").withZone(ZoneId.of("Z"));

    private static final String DEFAULT_CUSTOMERID = "AAAAA";
    private static final String UPDATED_CUSTOMERID = "BBBBB";
    private static final String DEFAULT_NAME = "AAAAA";
    private static final String UPDATED_NAME = "BBBBB";
    private static final String DEFAULT_SSN = "AAAAA";
    private static final String UPDATED_SSN = "BBBBB";

    private static final Long DEFAULT_ACCOUNT_NUM = 1L;
    private static final Long UPDATED_ACCOUNT_NUM = 2L;

    private static final LocalDate DEFAULT_DATE_OF_DEATH = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE_OF_DEATH = LocalDate.now(ZoneId.systemDefault());

    private static final ZonedDateTime DEFAULT_DATE_CB_AWARE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneId.systemDefault());
    private static final ZonedDateTime UPDATED_DATE_CB_AWARE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);
    private static final String DEFAULT_DATE_CB_AWARE_STR = dateTimeFormatter.format(DEFAULT_DATE_CB_AWARE);

    private static final Boolean DEFAULT_OTHER_GOV_BENEFITS = false;
    private static final Boolean UPDATED_OTHER_GOV_BENEFITS = true;

    @Inject
    private BeneficiaryRepository beneficiaryRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restBeneficiaryMockMvc;

    private Beneficiary beneficiary;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        BeneficiaryResource beneficiaryResource = new BeneficiaryResource();
        ReflectionTestUtils.setField(beneficiaryResource, "beneficiaryRepository", beneficiaryRepository);
        this.restBeneficiaryMockMvc = MockMvcBuilders.standaloneSetup(beneficiaryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        beneficiaryRepository.deleteAll();
        beneficiary = new Beneficiary();
        beneficiary.setCustomerID(DEFAULT_CUSTOMERID);
        beneficiary.setName(DEFAULT_NAME);
        beneficiary.setSSN(DEFAULT_SSN);
        beneficiary.setAccountNum(DEFAULT_ACCOUNT_NUM);
        beneficiary.setDateOfDeath(DEFAULT_DATE_OF_DEATH);
        beneficiary.setDateCBAware(DEFAULT_DATE_CB_AWARE);
        beneficiary.setOtherGovBenefits(DEFAULT_OTHER_GOV_BENEFITS);
    }

    @Test
    public void createBeneficiary() throws Exception {
        int databaseSizeBeforeCreate = beneficiaryRepository.findAll().size();

        // Create the Beneficiary

        restBeneficiaryMockMvc.perform(post("/api/beneficiaries")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(beneficiary)))
                .andExpect(status().isCreated());

        // Validate the Beneficiary in the database
        List<Beneficiary> beneficiaries = beneficiaryRepository.findAll();
        assertThat(beneficiaries).hasSize(databaseSizeBeforeCreate + 1);
        Beneficiary testBeneficiary = beneficiaries.get(beneficiaries.size() - 1);
        assertThat(testBeneficiary.getCustomerID()).isEqualTo(DEFAULT_CUSTOMERID);
        assertThat(testBeneficiary.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testBeneficiary.getSSN()).isEqualTo(DEFAULT_SSN);
        assertThat(testBeneficiary.getAccountNum()).isEqualTo(DEFAULT_ACCOUNT_NUM);
        assertThat(testBeneficiary.getDateOfDeath()).isEqualTo(DEFAULT_DATE_OF_DEATH);
        assertThat(testBeneficiary.getDateCBAware()).isEqualTo(DEFAULT_DATE_CB_AWARE);
        assertThat(testBeneficiary.isOtherGovBenefits()).isEqualTo(DEFAULT_OTHER_GOV_BENEFITS);
    }

    @Test
    public void getAllBeneficiaries() throws Exception {
        // Initialize the database
        beneficiaryRepository.save(beneficiary);

        // Get all the beneficiaries
        restBeneficiaryMockMvc.perform(get("/api/beneficiaries?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(beneficiary.getId())))
                .andExpect(jsonPath("$.[*].customerid").value(hasItem(DEFAULT_CUSTOMERID.toString())))
                .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
                .andExpect(jsonPath("$.[*].ssn").value(hasItem(DEFAULT_SSN.toString())))
                .andExpect(jsonPath("$.[*].accountNum").value(hasItem(DEFAULT_ACCOUNT_NUM.intValue())))
                .andExpect(jsonPath("$.[*].dateOfDeath").value(hasItem(DEFAULT_DATE_OF_DEATH.toString())))
                .andExpect(jsonPath("$.[*].dateCBAware").value(hasItem(DEFAULT_DATE_CB_AWARE_STR)))
                .andExpect(jsonPath("$.[*].otherGovBenefits").value(hasItem(DEFAULT_OTHER_GOV_BENEFITS.booleanValue())));
    }

    @Test
    public void getBeneficiary() throws Exception {
        // Initialize the database
        beneficiaryRepository.save(beneficiary);

        // Get the beneficiary
        restBeneficiaryMockMvc.perform(get("/api/beneficiaries/{id}", beneficiary.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(beneficiary.getId()))
            .andExpect(jsonPath("$.customerid").value(DEFAULT_CUSTOMERID.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.ssn").value(DEFAULT_SSN.toString()))
            .andExpect(jsonPath("$.accountNum").value(DEFAULT_ACCOUNT_NUM.intValue()))
            .andExpect(jsonPath("$.dateOfDeath").value(DEFAULT_DATE_OF_DEATH.toString()))
            .andExpect(jsonPath("$.dateCBAware").value(DEFAULT_DATE_CB_AWARE_STR))
            .andExpect(jsonPath("$.otherGovBenefits").value(DEFAULT_OTHER_GOV_BENEFITS.booleanValue()));
    }

    @Test
    public void getNonExistingBeneficiary() throws Exception {
        // Get the beneficiary
        restBeneficiaryMockMvc.perform(get("/api/beneficiaries/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateBeneficiary() throws Exception {
        // Initialize the database
        beneficiaryRepository.save(beneficiary);
        int databaseSizeBeforeUpdate = beneficiaryRepository.findAll().size();

        // Update the beneficiary
        Beneficiary updatedBeneficiary = new Beneficiary();
        updatedBeneficiary.setId(beneficiary.getId());
        updatedBeneficiary.setCustomerID(UPDATED_CUSTOMERID);
        updatedBeneficiary.setName(UPDATED_NAME);
        updatedBeneficiary.setSSN(UPDATED_SSN);
        updatedBeneficiary.setAccountNum(UPDATED_ACCOUNT_NUM);
        updatedBeneficiary.setDateOfDeath(UPDATED_DATE_OF_DEATH);
        updatedBeneficiary.setDateCBAware(UPDATED_DATE_CB_AWARE);
        updatedBeneficiary.setOtherGovBenefits(UPDATED_OTHER_GOV_BENEFITS);

        restBeneficiaryMockMvc.perform(put("/api/beneficiaries")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedBeneficiary)))
                .andExpect(status().isOk());

        // Validate the Beneficiary in the database
        List<Beneficiary> beneficiaries = beneficiaryRepository.findAll();
        assertThat(beneficiaries).hasSize(databaseSizeBeforeUpdate);
        Beneficiary testBeneficiary = beneficiaries.get(beneficiaries.size() - 1);
        assertThat(testBeneficiary.getCustomerID()).isEqualTo(UPDATED_CUSTOMERID);
        assertThat(testBeneficiary.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testBeneficiary.getSSN()).isEqualTo(UPDATED_SSN);
        assertThat(testBeneficiary.getAccountNum()).isEqualTo(UPDATED_ACCOUNT_NUM);
        assertThat(testBeneficiary.getDateOfDeath()).isEqualTo(UPDATED_DATE_OF_DEATH);
        assertThat(testBeneficiary.getDateCBAware()).isEqualTo(UPDATED_DATE_CB_AWARE);
        assertThat(testBeneficiary.isOtherGovBenefits()).isEqualTo(UPDATED_OTHER_GOV_BENEFITS);
    }

    @Test
    public void deleteBeneficiary() throws Exception {
        // Initialize the database
        beneficiaryRepository.save(beneficiary);
        int databaseSizeBeforeDelete = beneficiaryRepository.findAll().size();

        // Get the beneficiary
        restBeneficiaryMockMvc.perform(delete("/api/beneficiaries/{id}", beneficiary.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Beneficiary> beneficiaries = beneficiaryRepository.findAll();
        assertThat(beneficiaries).hasSize(databaseSizeBeforeDelete - 1);
    }
}
