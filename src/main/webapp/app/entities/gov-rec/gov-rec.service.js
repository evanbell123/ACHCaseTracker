(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('GovRec', GovRec);

    GovRec.$inject = ['$resource', 'DateUtils'];

    function GovRec ($resource, DateUtils) {
        var resourceUrl =  'api/gov-recs/:id';

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
