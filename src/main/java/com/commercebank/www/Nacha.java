package com.commercebank.www;

import com.commercebank.www.ach.ACHBatch;
import com.commercebank.www.ach.ACHEntry;
import com.commercebank.www.ach.ACHFile;
import com.commercebank.www.ach.ACHRecordAddenda;
import com.commercebank.www.domain.*;
import com.commercebank.www.domain.enumeration.CaseSubtype;
import com.commercebank.www.domain.enumeration.CaseType;
import com.commercebank.www.domain.enumeration.Status;
import com.commercebank.www.repository.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

public class Nacha
{
    private static ACHCaseRepository achCaseRepository;
    private static BeneficiaryRepository beneficiaryRepository;

    public static void setRepos(ACHCaseRepository achCaseRepo, BeneficiaryRepository beneficiaryRepo)

    {
        achCaseRepository = achCaseRepo;
        beneficiaryRepository = beneficiaryRepo;
    }

    //TODO: Break this into multiple methods, add exception handling and further initialize objects
    public static void processNacha(String fileName) throws Exception
    {
        ACHFile file = new ACHFile();
        try
        {
            file.parseFile(fileName);
        }
        catch (Exception e) { e.printStackTrace(); }

        Integer batchCount = Integer.parseInt(file.getFileControl().getBatchCount());
        for (int i = 0; batchCount.compareTo(i) > 0; i++)
        {
            ACHBatch batch = file.getBatches().get(i);
            Integer recordCount = batch.getEntryRecs().size();

            for (int j = 0; recordCount.compareTo(j) > 0; j++)
            {
                ACHEntry entryRec = batch.getEntryRecs().get(j);

                Beneficiary beneficiary = new Beneficiary();
                beneficiary.setName(entryRec.getEntryDetail().getIndividualName().trim());
                beneficiary.setCustomerID(entryRec.getEntryDetail().getIndividualIdNbr().trim());
                beneficiary.setAccountNum(Long.parseLong(entryRec.getEntryDetail().getDfiAcctNbr().trim()));

                //There should be 1 addenda per entry detail record
                if (entryRec.getAddendaRecs().size() == 0)
                    throw new Exception("The file is missing an addenda record. Processing cannot continue.");

                ACHRecordAddenda addenda = entryRec.getAddendaRecs().get(0);
                String pmtInfo = addenda.getPaymentRelatedInfo().trim();
                String date = "20" + pmtInfo.substring(18, 20) + "-" + pmtInfo.substring(14, 16) + "-" + pmtInfo.substring(16, 18);

                beneficiary.setDateOfDeath(LocalDate.parse(date));
                beneficiary.setSSN(pmtInfo.substring(34, 43));
                //beneficiary.setDateCBAware(ZonedDateTime.now());

                Payment payment = new Payment();
                payment.setAmount(BigDecimal.valueOf(Double.parseDouble(pmtInfo.substring(52, pmtInfo.indexOf('\\')))));

                List<Payment> payments = new ArrayList<>();
                payments.add(payment);

                GovRec govRec = new GovRec();
                govRec.setPayments(payments);
                govRec.setSubtype(CaseSubtype.DNE);
                govRec.setPaymentCount(new Long(1));

                ACHCase achCase = new ACHCase();
                achCase.setDaysOpen(new Long(0));
                //TODO: Add method in SLA Service to get SLA by ID
                achCase.setSlaDeadline(ZonedDateTime.now().plusDays(3));
                achCase.setBeneficiary(beneficiary);
                achCase.setCaseDetail(govRec);
                achCase.setType(CaseType.GOV_REC);
                achCase.setStatus(Status.OPEN);

                //beneficiaryRepository.save(beneficiary);
                achCaseRepository.save(achCase);
            }
        }
    }
}
