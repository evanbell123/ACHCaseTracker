package com.commercebank.www.web.rest;

import com.commercebank.www.AchCaseTrackingApp;
import com.commercebank.www.domain.CaseNote;
import com.commercebank.www.repository.CaseNoteRepository;

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
 * Test class for the CaseNoteResource REST controller.
 *
 * @see CaseNoteResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = AchCaseTrackingApp.class)
@WebAppConfiguration
@IntegrationTest
public class CaseNoteResourceIntTest {

    private static final String DEFAULT_NOTE = "AAAAA";
    private static final String UPDATED_NOTE = "BBBBB";

    @Inject
    private CaseNoteRepository caseNoteRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restCaseNoteMockMvc;

    private CaseNote caseNote;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        CaseNoteResource caseNoteResource = new CaseNoteResource();
        ReflectionTestUtils.setField(caseNoteResource, "caseNoteRepository", caseNoteRepository);
        this.restCaseNoteMockMvc = MockMvcBuilders.standaloneSetup(caseNoteResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        caseNoteRepository.deleteAll();
        caseNote = new CaseNote();
        caseNote.setNote(DEFAULT_NOTE);
    }

    @Test
    public void createCaseNote() throws Exception {
        int databaseSizeBeforeCreate = caseNoteRepository.findAll().size();

        // Create the CaseNote

        restCaseNoteMockMvc.perform(post("/api/case-notes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(caseNote)))
                .andExpect(status().isCreated());

        // Validate the CaseNote in the database
        List<CaseNote> caseNotes = caseNoteRepository.findAll();
        assertThat(caseNotes).hasSize(databaseSizeBeforeCreate + 1);
        CaseNote testCaseNote = caseNotes.get(caseNotes.size() - 1);
        assertThat(testCaseNote.getNote()).isEqualTo(DEFAULT_NOTE);
    }

    @Test
    public void getAllCaseNotes() throws Exception {
        // Initialize the database
        caseNoteRepository.save(caseNote);

        // Get all the caseNotes
        restCaseNoteMockMvc.perform(get("/api/case-notes?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(caseNote.getId())))
                .andExpect(jsonPath("$.[*].note").value(hasItem(DEFAULT_NOTE.toString())));
    }

    @Test
    public void getCaseNote() throws Exception {
        // Initialize the database
        caseNoteRepository.save(caseNote);

        // Get the caseNote
        restCaseNoteMockMvc.perform(get("/api/case-notes/{id}", caseNote.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(caseNote.getId()))
            .andExpect(jsonPath("$.note").value(DEFAULT_NOTE.toString()));
    }

    @Test
    public void getNonExistingCaseNote() throws Exception {
        // Get the caseNote
        restCaseNoteMockMvc.perform(get("/api/case-notes/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    public void updateCaseNote() throws Exception {
        // Initialize the database
        caseNoteRepository.save(caseNote);
        int databaseSizeBeforeUpdate = caseNoteRepository.findAll().size();

        // Update the caseNote
        CaseNote updatedCaseNote = new CaseNote();
        updatedCaseNote.setId(caseNote.getId());
        updatedCaseNote.setNote(UPDATED_NOTE);

        restCaseNoteMockMvc.perform(put("/api/case-notes")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedCaseNote)))
                .andExpect(status().isOk());

        // Validate the CaseNote in the database
        List<CaseNote> caseNotes = caseNoteRepository.findAll();
        assertThat(caseNotes).hasSize(databaseSizeBeforeUpdate);
        CaseNote testCaseNote = caseNotes.get(caseNotes.size() - 1);
        assertThat(testCaseNote.getNote()).isEqualTo(UPDATED_NOTE);
    }

    @Test
    public void deleteCaseNote() throws Exception {
        // Initialize the database
        caseNoteRepository.save(caseNote);
        int databaseSizeBeforeDelete = caseNoteRepository.findAll().size();

        // Get the caseNote
        restCaseNoteMockMvc.perform(delete("/api/case-notes/{id}", caseNote.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<CaseNote> caseNotes = caseNoteRepository.findAll();
        assertThat(caseNotes).hasSize(databaseSizeBeforeDelete - 1);
    }

    public static CaseNote getDefaultCaseNote()
    {
        CaseNote caseNote = new CaseNote();
        caseNote.setNote(DEFAULT_NOTE);
        return caseNote;
    }

    public static CaseNote getUpdatedCaseNote(CaseNote caseNote)
    {
        CaseNote updatedCaseNote = new CaseNote();
        updatedCaseNote.setId(caseNote.getId());
        updatedCaseNote.setNote(UPDATED_NOTE);
        return updatedCaseNote;
    }
}
