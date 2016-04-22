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

    public ACHCase cascadeSave(ACHCase achCase)
    {
        GovRec govRec = (GovRec) achCase.getCaseDetail();
        if (govRec != null)
        {
            List<Payment> payments = govRec.getPayments();
            for (Payment p : payments)
                paymentRepository.save(p);
            List<CaseNote> notes = govRec.getNotes();
            for (CaseNote n : notes)
                caseNoteRepository.save(n);
            recoveryRepository.save(govRec.getRecoveryInfo());
            govRecRepository.save(govRec);
        }
        beneficiaryRepository.save(achCase.getBeneficiary());
        achCaseRepository.save(achCase);
        log.debug("Saved Information for ACH Case: {}", achCase);
        return achCase;
    }
}
