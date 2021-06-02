package com.myapp.repository;

import com.myapp.domain.Origin;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Origin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OriginRepository extends JpaRepository<Origin, Long> {}
