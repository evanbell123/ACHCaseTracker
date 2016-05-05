package com.commercebank.www.domain;

import org.javers.core.metamodel.annotation.Entity;
import org.javers.core.metamodel.annotation.TypeName;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Payment.
 */
@Entity
@TypeName("Payment")
@Document(collection = "payment")
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("amount")
    private BigDecimal amount;

    @Field("effective_on")
    private LocalDate effectiveOn;

    public Payment() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDate getEffectiveOn() {
        return effectiveOn;
    }

    public void setEffectiveOn(LocalDate effectiveOn) {
        this.effectiveOn = effectiveOn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Payment payment = (Payment) o;
        if(payment.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, payment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Payment{" +
            "id=" + id +
            ", amount='" + amount + "'" +
            ", effectiveOn='" + effectiveOn + "'" +
            '}';
    }
}
