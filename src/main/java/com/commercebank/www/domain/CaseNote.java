package com.commercebank.www.domain;

import org.javers.core.metamodel.annotation.Entity;
import org.javers.core.metamodel.annotation.TypeName;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.util.Objects;

/**
 * A CaseNote.
 */
//@Entity
//@TypeName("CaseNote")
@Document(collection = "case_note")
public class CaseNote implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("note")
    private String note;

    public CaseNote() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CaseNote caseNote = (CaseNote) o;
        if(caseNote.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, caseNote.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "CaseNote{" +
            "id=" + id +
            ", note='" + note + "'" +
            '}';
    }
}
