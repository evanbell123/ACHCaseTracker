(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('Payment', Payment);

    Payment.$inject = ['$resource', 'DateUtils'];

    function Payment ($resource, DateUtils) {
        var resourceUrl =  'api/payments/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.effectiveOn = DateUtils.convertDateTimeFromServer(data.effectiveOn);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
