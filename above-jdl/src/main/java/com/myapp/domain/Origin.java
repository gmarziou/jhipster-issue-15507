package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Origin.
 */
@Entity
@Table(name = "origin")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Origin implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "name")
    private String name;

    @JsonIgnoreProperties(value = { "origin" }, allowSetters = true)
    @OneToOne(mappedBy = "origin")
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Origin id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Origin name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Product getProduct() {
        return this.product;
    }

    public Origin product(Product product) {
        this.setProduct(product);
        return this;
    }

    public void setProduct(Product product) {
        if (this.product != null) {
            this.product.setOrigin(null);
        }
        if (product != null) {
            product.setOrigin(this);
        }
        this.product = product;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Origin)) {
            return false;
        }
        return id != null && id.equals(((Origin) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Origin{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
