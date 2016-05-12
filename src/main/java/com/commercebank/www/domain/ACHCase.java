package com.commercebank.www.domain;

import org.javers.core.metamodel.annotation.Entity;
import org.javers.core.metamodel.annotation.TypeName;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Objects;

import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.domain.enumeration.CaseType;

/**
 * An ACH Case.
 */
@Entity
@TypeName("ACHCase")
@Document(collection = "ach_case")
public class ACHCase extends AbstractAuditingEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("status")
    private Status status;

    @Field("total_amount")
    private BigDecimal totalAmount;

    //@Field("last_payment_on")
    //private ZonedDateTime lastPaymentOn;

    @Field("sla_deadline")
    private LocalDate slaDeadline;

    @Field("sla_count")
    private Long missedSLACount = new Long(0);

    @DBRef
    @Field("sla")
    private SLA sla;

    @Min(value = 0)
    @Field("days_open")
    private Long daysOpen = new Long(0);

    @Field("completed_on")
    private ZonedDateTime completedOn;

    @Field("completed_by")
    private String completedBy;

    @Field("assigned_to")
    private String assignedTo;

    @NotNull
    @Field("type")
    private CaseType type;

    @DBRef
    @Field("beneficiary")
    private Beneficiary beneficiary;

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

    public LocalDate getSlaDeadline() { return slaDeadline; }

    public void setSlaDeadline(LocalDate slaDeadline) {
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

    public String getAssignedTo() { return assignedTo; }

    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public CaseDetail getCaseDetail() { return caseDetail; }

    public void setCaseDetail(CaseDetail caseDetail) { this.caseDetail = caseDetail; }

    public SLA getSla() { return sla; }

    public void setSla(SLA sla) { this.sla = sla; }

    public Long getMissedSLACount() { return missedSLACount; }

    public void setMissedSLACount(Long missedSLACount) { this.missedSLACount = missedSLACount; }

    public ZonedDateTime getCompletedOn() {
        return completedOn;
    }

    public void setCompletedOn(ZonedDateTime completedOn) {
        this.completedOn = completedOn;
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
           // ", lastPaymentOn='" + lastPaymentOn + "'" +
            ", slaDeadline='" + slaDeadline + "'" +
            ", slaType='" + sla.getId() + "'" +
            ", daysOpen='" + daysOpen + "'" +
            ", type='" + type + "'" +
            ", completedOn='" + completedOn + "'" +
            ", beneficiary='" + beneficiary.getName() + "'" +
            ", assigned to'" + assignedTo + "'" +
            '}';
    }
}
