package com.commercebank.www.domain;

import org.javers.core.metamodel.annotation.TypeName;
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
@TypeName("GovRec")
@Document(collection = "gov_rec")
public class GovRec implements Serializable, CaseDetail {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("claim_number")
    private String claimNumber;

    @Field("completed_on")
    private ZonedDateTime completedOn;

    @Field("completed_by")
    private String completedBy;

    @Field("verified_on")
    private ZonedDateTime verifiedOn;

    @Field("full_recovery")
    private Boolean fullRecovery;

    @Field("payment_total")
    private BigDecimal paymentTotal;

    @Min(value = 0)
    @Field("payment_count")
    private Long paymentCount;

    @NotNull
    @Field("subtype")
    private CaseSubtype subtype;

    @Field("verified_by")
    private String verifiedBy;

    @DBRef
    @Field("recovery_info")
    private Recovery recoveryInfo;

    @Field("notes")
    private List<CaseNote> notes;

    @Field("payments")
    private List<Payment> payments;

    public GovRec() {}

    public GovRec(String claimNumber, ZonedDateTime completedOn, BigDecimal paymentTotal, CaseSubtype subtype)
    {
        this.claimNumber = claimNumber;
        this.completedOn = completedOn;
        this.paymentTotal = paymentTotal;
        this.subtype = subtype;
    }

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

    public String getVerifiedBy() { return verifiedBy; }

    public void setVerifiedBy(String verifiedBy) { this.verifiedBy = verifiedBy; }

    public Recovery getRecoveryInfo() { return recoveryInfo; }

    public void setRecoveryInfo(Recovery recoveryInfo) { this.recoveryInfo = recoveryInfo; }

    public List<CaseNote> getNotes() { return notes; }

    public void setNotes(List<CaseNote> notes) { this.notes = notes; }

    public List<Payment> getPayments() { return payments; }

    public void setPayments(List<Payment> payments) { this.payments = payments; }

    public Boolean isFullRecovery() {
        return fullRecovery;
    }

    public void setFullRecovery(Boolean fullRecovery) {
        this.fullRecovery = fullRecovery;
    }

    public String getCompletedBy() { return completedBy; }

    public void setCompletedBy(String completedBy) { this.completedBy = completedBy; }

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
            ", verifiedBy='" + verifiedBy + "'" +
            ", paymentTotal='" + paymentTotal + "'" +
            ", paymentCount='" + paymentCount + "'" +
            ", subtype='" + subtype + "'" +
          // ", recoveryMethod='" + recoveryInfo.getMethod() + "'" +
            ", fullRecovery='" + fullRecovery + "'" +
            '}';
    }
}
