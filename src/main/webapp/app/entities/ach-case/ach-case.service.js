 (function() {
     'use strict';
     angular
         .module('achCaseTrackingApp')
         .factory('ACHCase', ACHCase);

     ACHCase.$inject = ['$resource', 'DateUtils'];

     function ACHCase($resource, DateUtils) {
         var resourceUrl = 'api/ach-case/:id';

         return $resource(resourceUrl, {}, {
             'all': {
                 method: 'GET',
                 isArray: true,
                 params: {status: null, fromDate: null, toDate: null},
                 transformResponse: function(data) {
                     if (data !== undefined || data.length !== 0) {
                         return transformManyAchCases(angular.fromJson(data));
                     } else {
                         return data;
                     }
                 }
             },
             'assigned': {
                 url: 'api/my-cases',
                 method: 'GET',
                 isArray: true,
                 transformResponse: function(data) {
                     return transformManyAchCases(angular.fromJson(data));
                 }
             },
             'one': {
                 method: 'GET',
                 transformResponse: function(data) {
                     return transformSingleAchCase(angular.fromJson(data));
                 }
             },
             'create': {
                 method: 'POST',
                 transformRequest: function(data) {
                     return transformCaseRequest(data);
                 }
             },
             'update': {
                 method: 'PUT',
                 transformRequest: function(data) {
                     return transformCaseRequest(data);
                 }
             }
         });

         function transformCaseRequest(caseData) {
             /*
              make a copy
              */
             var copyData = caseData;

             /*
              Copy the payments and notes JSON,
              into the proper spot
              */
             copyData.caseDetail.payments = caseData.payments;
             copyData.caseDetail.notes = caseData.notes;

             /*
              Then get rid the copied payments and notes
              */
             delete copyData.payments;
             delete copyData.notes;

             return angular.toJson(copyData);
         }

         function transformSingleAchCase(caseData) {
             /*
              convert enums to integers
              */
             //caseData.status = EnumsService.getEnumIdFromName(Enums.CaseStatus, caseData.status);
             //caseData.type = EnumsService.getEnumIdFromName(Enums.CaseType, caseData.type);
             //caseData.caseDetail.subtype = EnumsService.getEnumIdFromName(Enums.CaseSubtype, caseData.caseDetail.subtype);

             if (caseData.caseDetail.recoveryInfo !== null) {
                 //caseData.caseDetail.recoveryInfo.method = EnumsService.getEnumIdFromName(Enums.RecoveryMethod, caseData.caseDetail.recoveryInfo.method);
             }

             //data.lastPaymentOn = new Date(data.lastPaymentOn);
             //data.slaDeadline = new Date(data.slaDeadline);

             if (caseData.assignedTo === null) {
                 caseData.isWatched = false;
             } else {
                 caseData.isWatched = true;
             }

             caseData.lastPaymentOn = DateUtils.convertDateTimeFromServer(caseData.lastPaymentOn);
             caseData.slaDeadline = DateUtils.convertDateTimeFromServer(caseData.slaDeadline);
             caseData.beneficiary.dateOfDeath = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateOfDeath);
             caseData.beneficiary.dateCBAware = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateCBAware);
             caseData.completedOn = DateUtils.convertDateTimeFromServer(caseData.completedOn);

             caseData.payments = caseData.caseDetail.payments;
             caseData.notes = caseData.caseDetail.notes;

             if (caseData.payments !== null) {
                 for (var i = 0; i < caseData.payments.length; i++) {
                     caseData.payments[i].effectiveOn = DateUtils.convertDateTimeFromServer(caseData.payments[i].effectiveOn);
                 }
             }


             caseData.caseDetail.payments = null;
             caseData.caseDetail.notes = null;

             //console.log(caseData.isWatched);

             return caseData;
         }

         function transformManyAchCases(caseArray) {
           console.log("transformManyAchCases");
             for (var i = 0; i < caseArray.length; i++) {
                 caseArray[i] = transformSingleAchCase(caseArray[i]);
             }
             return caseArray
         }
     }
 })();
