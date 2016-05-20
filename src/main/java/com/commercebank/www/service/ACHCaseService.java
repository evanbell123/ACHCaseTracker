package com.commercebank.www.service;

import com.commercebank.www.domain.*;
import com.commercebank.www.domain.enumeration.CaseSubtype;
import com.commercebank.www.domain.enumeration.RecoveryDetail;
import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.repository.*;
import com.commercebank.www.service.util.BusinessDayUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

import static com.commercebank.www.domain.enumeration.CaseType.*;

@Service
public class ACHCaseService {
    private final Logger log = LoggerFactory.getLogger(ACHCaseService.class);

    @Inject
    private GovRecService govRecService;

    @Inject
    private ACHCaseRepository achCaseRepository;

    @Inject
    private BeneficiaryRepository beneficiaryRepository;

    @Inject
    private SLARepository slaRepository;

    /*
    * Nested objects stored as DBRefs need to be saved before saving the case.
    */
    public ACHCase cascadeSave(ACHCase achCase) {
        if (achCase != null) {
            switch (achCase.getType()) {
                case GOV_REC:
                    GovRec govRec = (GovRec) achCase.getCaseDetail();
                    if (govRec != null) {
                        govRecService.cascadeSave(govRec);
                    }
                    break;
                case POA:
                    break;
                case REV_DEL:
                    break;
                case RETURN:
                    break;
                case UNRESOLVED:
                    break;
                default:
            }

            if (achCase.getBeneficiary() != null)
                beneficiaryRepository.save(achCase.getBeneficiary());

            achCase = achCaseRepository.save(achCase);
            log.debug("Saved Information for ACH Case: {}", achCase);
        }
        return achCase;
    }
    //TODO: return string with message about specific fields that need to have values
    public String closeCase(ACHCase achCase)
    {
        if (achCase.getCompletedOn() == null) { return "Completion date is empty."; }
        if (achCase.getCompletedBy() == null) { return "Completed by is empty."; }

        Beneficiary beneficiary = achCase.getBeneficiary();
        if (beneficiary == null) { return "There is no beneficiary assigned to this case."; }
        if (beneficiary.getName() == null) { return "The beneficiary doesn't have a name."; }
        if (beneficiary.getAccountNum() == null) { return "The beneficiary's account number is not set."; }
        if (beneficiary.getDateOfDeath() == null) { return "The beneficiary's date of death is not set."; }
        if (beneficiary.getDateCBAware() == null) { return "The date Commerce Bank became aware of beneficiary's death is not set."; }
        if (beneficiary.isOtherGovBenefits() ==  null) { return "It is not specified whether the beneficiary has any other government benefits."; }

        GovRec govRec = (GovRec) achCase.getCaseDetail();
        if (govRec == null) { return "There are no details regarding the case subtype."; }
        if (govRec.getSubtype() == CaseSubtype.TREAS_REFUND || govRec.getSubtype() == CaseSubtype.TREAS_REFERRAL)
            if (govRec.getClaimNumber() == null) { return "There is no claim number for this case."; }
        if (govRec.getPayments() != null) {
            for (Payment p : govRec.getPayments()) {
                if (p.getAmount() == null || p.getEffectiveOn() == null) { return "There is missing payment information for this case."; }
            }
        }

        Recovery recovery = govRec.getRecoveryInfo();
        if (recovery == null) { return "There is no recovery info set for this case."; }
        if (recovery.getMethod() == null) { return "There is no recovery method for this case."; }
        RecoveryDetail detail = recovery.getDetailType();
        if (detail == RecoveryDetail.GL_COST || detail == RecoveryDetail.IN_ACCT || detail == RecoveryDetail.DESC)
            if (recovery.getDetailValue() == null) { return "The recovery method is missing details."; }

        achCase.setStatus(Status.CLOSED);
        achCaseRepository.save(achCase);
        log.debug("ACHCase with ID: {}, has been closed.");
        return null;
    }

    public ACHCase createCase(ACHCase achCase)
    {
        achCase.setStatus(Status.OPEN);
        initializeSLA(achCase);
        return cascadeSave(achCase);
    }

    public ACHCase updateOnSave(ACHCase achCase)
    {
        updateSLA(achCase);
        if (achCase.getAssignedTo() != null) {
            achCase.setStatus(Status.IN_PROGRESS);
        }
        else {
            achCase.setStatus(Status.OPEN);
        }
        return cascadeSave(achCase);
    }

    public ACHCase updateOnRetrieve(ACHCase achCase)
    {
        achCase.setDaysOpen(achCase.getCreatedDate().until(ZonedDateTime.now(), ChronoUnit.DAYS));
        if (achCase.getSlaDeadline().compareTo(LocalDate.now()) < 0)
            achCase.setMissedSLACount(achCase.getMissedSLACount() + 1);
        return achCase;
    }

    private ACHCase updateSLA(ACHCase achCase)
    {
        //Only concerned with government reclamation type cases
        if (achCase.getType() == GOV_REC) {
            //Cases of treasury subtypes do not update their SLAs
            if (achCase.getCaseDetail().getSubtype() != CaseSubtype.TREAS_REFERRAL && achCase.getCaseDetail().getSubtype() != CaseSubtype.TREAS_REFUND) {
                //Case is being watched for the first time
                if (achCase.getAssignedTo() != null && achCase.getSla() == slaRepository.findOneById("non-treasury-initial").get()) {
                    achCase.setSla(slaRepository.findOneById("non-treasury-standard").get());
                    achCase.setSlaDeadline(BusinessDayUtil.addBusinessDays(((GovRec) achCase.getCaseDetail()).latestPaymentDate(), achCase.getSla().getBusinessDays()));
                }
                //Other cases get reset starting from today's date
                else
                    achCase.setSla(slaRepository.findOneById("non-treasury-standard").get());
                    achCase.setSlaDeadline(BusinessDayUtil.addBusinessDays(LocalDate.now(), achCase.getSla().getBusinessDays()));
            }
        }
        return achCase;
    }

    private ACHCase initializeSLA(ACHCase achCase)
    {
        if (achCase.getType() == GOV_REC) {
            if (achCase.getCaseDetail().getSubtype() != CaseSubtype.TREAS_REFERRAL && achCase.getCaseDetail().getSubtype() != CaseSubtype.TREAS_REFUND) {
                achCase.setSla(slaRepository.findOneById("non-treasury-initial").get());
                achCase.setSlaDeadline(BusinessDayUtil.addBusinessDays(LocalDate.now(), achCase.getSla().getBusinessDays()));
            }
            else {
                achCase.setSla(slaRepository.findOneById("treasury-standard").get());
                achCase.setSlaDeadline(BusinessDayUtil.addBusinessDays(LocalDate.now(), achCase.getSla().getBusinessDays()));
            }
        }
        return achCase;
    }
}
