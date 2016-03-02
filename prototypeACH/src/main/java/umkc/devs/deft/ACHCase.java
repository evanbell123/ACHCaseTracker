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
    ACHCase()
    {
        // jpa only
    }

    public ACHCase(Integer assignedTo, String beneficiaryName, Double totalAmt,
                   DateTime openedDate, LocalDate sla, Integer daysOpen, String status, String notes)
    {
        this.assignedTo = assignedTo;
        this.beneficiaryName = beneficiaryName;
        this.totalAmt = totalAmt;
        this.openedDate = openedDate;
        this.sla = sla;
        this. daysOpen = daysOpen;
        this.status = status;
        this.notes = notes;
    }

    @Id
    @GeneratedValue
    private Long id;

    public Integer assignedTo;
    public String status;
    public String beneficiaryName;
    public Double totalAmt;
    public DateTime openedDate;
    public LocalDate sla;
    public Integer daysOpen;
    public String notes;

    public Long getId() {
        return id;
    }

    public Integer getAssignedTo() {
        return assignedTo;
    }

    public String getBeneficiaryName() {
        return beneficiaryName;
    }

    public Double getTotalAmt() {
        return totalAmt;
    }

    public DateTime getOpenedDate() {
        return openedDate;
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
