package com.commercebank.www.config.audit;

import com.commercebank.www.config.Constants;
import com.commercebank.www.security.SecurityUtils;
import org.javers.spring.auditable.AuthorProvider;
import org.springframework.stereotype.Component;

@Component
public class JaversAuthorProvider implements AuthorProvider {

   @Override
   public String provide() {
       String userName = SecurityUtils.getCurrentUserLogin();
       return (userName != null ? userName : Constants.SYSTEM_ACCOUNT);
   }
}
