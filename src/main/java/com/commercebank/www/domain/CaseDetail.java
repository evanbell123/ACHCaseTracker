package com.commercebank.www.domain;

import com.commercebank.www.domain.enumeration.CaseSubtype;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

/**
 * Created by Steven on 3/23/2016.
 */
@JsonTypeInfo(use=JsonTypeInfo.Id.CLASS, include= JsonTypeInfo.As.PROPERTY, property="@class")
public interface CaseDetail
{
    CaseSubtype getSubtype();

    void setSubtype(CaseSubtype subtype);
}
