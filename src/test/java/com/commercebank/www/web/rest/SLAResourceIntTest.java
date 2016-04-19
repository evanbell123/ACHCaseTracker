package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.SLA;
import com.commercebank.www.repository.SLARepository;

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
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the SLAResource REST controller.
 *
 * @see SLAResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class SLAResourceIntTest {


    private static final Long DEFAULT_BUSINESS_DAYS = 1L;
    private static final Long UPDATED_BUSINESS_DAYS = 2L;
    private static final String DEFAULT_TYPE_NAME = "AAAAA";
    private static final String UPDATED_TYPE_NAME = "BBBBB";

    @Inject
    private SLARepository slaRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restSLAMockMvc;

    private SLA SLA;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        SLAResource sLAResource = new SLAResource();
        ReflectionTestUtils.setField(sLAResource, "slaRepository", slaRepository);
        this.restSLAMockMvc = MockMvcBuilders.standaloneSetup(sLAResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        slaRepository.deleteAll();
        SLA = new SLA();
        SLA.setBusinessDays(DEFAULT_BUSINESS_DAYS);
    }

    @Test
    public void createSLA() throws Exception {
        int databaseSizeBeforeCreate = slaRepository.findAll().size();

        // Create the SLA

        restSLAMockMvc.perform(post("/api/sla")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(SLA)))
                .andExpect(status().isCreated());

        // Validate the SLA in the database
        List<SLA> slas = slaRepository.findAll();
        assertThat(slas).hasSize(databaseSizeBeforeCreate + 1);
        SLA testSLA = slas.get(slas.size() - 1);
        assertThat(testSLA.getBusinessDays()).isEqualTo(DEFAULT_BUSINESS_DAYS);
    }

    @Test
    public void checkBusinessDaysIsRequired() throws Exception {
        int databaseSizeBeforeTest = slaRepository.findAll().size();
        // set the field null
        SLA.setBusinessDays(null);

        // Create the SLA, which fails.

        restSLAMockMvc.perform(post("/api/sla")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(SLA)))
                .andExpect(status().isBadRequest());

        List<SLA> slas = slaRepository.findAll();
        assertThat(slas).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllSLAS() throws Exception {
        // Initialize the database
        slaRepository.save(SLA);

        // Get all the SLAs
        restSLAMockMvc.perform(get("/api/sla?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(SLA.getId())))
                .andExpect(jsonPath("$.[*].businessDays").value(hasItem(DEFAULT_BUSINESS_DAYS.intValue())))
                .andExpect(jsonPath("$.[*].typeName").value(hasItem(DEFAULT_TYPE_NAME.toString())));
    }

    @Test
    public void getSLA() throws Exception {
        // Initialize the database
        slaRepository.save(SLA);

        // Get the SLA
        restSLAMockMvc.perform(get("/api/sla/{id}", SLA.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(SLA.getId()))
            .andExpect(jsonPath("$.businessDays").value(DEFAULT_BUSINESS_DAYS.intValue()))
            .andExpect(jsonPath("$.typeName").value(DEFAULT_TYPE_NAME.toString()));
    }

    @Test
    public void getNonExistingSLA() throws Exception {
        // Get the SLA
        restSLAMockMvc.perform(get("/api/sla/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateSLA() throws Exception {
        // Initialize the database
        slaRepository.save(SLA);
        int databaseSizeBeforeUpdate = slaRepository.findAll().size();

        // Update the SLA
        SLA updatedSLA = new SLA();
        updatedSLA.setId(SLA.getId());
        updatedSLA.setBusinessDays(UPDATED_BUSINESS_DAYS);

        restSLAMockMvc.perform(put("/api/sla")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedSLA)))
                .andExpect(status().isOk());

        // Validate the SLA in the database
        List<SLA> slas = slaRepository.findAll();
        assertThat(slas).hasSize(databaseSizeBeforeUpdate);
        SLA testSLA = slas.get(slas.size() - 1);
        assertThat(testSLA.getBusinessDays()).isEqualTo(UPDATED_BUSINESS_DAYS);
    }

    @Test
    public void deleteSLA() throws Exception {
        // Initialize the database
        slaRepository.save(SLA);
        int databaseSizeBeforeDelete = slaRepository.findAll().size();

        // Get the SLA
        restSLAMockMvc.perform(delete("/api/sla/{id}", SLA.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<SLA> slas = slaRepository.findAll();
        assertThat(slas).hasSize(databaseSizeBeforeDelete - 1);
    }
}
