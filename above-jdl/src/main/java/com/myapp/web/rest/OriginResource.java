package com.myapp.web.rest;

import com.myapp.domain.Origin;
import com.myapp.repository.OriginRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Origin}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class OriginResource {

    private final Logger log = LoggerFactory.getLogger(OriginResource.class);

    private static final String ENTITY_NAME = "origin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OriginRepository originRepository;

    public OriginResource(OriginRepository originRepository) {
        this.originRepository = originRepository;
    }

    /**
     * {@code POST  /origins} : Create a new origin.
     *
     * @param origin the origin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new origin, or with status {@code 400 (Bad Request)} if the origin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/origins")
    public ResponseEntity<Origin> createOrigin(@RequestBody Origin origin) throws URISyntaxException {
        log.debug("REST request to save Origin : {}", origin);
        if (origin.getId() != null) {
            throw new BadRequestAlertException("A new origin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Origin result = originRepository.save(origin);
        return ResponseEntity
            .created(new URI("/api/origins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /origins/:id} : Updates an existing origin.
     *
     * @param id the id of the origin to save.
     * @param origin the origin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated origin,
     * or with status {@code 400 (Bad Request)} if the origin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the origin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/origins/{id}")
    public ResponseEntity<Origin> updateOrigin(@PathVariable(value = "id", required = false) final Long id, @RequestBody Origin origin)
        throws URISyntaxException {
        log.debug("REST request to update Origin : {}, {}", id, origin);
        if (origin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, origin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!originRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Origin result = originRepository.save(origin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, origin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /origins/:id} : Partial updates given fields of an existing origin, field will ignore if it is null
     *
     * @param id the id of the origin to save.
     * @param origin the origin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated origin,
     * or with status {@code 400 (Bad Request)} if the origin is not valid,
     * or with status {@code 404 (Not Found)} if the origin is not found,
     * or with status {@code 500 (Internal Server Error)} if the origin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/origins/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Origin> partialUpdateOrigin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Origin origin
    ) throws URISyntaxException {
        log.debug("REST request to partial update Origin partially : {}, {}", id, origin);
        if (origin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, origin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!originRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Origin> result = originRepository
            .findById(origin.getId())
            .map(
                existingOrigin -> {
                    if (origin.getName() != null) {
                        existingOrigin.setName(origin.getName());
                    }

                    return existingOrigin;
                }
            )
            .map(originRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, origin.getId().toString())
        );
    }

    /**
     * {@code GET  /origins} : get all the origins.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of origins in body.
     */
    @GetMapping("/origins")
    public List<Origin> getAllOrigins(@RequestParam(required = false) String filter) {
        if ("product-is-null".equals(filter)) {
            log.debug("REST request to get all Origins where product is null");
            return StreamSupport
                .stream(originRepository.findAll().spliterator(), false)
                .filter(origin -> origin.getProduct() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all Origins");
        return originRepository.findAll();
    }

    /**
     * {@code GET  /origins/:id} : get the "id" origin.
     *
     * @param id the id of the origin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the origin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/origins/{id}")
    public ResponseEntity<Origin> getOrigin(@PathVariable Long id) {
        log.debug("REST request to get Origin : {}", id);
        Optional<Origin> origin = originRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(origin);
    }

    /**
     * {@code DELETE  /origins/:id} : delete the "id" origin.
     *
     * @param id the id of the origin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/origins/{id}")
    public ResponseEntity<Void> deleteOrigin(@PathVariable Long id) {
        log.debug("REST request to delete Origin : {}", id);
        originRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
