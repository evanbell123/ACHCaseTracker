(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('ACHCaseTwo', ACHCaseTwo);

    ACHCaseTwo.$inject = ['$resource', 'DateUtils', 'Enums', 'EnumsService'];

    function ACHCaseTwo($resource, DateUtils, Enums, EnumsService) {
        var resourceUrl = 'api/ach-case/:id';
        return $resource(resourceUrl, {}, {
            'all': {
                method: 'GET',
                isArray: true,
                transformResponse: function(data) {
                  return transformManyAchCases(angular.fromJson(data));
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

                /*
                make a copy
                */
                var copyData = data;

                /*
                Copy the payments and notes JSON,
                into the proper spot
                */
                copyData.caseDetail.payments = data.payments;
                copyData.caseDetail.notes = data.notes;

                /*
                Then get rid the copied payments and notes
                */
                delete copyData.payments;
                delete copyData.notes;

                console.log(copyData);

                copyData = angular.toJson(copyData);

                return copyData;
              }
            },
            'update': {
                method: 'PUT'
            }
        });

        function transformSingleAchCase(caseData) {
          /*
          convert enums to integers
          */
          caseData.status = EnumsService.getEnumIdFromName(Enums.CaseStatus, caseData.status);
          caseData.type = EnumsService.getEnumIdFromName(Enums.CaseType, caseData.type);
          caseData.caseDetail.subtype = EnumsService.getEnumIdFromName(Enums.CaseSubtype, caseData.caseDetail.subtype);
          caseData.caseDetail.recoveryInfo.method = EnumsService.getEnumIdFromName(Enums.RecoveryMethod, caseData.caseDetail.recoveryInfo.method);

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
          caseData.caseDetail.completedOn = DateUtils.convertDateTimeFromServer(caseData.caseDetail.completedOn);

          caseData.payments = caseData.caseDetail.payments;
          caseData.notes = caseData.caseDetail.notes;

          caseData.caseDetail.payments = null;
          caseData.caseDetail.notes = null;

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
