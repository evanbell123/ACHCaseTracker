package com.commercebank.www.service;

import com.commercebank.www.domain.*;
import com.commercebank.www.domain.enumeration.CaseSubtype;
import com.commercebank.www.domain.enumeration.RecoveryDetail;
import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.repository.*;
import com.commercebank.www.service.util.BusinessDayUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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
            if (achCase.getSla() != null)
                slaRepository.save(achCase.getSla());

            achCase = achCaseRepository.save(achCase);
            log.debug("Saved Information for ACH Case: {}", achCase);
        }
        return achCase;
    }

    public boolean closeCase(ACHCase achCase)
    {
        Beneficiary beneficiary = achCase.getBeneficiary();
        if (beneficiary == null) { return false; }
        if (beneficiary.getName() == null || beneficiary.getName().isEmpty()) { return false; }
        if (beneficiary.getAccountNum() == null) { return false; }
        if (beneficiary.getDateOfDeath() == null) { return false; }
        if (beneficiary.getDateCBAware() == null) { return false; }
        if (beneficiary.isOtherGovBenefits() ==  null) { return false; }

        GovRec govRec = (GovRec) achCase.getCaseDetail();
        if (govRec == null) { return false; }
        //if (govRec.getCompletedOn() == null) { return false; }
        if (govRec.getSubtype() == CaseSubtype.TREAS_REFUND || govRec.getSubtype() == CaseSubtype.TREAS_REFERRAL)
            if (govRec.getClaimNumber() == null || govRec.getClaimNumber().isEmpty()) { return false; }

        Recovery recovery = govRec.getRecoveryInfo();
        if (recovery == null) { return false; }
        if (recovery.getMethod() == null) { return false; }
        RecoveryDetail detail = recovery.getDetailType();
        if (detail == RecoveryDetail.GL_COST || detail == RecoveryDetail.IN_ACCT || detail == RecoveryDetail.DESC)
            if (recovery.getDetailValue() == null || recovery.getDetailValue().isEmpty()) { return false; }

        if (govRec.getPayments() != null) {
            for (Payment p : govRec.getPayments()) {
                if (p.getAmount() == null || p.getEffectiveOn() == null) { return false; }
            }
        }

        achCase.setStatus(Status.CLOSED);
        achCaseRepository.save(achCase);
        return true;
    }

    public ACHCase updateDaysOpen(ACHCase achCase)
    {
        achCase.setDaysOpen(achCase.getCreatedDate().until(ZonedDateTime.now(), ChronoUnit.DAYS));
        return achCase;
    }

    public ACHCase updateSLA(ACHCase achCase)
    {
            if (achCase.getType() == GOV_REC) {
                //Cases of treasury types do not update their SLAs
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
