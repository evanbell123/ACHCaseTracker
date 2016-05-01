package com.commercebank.www.web.rest.dto;


public class DashboardDTO {

    private Long createdCount;

    private Long paymentsReturned;

    private Long closedCount;

    private Long slaAverage;

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

    public Long getSlaAverage() {
        return slaAverage;
    }

    public void setSlaAverage(Long slaAverage) {
        this.slaAverage = slaAverage;
    }

    @Override
    public String toString() {
        return "DashboardDTO{" +
            "createdCount = " + createdCount + "" +
            "closedCount = " + closedCount + "" +
            "paymentsReturned = " + paymentsReturned + "" +
            "slaAverage = " + "" +
            "}";
    }
}

