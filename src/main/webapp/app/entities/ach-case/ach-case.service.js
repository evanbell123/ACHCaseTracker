 (function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('ACHCase', ACHCase);

    ACHCase.$inject = ['$resource', 'DateUtils'];

    function ACHCase ($resource, DateUtils) {
        var resourceUrl =  'api/ach-case/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    if (data.lastPaymentOn !== null) { data.lastPaymentOn = DateUtils.convertDateTimeFromServer(data.lastPaymentOn); }
                    else { data.lastPaymentOn = undefined; }
                    if (data.slaDeadline !== null) { data.slaDeadline = DateUtils.convertDateTimeFromServer(data.slaDeadline); }
                    else { data.slaDeadline = undefined; }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
