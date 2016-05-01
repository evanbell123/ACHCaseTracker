(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('Dashboard', Dashboard);

    Dashboard.$inject = ['$resource'];

    function Dashboard ($resource) {

        var service = $resource('/api/dashboard', {}, {
            'query': {
                method: 'GET',
                isArray: false,
                params: {fromDate: null, toDate: null}
            }
        });

        return service;
    }
})();
