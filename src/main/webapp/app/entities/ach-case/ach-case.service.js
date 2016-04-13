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
                    data.lastPaymentOn = DateUtils.convertDateTimeFromServer(data.lastPaymentOn);
                    data.slaDeadline = DateUtils.convertDateTimeFromServer(data.slaDeadline);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
