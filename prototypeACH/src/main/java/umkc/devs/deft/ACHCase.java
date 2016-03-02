package umkc.devs.deft;

//import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.sql.Date;
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
                   Date openedDate, Date sla, Integer daysOpen, String status, String notes)
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
    public Date openedDate;
    public Date sla;
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

    public Date getOpenedDate() {
        return openedDate;
    }

    public Date getSla() {
        return sla;
    }

    public Integer getDaysOpen() {
        return daysOpen;
    }

    public String getStatus() {
        return status;
    }
}
