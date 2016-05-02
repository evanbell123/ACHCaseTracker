package com.commercebank.www.web.rest.dto;


import com.commercebank.www.domain.ACHCase;

import java.util.Set;

public class DashboardDTO {

    private Long createdCount;

    private Long paymentsReturned;

    private Long closedCount;

    private Long slaPassed;

    private Set<ACHCase> cases;

    public Long getPaymentsReturned() {
        return paymentsReturned;
    }

    public void setPaymentsReturned(Long paymentsReturned) {
        this.paymentsReturned = paymentsReturned;
    }

    public Long getCreatedCount() {
        return createdCount;
    }

    public void setCreatedCount(Long createdCount) {
        this.createdCount = createdCount;
    }

    public Long getClosedCount() {
        return closedCount;
    }

    public void setClosedCount(Long closedCount) {
        this.closedCount = closedCount;
    }

    public Long getSlaPassed() {
        return slaPassed;
    }

    public void setSlaPassed(Long slaPassed) {
        this.slaPassed = slaPassed;
    }

    public Set<ACHCase> getCases() { return cases; }

    public void setCases(Set<ACHCase> cases) { this.cases = cases; }

    @Override
    public String toString() {
        return "DashboardDTO{" +
            "createdCount = " + createdCount + "" +
            "closedCount = " + closedCount + "" +
            "paymentsReturned = " + paymentsReturned + "" +
            "slaPassed = " + "" +
            "}";
    }
}

