package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.Recovery;
import com.commercebank.www.repository.RecoveryRepository;

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

import com.commercebank.www.domain.enumeration.RecoveryMethod;
import com.commercebank.www.domain.enumeration.RecoveryDetail;

/**
 * Test class for the RecoveryResource REST controller.
 *
 * @see RecoveryResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class RecoveryResourceIntTest {


    private static final RecoveryMethod DEFAULT_METHOD = RecoveryMethod.ACH_RETURN;
    private static final RecoveryMethod UPDATED_METHOD = RecoveryMethod.CHECK_MAILED;

    private static final RecoveryDetail DEFAULT_DETAIL_TYPE = RecoveryDetail.CHK_NUM;
    private static final RecoveryDetail UPDATED_DETAIL_TYPE = RecoveryDetail.GL_COST;

    private static final Long DEFAULT_DETAIL_VALUE = 1L;
    private static final Long UPDATED_DETAIL_VALUE = 2L;
    private static final String DEFAULT_COMMENT = "AAAAA";
    private static final String UPDATED_COMMENT = "BBBBB";

    private static final Boolean DEFAULT_FULL_RECOVERY = false;
    private static final Boolean UPDATED_FULL_RECOVERY = true;

    @Inject
    private RecoveryRepository recoveryRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restRecoveryMockMvc;

    private Recovery recovery;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        RecoveryResource recoveryResource = new RecoveryResource();
        ReflectionTestUtils.setField(recoveryResource, "recoveryRepository", recoveryRepository);
        this.restRecoveryMockMvc = MockMvcBuilders.standaloneSetup(recoveryResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        recoveryRepository.deleteAll();
        recovery = new Recovery();
        recovery.setMethod(DEFAULT_METHOD);
        recovery.setDetailType(DEFAULT_DETAIL_TYPE);
        recovery.setDetailValue(DEFAULT_DETAIL_VALUE);
        recovery.setComment(DEFAULT_COMMENT);
        recovery.setFullRecovery(DEFAULT_FULL_RECOVERY);
    }

    @Test
    public void createRecovery() throws Exception {
        int databaseSizeBeforeCreate = recoveryRepository.findAll().size();

        // Create the Recovery

        restRecoveryMockMvc.perform(post("/api/recoveries")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(recovery)))
                .andExpect(status().isCreated());

        // Validate the Recovery in the database
        List<Recovery> recoveries = recoveryRepository.findAll();
        assertThat(recoveries).hasSize(databaseSizeBeforeCreate + 1);
        Recovery testRecovery = recoveries.get(recoveries.size() - 1);
        assertThat(testRecovery.getMethod()).isEqualTo(DEFAULT_METHOD);
        assertThat(testRecovery.getDetailType()).isEqualTo(DEFAULT_DETAIL_TYPE);
        assertThat(testRecovery.getDetailValue()).isEqualTo(DEFAULT_DETAIL_VALUE);
        assertThat(testRecovery.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testRecovery.isFullRecovery()).isEqualTo(DEFAULT_FULL_RECOVERY);
    }

    @Test
    public void checkMethodIsRequired() throws Exception {
        int databaseSizeBeforeTest = recoveryRepository.findAll().size();
        // set the field null
        recovery.setMethod(null);

        // Create the Recovery, which fails.

        restRecoveryMockMvc.perform(post("/api/recoveries")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(recovery)))
                .andExpect(status().isBadRequest());

        List<Recovery> recoveries = recoveryRepository.findAll();
        assertThat(recoveries).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllRecoveries() throws Exception {
        // Initialize the database
        recoveryRepository.save(recovery);

        // Get all the recoveries
        restRecoveryMockMvc.perform(get("/api/recoveries?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(recovery.getId())))
                .andExpect(jsonPath("$.[*].method").value(hasItem(DEFAULT_METHOD.toString())))
                .andExpect(jsonPath("$.[*].detailType").value(hasItem(DEFAULT_DETAIL_TYPE.toString())))
                .andExpect(jsonPath("$.[*].detailValue").value(hasItem(DEFAULT_DETAIL_VALUE.intValue())))
                .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())))
                .andExpect(jsonPath("$.[*].fullRecovery").value(hasItem(DEFAULT_FULL_RECOVERY.booleanValue())));
    }

    @Test
    public void getRecovery() throws Exception {
        // Initialize the database
        recoveryRepository.save(recovery);

        // Get the recovery
        restRecoveryMockMvc.perform(get("/api/recoveries/{id}", recovery.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(recovery.getId()))
            .andExpect(jsonPath("$.method").value(DEFAULT_METHOD.toString()))
            .andExpect(jsonPath("$.detailType").value(DEFAULT_DETAIL_TYPE.toString()))
            .andExpect(jsonPath("$.detailValue").value(DEFAULT_DETAIL_VALUE.intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()))
            .andExpect(jsonPath("$.fullRecovery").value(DEFAULT_FULL_RECOVERY.booleanValue()));
    }

    @Test
    public void getNonExistingRecovery() throws Exception {
        // Get the recovery
        restRecoveryMockMvc.perform(get("/api/recoveries/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateRecovery() throws Exception {
        // Initialize the database
        recoveryRepository.save(recovery);
        int databaseSizeBeforeUpdate = recoveryRepository.findAll().size();

        // Update the recovery
        Recovery updatedRecovery = new Recovery();
        updatedRecovery.setId(recovery.getId());
        updatedRecovery.setMethod(UPDATED_METHOD);
        updatedRecovery.setDetailType(UPDATED_DETAIL_TYPE);
        updatedRecovery.setDetailValue(UPDATED_DETAIL_VALUE);
        updatedRecovery.setComment(UPDATED_COMMENT);
        updatedRecovery.setFullRecovery(UPDATED_FULL_RECOVERY);

        restRecoveryMockMvc.perform(put("/api/recoveries")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedRecovery)))
                .andExpect(status().isOk());

        // Validate the Recovery in the database
        List<Recovery> recoveries = recoveryRepository.findAll();
        assertThat(recoveries).hasSize(databaseSizeBeforeUpdate);
        Recovery testRecovery = recoveries.get(recoveries.size() - 1);
        assertThat(testRecovery.getMethod()).isEqualTo(UPDATED_METHOD);
        assertThat(testRecovery.getDetailType()).isEqualTo(UPDATED_DETAIL_TYPE);
        assertThat(testRecovery.getDetailValue()).isEqualTo(UPDATED_DETAIL_VALUE);
        assertThat(testRecovery.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testRecovery.isFullRecovery()).isEqualTo(UPDATED_FULL_RECOVERY);
    }

    @Test
    public void deleteRecovery() throws Exception {
        // Initialize the database
        recoveryRepository.save(recovery);
        int databaseSizeBeforeDelete = recoveryRepository.findAll().size();

        // Get the recovery
        restRecoveryMockMvc.perform(delete("/api/recoveries/{id}", recovery.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Recovery> recoveries = recoveryRepository.findAll();
        assertThat(recoveries).hasSize(databaseSizeBeforeDelete - 1);
    }
}
