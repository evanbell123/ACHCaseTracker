 (function() {
     'use strict';
     angular
         .module('achCaseTrackingApp')
         .factory('ACHCase', ACHCase);

     ACHCase.$inject = ['$state', '$resource', 'DateUtils', 'Enums', 'EnumsService'];

     function ACHCase($state, $resource, DateUtils, Enums, EnumsService) {

         var resourceUrl = 'api/ach-case/:id';

         return $resource(resourceUrl, {}, {
             'all': {
                 method: 'GET',
                 isArray: true,
                 params: {status: null, fromDate: null, toDate: null},
                 transformResponse: function(caseData) {
                     if (caseData !== undefined || caseData.length !== 0) {
                         return transformManyAchCases(angular.fromJson(caseData));
                     } else {
                         return caseData;
                     }
                 }
             },
             'assigned': {
                 url: 'api/my-cases',
                 method: 'GET',
                 isArray: true,
                 transformResponse: function(caseData) {
                     return transformManyAchCases(angular.fromJson(caseData));
                 }
             },
             'one': {
                 method: 'GET',
                 transformResponse: function(caseData) {
                     return transformSingleAchCase(angular.fromJson(caseData));
                 }
             },
             'create': {
                 method: 'POST',
                 transformRequest: function(caseData) {
                     /*
                      Assign the @class property base on the case type
                      */
                     caseData.caseDetail['@class'] = EnumsService.getDomainFromEnumId(Enums.CaseType, caseData.type);
                     return transformCaseRequest(caseData);
                 },
                 transformResponse: function(caseData) {
                     return transformSingleAchCase(angular.fromJson(caseData));
                 }
             },
             'update': {
                 method: 'PUT',
                 transformRequest: function(caseData) {
                     return transformCaseRequest(caseData);
                 },
                 transformResponse: function(caseData) {
                     return transformSingleAchCase(angular.fromJson(caseData));
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
             copyData.caseDetail.payments = copyData.payments;
             copyData.caseDetail.notes = copyData.notes;

             /*
              Then get rid the copied payments and notes
              */
             delete copyData.payments;
             delete copyData.notes;


             delete caseData.isWatched;

             return angular.toJson(copyData);
         }

         function transformSingleAchCase(caseData) {
             /*
              convert enums to integers
              */
             if ($state.is("ach-case.edit")) {
                 caseData.status = EnumsService.getEnumIdFromName(Enums.CaseStatus, caseData.status);
                 caseData.type = EnumsService.getEnumIdFromName(Enums.CaseType, caseData.type);
                 caseData.caseDetail.subtype = EnumsService.getEnumIdFromName(Enums.CaseSubtype, caseData.caseDetail.subtype);

                 if (caseData.caseDetail.recoveryInfo !== null) {
                     caseData.caseDetail.recoveryInfo.method = EnumsService.getEnumIdFromName(Enums.RecoveryMethod, caseData.caseDetail.recoveryInfo.method);
                 }
             }


             //data.lastPaymentOn = new Date(data.lastPaymentOn);
             //data.slaDeadline = new Date(data.slaDeadline);





             caseData.createdDate = DateUtils.convertDateTimeFromServer(caseData.createdDate);
             caseData.lastPaymentOn = DateUtils.convertDateTimeFromServer(caseData.lastPaymentOn);
             caseData.beneficiary.dateOfDeath = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateOfDeath);
             caseData.beneficiary.dateCBAware = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateCBAware);
             caseData.completedOn = DateUtils.convertDateTimeFromServer(caseData.completedOn);


             //console.log(caseData.caseDetail.payments);

             caseData.payments = caseData.caseDetail.payments;
             caseData.notes = caseData.caseDetail.notes;

             if (caseData.payments !== null) {
                 for (var i = 0; i < caseData.payments.length; i++) {
                     caseData.payments[i].effectiveOn = DateUtils.convertDateTimeFromServer(caseData.payments[i].effectiveOn);
                 }
             }


             caseData.caseDetail.payments = null;
             caseData.caseDetail.notes = null;

             caseData.isWatched = true;
             if (caseData.assignedTo === "N/A") {
                 caseData.isWatched = false;
             }
             console.log("intially watched = " + caseData.isWatched);

             return caseData;
         }

         function transformManyAchCases(caseArray) {
             for (var i = 0; i < caseArray.length; i++) {
                 caseArray[i] = transformSingleAchCase(caseArray[i]);

             }
             return caseArray
         }
     }
 })();
