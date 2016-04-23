package com.commercebank.www.service;

import com.commercebank.www.domain.ACHCase;
import com.commercebank.www.domain.CaseNote;
import com.commercebank.www.domain.GovRec;
import com.commercebank.www.domain.Payment;
import com.commercebank.www.repository.*;
import com.commercebank.www.web.rest.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.List;

@Service
public class ACHCaseService
{
    private final Logger log = LoggerFactory.getLogger(ACHCaseService.class);

    @Inject
    private ACHCaseRepository achCaseRepository;
    @Inject
    private GovRecRepository govRecRepository;
    @Inject
    private BeneficiaryRepository beneficiaryRepository;
    @Inject
    private PaymentRepository paymentRepository;
    @Inject
    private CaseNoteRepository caseNoteRepository;
    @Inject
    private RecoveryRepository recoveryRepository;
    @Inject
    private SLARepository slaRepository;

    /*
    * Nested objects stored as DBRefs need to be saved before saving the case.
    */
    public ACHCase cascadeSave(ACHCase achCase)
    {
        GovRec govRec = (GovRec) achCase.getCaseDetail();
        if (govRec != null)
        {
            if (govRec.getPayments() != null)
                for (Payment p : govRec.getPayments())
                    paymentRepository.save(p);
            if (govRec.getNotes() != null)
                for (CaseNote n : govRec.getNotes())
                    caseNoteRepository.save(n);
            if (govRec.getRecoveryInfo() != null)
                recoveryRepository.save(govRec.getRecoveryInfo());
            govRecRepository.save(govRec);
        }
        if (achCase.getBeneficiary() != null)
            beneficiaryRepository.save(achCase.getBeneficiary());
        if (achCase.getSla() != null)
            slaRepository.save(achCase.getSla());
        achCaseRepository.save(achCase);
        log.debug("Saved Information for ACH Case: {}", achCase);
        return achCase;
    }
}
