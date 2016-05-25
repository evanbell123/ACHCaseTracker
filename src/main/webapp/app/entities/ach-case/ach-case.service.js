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
                 params: { watchItem: false },
                 transformRequest: function(caseData) {
                     return transformCaseRequest(caseData);
                 },
                 transformResponse: function(caseData) {
                     return transformSingleAchCase(angular.fromJson(caseData));
                 }
             }
         });

         function transformCaseRequest(caseData) {
             caseData.status = EnumsService.getEnumNameFromDisplay(Enums.CaseStatus, caseData.status);
             caseData.type = EnumsService.getEnumNameFromDisplay(Enums.CaseType, caseData.type);
             caseData.caseDetail.subtype = EnumsService.getEnumNameFromDisplay(Enums.CaseSubtype, caseData.caseDetail.subtype);
             if (caseData.caseDetail.recoveryInfo !== null) {
                 caseData.caseDetail.recoveryInfo.method = EnumsService.getEnumNameFromDisplay(Enums.RecoveryMethod, caseData.caseDetail.recoveryInfo.method);
             }

             return angular.toJson(caseData);
         }

         function transformSingleAchCase(caseData) {
             caseData.status = EnumsService.getEnumDisplayFromName(Enums.CaseStatus, caseData.status);
             caseData.type = EnumsService.getEnumDisplayFromName(Enums.CaseType, caseData.type);
             caseData.caseDetail.subtype = EnumsService.getEnumDisplayFromName(Enums.CaseSubtype, caseData.caseDetail.subtype);
             if (caseData.caseDetail.recoveryInfo !== null) {
                 caseData.caseDetail.recoveryInfo.method = EnumsService.getEnumDisplayFromName(Enums.RecoveryMethod, caseData.caseDetail.recoveryInfo.method);
             }

             caseData.createdDate = DateUtils.convertDateTimeFromServer(caseData.createdDate);
             caseData.slaDeadline = DateUtils.convertDateTimeFromServer(caseData.slaDeadline);
             caseData.beneficiary.dateOfDeath = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateOfDeath);
             caseData.beneficiary.dateCBAware = DateUtils.convertDateTimeFromServer(caseData.beneficiary.dateCBAware);
             caseData.completedOn = DateUtils.convertDateTimeFromServer(caseData.completedOn);

             if (caseData.caseDetail.payments !== null) {
                 for (var i = 0; i < caseData.caseDetail.payments.length; i++) {
                     caseData.caseDetail.payments[i].effectiveOn = DateUtils.convertDateTimeFromServer(caseData.caseDetail.payments[i].effectiveOn);
                 }
             }

             return caseData;
         }

         function transformManyAchCases(caseArray) {
             for (var i = 0; i < caseArray.length; i++)
                 caseArray[i] = transformSingleAchCase(caseArray[i]);

             return caseArray
         }
     }
 })();
