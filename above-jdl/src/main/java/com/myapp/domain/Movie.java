package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Movie.
 */
@Entity
@Table(name = "movie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Movie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "movie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "movie" }, allowSetters = true)
    private Set<Rating> ratings = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Movie id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Movie name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Rating> getRatings() {
        return this.ratings;
    }

    public Movie ratings(Set<Rating> ratings) {
        this.setRatings(ratings);
        return this;
    }

    public Movie addRating(Rating rating) {
        this.ratings.add(rating);
        rating.setMovie(this);
        return this;
    }

    public Movie removeRating(Rating rating) {
        this.ratings.remove(rating);
        rating.setMovie(null);
        return this;
    }

    public void setRatings(Set<Rating> ratings) {
        if (this.ratings != null) {
            this.ratings.forEach(i -> i.setMovie(null));
        }
        if (ratings != null) {
            ratings.forEach(i -> i.setMovie(this));
        }
        this.ratings = ratings;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Movie)) {
            return false;
        }
        return id != null && id.equals(((Movie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Movie{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
