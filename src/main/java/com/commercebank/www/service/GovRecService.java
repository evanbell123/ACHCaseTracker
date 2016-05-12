package com.commercebank.www.service;

import com.commercebank.www.domain.CaseNote;
import com.commercebank.www.domain.GovRec;
import com.commercebank.www.domain.Payment;
import com.commercebank.www.repository.CaseNoteRepository;
import com.commercebank.www.repository.GovRecRepository;
import com.commercebank.www.repository.PaymentRepository;
import com.commercebank.www.repository.RecoveryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;

/**
 * Created by Steven on 4/23/2016.
 */
@Service
public class GovRecService
{
    private final Logger log = LoggerFactory.getLogger(ACHCaseService.class);

    @Inject
    private GovRecRepository govRecRepository;

    @Inject
    private PaymentRepository paymentRepository;

    @Inject
    private CaseNoteRepository caseNoteRepository;

    @Inject
    private RecoveryRepository recoveryRepository;

    public GovRec cascadeSave(GovRec govRec)
    {
        if (govRec != null) {
            if (govRec.getPayments() != null) {
                for (Payment p : govRec.getPayments()) {
                    govRec.setPaymentTotal(govRec.getPaymentTotal().add(p.getAmount()));
                    paymentRepository.save(p);
                }
                govRec.setPaymentCount((long)govRec.getPayments().size());
            }
            if (govRec.getNotes() != null)
                for (CaseNote n : govRec.getNotes())
                    caseNoteRepository.save(n);
            if (govRec.getRecoveryInfo() != null)
                recoveryRepository.save(govRec.getRecoveryInfo());

            govRec = govRecRepository.save(govRec);
            log.debug("Saved Information for ACH Case: {}", govRec);
        }
        return govRec;
    }
}
