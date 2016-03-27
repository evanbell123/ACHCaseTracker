package com.commercebank.www.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Objects;

/**
 * A Beneficiary.
 */

@Document(collection = "beneficiary")
public class Beneficiary implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @Field("customerID")
    private String customerID;

    @Field("name")
    private String name;

    @Pattern(regexp = "^(?!000|666)[0-8][0-9]{2}(?!00)[0-9]{2}(?!0000)[0-9]{4}$")
    @Field("ssn")
    private String ssn;

    @Field("account_num")
    private Long accountNum;

    @Field("date_of_death")
    private LocalDate dateOfDeath;

    @Field("date_cb_aware")
    private ZonedDateTime dateCBAware;

    @Field("other_gov_benefits")
    private Boolean otherGovBenefits;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerID() {
        return customerID;
    }

    public void setCustomerID(String customerID) {
        this.customerID = customerID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSSN() {
        return ssn;
    }

    public void setSSN(String ssn) {
        this.ssn = ssn;
    }

    public Long getAccountNum() {
        return accountNum;
    }

    public void setAccountNum(Long accountNum) {
        this.accountNum = accountNum;
    }

    public LocalDate getDateOfDeath() {
        return dateOfDeath;
    }

    public void setDateOfDeath(LocalDate dateOfDeath) {
        this.dateOfDeath = dateOfDeath;
    }

    public ZonedDateTime getDateCBAware() {
        return dateCBAware;
    }

    public void setDateCBAware(ZonedDateTime dateCBAware) {
        this.dateCBAware = dateCBAware;
    }

    public Boolean isOtherGovBenefits() {
        return otherGovBenefits;
    }

    public void setOtherGovBenefits(Boolean otherGovBenefits) {
        this.otherGovBenefits = otherGovBenefits;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Beneficiary beneficiary = (Beneficiary) o;
        if(beneficiary.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, beneficiary.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Beneficiary{" +
            "id=" + id +
            ", customerID='" + customerID + "'" +
            ", name='" + name + "'" +
            ", ssn='" + ssn + "'" +
            ", accountNum='" + accountNum + "'" +
            ", dateOfDeath='" + dateOfDeath + "'" +
            ", dateCBAware='" + dateCBAware + "'" +
            ", otherGovBenefits='" + otherGovBenefits + "'" +
            '}';
    }
}