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
                    if (data.effectiveOn !== null) { data.effectiveOn = DateUtils.convertDateTimeFromServer(data.effectiveOn); }
                    else { data.effectiveOn = undefined; }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
