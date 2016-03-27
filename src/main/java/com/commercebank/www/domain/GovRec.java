package com.commercebank.www.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;

import com.commercebank.www.domain.enumeration.CaseSubtype;

/**
 * A GovRec.
 */

@Document(collection = "gov_rec")
public class GovRec implements Serializable, CaseDetail {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("claim_number")
    private String claimNumber;

    @Field("completed_on")
    private ZonedDateTime completedOn;

    @Field("verified_on")
    private ZonedDateTime verifiedOn;

    @Field("payment_total")
    private BigDecimal paymentTotal;

    @Min(value = 0)
    @Field("payment_count")
    private Long paymentCount;

    @NotNull
    @Field("subtype")
    private CaseSubtype subtype;

    @DBRef
    @Field("verified_by")
    private User verifiedBy;

    @DBRef
    @Field("recovery_info")
    private Recovery recoveryInfo;

    @DBRef
    @Field("notes")
    private List<CaseNote> notes;

    @DBRef
    @Field("payments")
    private List<Payment> payments;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getClaimNumber() {
        return claimNumber;
    }

    public void setClaimNumber(String claimNumber) {
        this.claimNumber = claimNumber;
    }

    public ZonedDateTime getCompletedOn() {
        return completedOn;
    }

    public void setCompletedOn(ZonedDateTime completedOn) {
        this.completedOn = completedOn;
    }

    public ZonedDateTime getVerifiedOn() {
        return verifiedOn;
    }

    public void setVerifiedOn(ZonedDateTime verifiedOn) {
        this.verifiedOn = verifiedOn;
    }

    public BigDecimal getPaymentTotal() {
        return paymentTotal;
    }

    public void setPaymentTotal(BigDecimal paymentTotal) {
        this.paymentTotal = paymentTotal;
    }

    public Long getPaymentCount() {
        return paymentCount;
    }

    public void setPaymentCount(Long paymentCount) {
        this.paymentCount = paymentCount;
    }

    public CaseSubtype getSubtype() {
        return subtype;
    }

    public void setSubtype(CaseSubtype subtype) {
        this.subtype = subtype;
    }

    public User getVerifiedBy() { return verifiedBy; }

    public void setVerifiedBy(User verifiedBy) { this.verifiedBy = verifiedBy; }

    public Recovery getRecoveryInfo() { return recoveryInfo; }

    public void setRecoveryInfo(Recovery recoveryInfo) { this.recoveryInfo = recoveryInfo; }

    public List<CaseNote> getNotes() { return notes; }

    public void setNotes(List<CaseNote> notes) { this.notes = notes; }

    public List<Payment> getPayments() { return payments; }

    public void setPayments(List<Payment> payments) { this.payments = payments; }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        GovRec govRec = (GovRec) o;
        if(govRec.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, govRec.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "GovRec{" +
            "id=" + id +
            ", claimNumber='" + claimNumber + "'" +
            ", completedOn='" + completedOn + "'" +
            ", verifiedOn='" + verifiedOn + "'" +
         //   ", verifiedBy='" + verifiedBy.getLogin() + "'" +
            ", paymentTotal='" + paymentTotal + "'" +
            ", paymentCount='" + paymentCount + "'" +
            ", subtype='" + subtype + "'" +
          //  ", recoveryMethod='" + recoveryInfo.getMethod() + "'" +
            '}';
    }
}