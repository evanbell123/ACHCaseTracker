(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('SLA', SLA);

    SLA.$inject = ['$resource'];

    function SLA ($resource) {
        var resourceUrl =  'api/sla/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
