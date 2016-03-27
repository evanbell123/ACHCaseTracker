package com.commercebank.www.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * An SLA.
 */

@Document(collection = "sla")
public class SLA implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("business_days")
    private Long businessDays;

    @Field("type_name")
    private String typeName;

    public SLA(Long businessDays, String typeName) {
        this.businessDays = businessDays;
        this.typeName = typeName;
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

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
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
        return "Sla{" +
            "id=" + id +
            ", businessDays='" + businessDays + "'" +
            ", typeName='" + typeName + "'" +
            '}';
    }
}
