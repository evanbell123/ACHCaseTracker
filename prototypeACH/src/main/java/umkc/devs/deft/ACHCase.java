package umkc.devs.deft;

//import com.fasterxml.jackson.annotation.JsonIgnore;

import org.joda.time.DateTime;
import org.joda.time.LocalDate;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
//import javax.persistence.ManyToOne;

/**
 * Created by Steven on 2/28/2016.
 */
@Entity
public class ACHCase
{
    @Id
    @GeneratedValue
    private Long id;

    ACHCase()
    {
        // jpa only
    }

    public ACHCase(Integer assignedTo, String beneficiary, Double totalAmt, DateTime openedOn, LocalDate sla, Integer daysOpen, String status)
    {
        this.assignedTo = assignedTo;
        this.beneficiary = beneficiary;
        this.totalAmt = totalAmt;
        this.openedOn = openedOn;
        this.sla = sla;
        this. daysOpen = daysOpen;
        this.status = status;
    }

    public Integer assignedTo;
    public String status;
    public String beneficiary;
    public Double totalAmt;
    public DateTime openedOn;
    public LocalDate sla;
    public Integer daysOpen;

    public Long getId() {
        return id;
    }

    public Integer getAssignedTo() {
        return assignedTo;
    }

    public String getBeneficiary() {
        return beneficiary;
    }

    public Double getTotalAmt() {
        return totalAmt;
    }

    public DateTime getOpenedOn() {
        return openedOn;
    }

    public LocalDate getSla() {
        return sla;
    }

    public Integer getDaysOpen() {
        return daysOpen;
    }

    public String getStatus() {
        return status;
    }
}
