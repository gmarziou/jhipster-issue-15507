package com.mycompany.myapp.web.rest.errors;

import com.mycompany.myapp.GeneratedByJHipster;

@GeneratedByJHipster
public class EmailAlreadyUsedException extends BadRequestAlertException {

    private static final long serialVersionUID = 1L;

    public EmailAlreadyUsedException() {
        super(ErrorConstants.EMAIL_ALREADY_USED_TYPE, "Email is already in use!", "userManagement", "emailexists");
    }
}
