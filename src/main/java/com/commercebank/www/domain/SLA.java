package com.commercebank.www.domain;

import org.javers.core.metamodel.annotation.Entity;
import org.javers.core.metamodel.annotation.TypeName;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * An SLA.
 */
//@Entity
//@TypeName("SLA")
@Document(collection = "sla")
public class SLA extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("business_days")
    private Long businessDays;

    public SLA() {}

    public SLA(String id, Long businessDays) {
        this.businessDays = businessDays;
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getBusinessDays() {
        return businessDays;
    }

    public void setBusinessDays(Long businessDays) {
        this.businessDays = businessDays;
    }

    @Override

    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SLA sla = (SLA) o;
        if(sla.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, sla.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "SLA{" +
            "id = " + id +
            ", businessDays='" + businessDays + "'" +
            '}';
    }
}
