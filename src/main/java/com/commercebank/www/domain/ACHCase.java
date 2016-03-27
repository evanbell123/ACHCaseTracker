package com.commercebank.www.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.commercebank.www.domain.enumeration.Status;

import com.commercebank.www.domain.enumeration.CaseType;

/**
 * An ACHCase.
 */

@Document(collection = "ach_case")
public class ACHCase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Transient
    @Field("total_amount")
    private BigDecimal totalAmount;

    @Id
    private String id;

    @NotNull
    @Field("status")
    private Status status;

    @Field("last_payment_on")
    private ZonedDateTime lastPaymentOn;

    @Field("sla_deadline")
    private ZonedDateTime slaDeadline;

    @DBRef
    @Field("sla")
    private SLA sla;

    @Min(value = 0)
    @Field("days_open")
    private Long daysOpen;

    @NotNull
    @Field("type")
    private CaseType type;

    @DBRef
    @Field("beneficiary")
    private Beneficiary beneficiary;

    @DBRef
    @Field("assigned_to")
    private User assignedTo;

    @DBRef
    @Field("case_detail")
    private CaseDetail caseDetail;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public ZonedDateTime getLastPaymentOn() {
        return lastPaymentOn;
    }

    public void setLastPaymentOn(ZonedDateTime lastPaymentOn) {
        this.lastPaymentOn = lastPaymentOn;
    }

    public ZonedDateTime getSlaDeadline() {
        return slaDeadline;
    }

    public void setSlaDeadline(ZonedDateTime slaDeadline) {
        this.slaDeadline = slaDeadline;
    }

    public Long getDaysOpen() {
        return daysOpen;
    }

    public void setDaysOpen(Long daysOpen) {
        this.daysOpen = daysOpen;
    }

    public CaseType getType() {
        return type;
    }

    public void setType(CaseType type) {
        this.type = type;
    }

    public Beneficiary getBeneficiary() { return beneficiary; }

    public void setBeneficiary(Beneficiary beneficiary) { this.beneficiary = beneficiary; }

    public User getAssignedTo() { return assignedTo; }

    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public CaseDetail getCaseDetail() { return caseDetail; }

    public void setCaseDetail(CaseDetail caseDetail) { this.caseDetail = caseDetail; }

    public SLA getSla() { return sla; }

    public void setSla(SLA sla) { this.sla = sla; }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ACHCase achCase = (ACHCase) o;
        if(achCase.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, achCase.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "AchCase{" +
            "id=" + id +
            ", totalAmount='" + totalAmount + "'" +
            ", status='" + status + "'" +
            ", lastPaymentOn='" + lastPaymentOn + "'" +
            ", slaDeadline='" + slaDeadline + "'" +
          //  ", slaType='" + sla.getTypeName() + "'" +
            ", daysOpen='" + daysOpen + "'" +
            ", type='" + type + "'" +
          //  ", beneficiary='" + beneficiary.getName() + "'" +
          //  ", assigned to'" + assignedTo.getLogin() + "'" +
            '}';
    }
}
