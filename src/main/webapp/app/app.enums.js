
(function () {
    "use strict";
    angular.module("achCaseTrackingApp")

    .constant("Enums", {
      CaseType: [
        { id: 0, name: "GOV_REC", displayName: "Government Reclamation"},
        { id: 1, name: "POA", displayName: "POA"},
        { id: 2, name: "REV_DEL", displayName: "Reversals/Deletions"},
        { id: 3, name: "RETURN", displayName: "Return"},
        { id: 4, name: "UNRESOLVED", displayName: "Unresolved"}
      ],

      CaseSubtype: [
        { id: 0, name: "DNE", displayName: "DNE"},
        { id: 1, name: "CRF", displayName: "CRF"},
        { id: 2, name: "DCN", displayName: "DCN"},
        { id: 3, name: "GOV_REC", displayName: "GOV_REC"},
        { id: 4, name: "TREAS_REFERRAL", displayName: "TREAS_REFERRAL"},
        { id: 5, name: "TREAS_REFUND", displayName: "TREAS_REFUND"}
      ],

      CaseStatus: [
        { id: 0, name: "OPEN", displayName: "Open"},
        { id: 1, name: "IN_PROGRESS", displayName: "In Progress"},
        { id: 2, name: "CLOSED", displayName: "Closed"}
      ]
    })

;
})();
