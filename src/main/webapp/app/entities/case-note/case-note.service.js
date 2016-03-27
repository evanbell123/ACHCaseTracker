(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('CaseNote', CaseNote);

    CaseNote.$inject = ['$resource'];

    function CaseNote ($resource) {
        var resourceUrl =  'api/case-notes/:id';

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
