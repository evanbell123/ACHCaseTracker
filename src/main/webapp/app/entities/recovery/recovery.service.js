(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('Recovery', Recovery);

    Recovery.$inject = ['$resource'];

    function Recovery ($resource) {
        var resourceUrl =  'api/recoveries/:id';

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
