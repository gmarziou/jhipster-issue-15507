package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OriginTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Origin.class);
        Origin origin1 = new Origin();
        origin1.setId(1L);
        Origin origin2 = new Origin();
        origin2.setId(origin1.getId());
        assertThat(origin1).isEqualTo(origin2);
        origin2.setId(2L);
        assertThat(origin1).isNotEqualTo(origin2);
        origin1.setId(null);
        assertThat(origin1).isNotEqualTo(origin2);
    }
}
