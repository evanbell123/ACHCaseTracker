package com.commercebank.www.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

import com.commercebank.www.domain.enumeration.RecoveryMethod;

import com.commercebank.www.domain.enumeration.RecoveryDetail;

/**
 * A Recovery.
 */

@Document(collection = "recovery")
public class Recovery implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("method")
    private RecoveryMethod method;

    @Field("detail_type")
    private RecoveryDetail detailType;

    @Field("detail_value")
    private Long detailValue;

    @Field("comment")
    private String detailString;

    public Recovery() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public RecoveryMethod getMethod() {
        return method;
    }

    public void setMethod(RecoveryMethod method) {
        this.method = method;
    }

    public RecoveryDetail getDetailType() {
        return detailType;
    }

    public void setDetailType(RecoveryDetail detailType) {
        this.detailType = detailType;
    }

    public Long getDetailValue() {
        return detailValue;
    }

    public void setDetailValue(Long detailValue) {
        this.detailValue = detailValue;
    }

    public String getComment() {
        return detailString;
    }

    public void setComment(String comment) {
        this.detailString = comment;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Recovery recovery = (Recovery) o;
        if(recovery.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, recovery.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Recovery{" +
            "id=" + id +
            ", method='" + method + "'" +
            ", detailType='" + detailType + "'" +
            ", detailValue='" + detailValue + "'" +
            ", comment='" + detailString + "'" +
            '}';
    }
}
