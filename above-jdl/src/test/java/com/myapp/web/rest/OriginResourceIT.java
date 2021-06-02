package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Origin;
import com.myapp.repository.OriginRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link OriginResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OriginResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/origins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OriginRepository originRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOriginMockMvc;

    private Origin origin;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Origin createEntity(EntityManager em) {
        Origin origin = new Origin().name(DEFAULT_NAME);
        return origin;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Origin createUpdatedEntity(EntityManager em) {
        Origin origin = new Origin().name(UPDATED_NAME);
        return origin;
    }

    @BeforeEach
    public void initTest() {
        origin = createEntity(em);
    }

    @Test
    @Transactional
    void createOrigin() throws Exception {
        int databaseSizeBeforeCreate = originRepository.findAll().size();
        // Create the Origin
        restOriginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(origin)))
            .andExpect(status().isCreated());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeCreate + 1);
        Origin testOrigin = originList.get(originList.size() - 1);
        assertThat(testOrigin.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createOriginWithExistingId() throws Exception {
        // Create the Origin with an existing ID
        origin.setId(1L);

        int databaseSizeBeforeCreate = originRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOriginMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(origin)))
            .andExpect(status().isBadRequest());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOrigins() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        // Get all the originList
        restOriginMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(origin.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getOrigin() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        // Get the origin
        restOriginMockMvc
            .perform(get(ENTITY_API_URL_ID, origin.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(origin.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingOrigin() throws Exception {
        // Get the origin
        restOriginMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOrigin() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        int databaseSizeBeforeUpdate = originRepository.findAll().size();

        // Update the origin
        Origin updatedOrigin = originRepository.findById(origin.getId()).get();
        // Disconnect from session so that the updates on updatedOrigin are not directly saved in db
        em.detach(updatedOrigin);
        updatedOrigin.name(UPDATED_NAME);

        restOriginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOrigin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOrigin))
            )
            .andExpect(status().isOk());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
        Origin testOrigin = originList.get(originList.size() - 1);
        assertThat(testOrigin.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, origin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(origin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(origin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(origin)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOriginWithPatch() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        int databaseSizeBeforeUpdate = originRepository.findAll().size();

        // Update the origin using partial update
        Origin partialUpdatedOrigin = new Origin();
        partialUpdatedOrigin.setId(origin.getId());

        restOriginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrigin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrigin))
            )
            .andExpect(status().isOk());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
        Origin testOrigin = originList.get(originList.size() - 1);
        assertThat(testOrigin.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateOriginWithPatch() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        int databaseSizeBeforeUpdate = originRepository.findAll().size();

        // Update the origin using partial update
        Origin partialUpdatedOrigin = new Origin();
        partialUpdatedOrigin.setId(origin.getId());

        partialUpdatedOrigin.name(UPDATED_NAME);

        restOriginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOrigin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOrigin))
            )
            .andExpect(status().isOk());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
        Origin testOrigin = originList.get(originList.size() - 1);
        assertThat(testOrigin.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, origin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(origin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(origin))
            )
            .andExpect(status().isBadRequest());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOrigin() throws Exception {
        int databaseSizeBeforeUpdate = originRepository.findAll().size();
        origin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOriginMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(origin)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Origin in the database
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOrigin() throws Exception {
        // Initialize the database
        originRepository.saveAndFlush(origin);

        int databaseSizeBeforeDelete = originRepository.findAll().size();

        // Delete the origin
        restOriginMockMvc
            .perform(delete(ENTITY_API_URL_ID, origin.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Origin> originList = originRepository.findAll();
        assertThat(originList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
