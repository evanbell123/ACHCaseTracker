(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('ACHCase', ACHCase);

    ACHCase.$inject = ['$resource', 'DateUtils'];

    function ACHCase ($resource, DateUtils) {
        var resourceUrl =  'api/a-ch-cases/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.lastPaymentOn = DateUtils.convertDateTimeFromServer(data.lastPaymentOn);
                    data.slaDeadline = DateUtils.convertDateTimeFromServer(data.slaDeadline);
                    data.status = getCaseStatusValue(data.status);
                    data.type = getCaseTypeValue(data.type);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });

        function getCaseStatusValue(statusLabel) {
            switch (statusLabel) {
                case 'OPEN':
                    return 1;
                    break;
                case 'IN_PROGRESS':
                    return 2;
                    break;
                case 'CLOSED':
                    return 3;
                    break;
                default:
                    return statusLabel;
                    break;

            }
        }

        function getCaseStatusLabel(statusValue) {
            switch (statusValue) {
                case 1:
                    return 'OPEN';
                    break;
                case 2:
                    return 'IN_PROGRESS';
                    break;
                case 3:
                    return 'CLOSED';
                    break;
                default:
                    return statusValue;
                    break;
            }
        }

        function getCaseTypeValue(typeLabel) {
            switch (typeLabel) {
                case 'GOV_REC':
                    return 1;
                    break;
                case 'POA':
                    return 2;
                    break;
                case 'REV_DEL':
                    return 3;
                    break;
                case 'RETURN':
                    return 4;
                    break;
                case 'UNRESOLVED':
                    return 5;
                    break;
                default:
                    return typeLabel;
                    break;
            }
        }

        function getCaseTypeLabel(typeValue) {
            switch (typeValue) {
                case 1:
                    return 'GOV_REC';
                    break;
                case 2:
                    return 'POA';
                    break;
                case 3:
                    return 'REV_DEL';
                    break;
                case 4:
                    return 'RETURN';
                    break;
                case 5:
                    return 'UNRESOLVED';
                    break;
                default:
                    return typeValue;
                    break;
            }
        }

        function getCaseSubtypeValue(subtypeLabel) {
            switch (subtypeLabel) {
                case 'GOV_REC':
                    return 1;
                    break;
                case 'DNE':
                    return 2;
                    break;
                case 'CRF':
                    return 3;
                    break;
                case 'TREAS_REFERRAL':
                    return 4;
                    break;
                case 'TREAS_REFUND':
                    return 5;
                    break;
                default:
                    return subtypeLabel;
                    break;
            }
        }

        function getCaseSubtypeLabel(subtypeValue) {
            switch (subtypeValue) {
                case 1:
                    return 'GOV_REC';
                    break;
                case 2:
                    return 'DNE';
                    break;
                case 3:
                    return 'CRF';
                    break;
                case 4:
                    return 'TREAS_REFERRAL';
                    break;
                case 5:
                    return 'TREAS_REFUND';
                    break;
                default:
                    return subtypeValue;
                    break;
            }
        }
    }
})();
