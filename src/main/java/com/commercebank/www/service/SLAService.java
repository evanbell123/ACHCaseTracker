package com.commercebank.www.service;

import com.commercebank.www.domain.SLA;
import com.commercebank.www.repository.SLARepository;

import javax.inject.Inject;

/**
 * Created by Steven on 4/22/2016.
 */
public class SLAService
{
    @Inject
    private static SLARepository slaRepository;

    public static SLA getSLA(String id)
    {
        return slaRepository.findOne(id);
    }
}

