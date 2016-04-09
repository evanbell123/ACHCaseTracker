
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
        { id: 0, name: "GOV_REC", displayName: "Government Reclamation"},
        { id: 1, name: "POA", displayName: "POA"},
        { id: 2, name: "REV_DEL", displayName: "Reversals/Deletions"},
        { id: 3, name: "RETURN", displayName: "Return"},
        { id: 4, name: "UNRESOLVED", displayName: "Unresolved/Dishonored Returns"}
      ],

      /*
      Case sub-type depends on case type
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
    })



;
})();
