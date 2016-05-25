
(function () {
    "use strict";
    angular.module("achCaseTrackingApp")

    .constant("Enums", {

      CaseStatus: [
        { id: 0, name: "OPEN", displayName: "Open"},
        { id: 1, name: "IN_PROGRESS", displayName: "In Progress"},
        { id: 2, name: "CLOSED", displayName: "Closed"}
      ],

      CaseType: [
        { id: 0, name: "GOV_REC", displayName: "Government Reclamation", domain: "com.commercebank.www.domain.GovRec"},
        { id: 1, name: "POA", displayName: "POA", domain: "com.commercebank.www.domain.POA"},
        { id: 2, name: "REV_DEL", displayName: "Reversal/Deletion", domain: "com.commercebank.www.domain.RevDel"},
        { id: 3, name: "RETURN", displayName: "Return", domain: "com.commercebank.www.domain.Return"},
        { id: 4, name: "UNRESOLVED", displayName: "Unresolved/Dishonored Return", domain: "com.commercebank.www.domain.Unresolved"}
      ],

      /*
      In order to understand this remaining enums,
      think of the id as the primary key, and
      fk is the foriegn key to which it depends on
      */

      /*
      Case sub-type depends on case type
      This means that the foriegn for each sub-type
      refers to the primary id of the case type to which it
      depends on
      */
      CaseSubtype: [
        { id: 0, name: "DNE", displayName: "DNE", fk: [0]},
        { id: 1, name: "CRF", displayName: "CRF", fk: [0]},
        { id: 2, name: "DCN", displayName: "DCN", fk: [0]},
        { id: 3, name: "GOV_REC", displayName: "Government Reclamation", fk: [0]},
        { id: 4, name: "TREAS_REFERRAL", displayName: "Treasury Referral", fk: [0]},
        { id: 5, name: "TREAS_REFUND", displayName: "Treasury Refund", fk: [0]}
      ],

      /*
      Recovery method depends on case sub-type
      */
      RecoveryMethod: [
        { id: 0, name: "ACH_RETURN", displayName: "ACH Return", fk: [0,1,2,3]},
        { id: 1, name: "CHECK_MAILED", displayName: "Cashiers Check Mailed", fk: [0,1,2,3]},
        { id: 2, name: "MIXED_METHOD", displayName: "Mixed Method", fk: [0,1,2,3]},
        { id: 3, name: "COMMERCE", displayName: "Commerce Bank", fk: [4,5]},
        { id: 4, name: "CUST_DDA", displayName: "Customer DDA", fk: [4,5]},
        { id: 5, name: "NO_FUNDS", displayName: "No Funds", fk: [0,1,2,3,4,5]},
        { id: 6, name: "OTHER", displayName: "Other", fk: [4,5]}
      ],

      /*
      Recovery details depends on case recovery method
      */
      RecoveryDetail: [
        { id: 0, name: "CHK_NUM", displayName: "Check Number", fk: [1]},
        { id: 1, name: "GL_COST", displayName: "GL and Cost Center", fk: [3]},
        { id: 2, name: "IN_ACCT", displayName: "Account Number", fk: [4]},
        { id: 3, name: "DESC", displayName: "Description", fk: [6]},
      ],
    })



;
})();
