(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('Dashboard', Dashboard);

    Dashboard.$inject = ['$resource', 'Enums', 'EnumsService'];

    function Dashboard ($resource, Enums, EnumsService) {

        var service = $resource('/api/dashboard', {}, {
            'query': {
                method: 'GET',
                isArray: false,
                params: {fromDate: null, toDate: null},
                transformResponse: function(data) {
                    data = angular.fromJson(data);
                    var cases = data.cases;
                    if (cases !== undefined && cases.length !== 0) {
                        cases = transformManyAchCases(cases);
                        data.cases = cases;
                        return data;
                    }
                    else { return data; }
                }
            }
        });

        function transformSingleAchCase(data) {
            data.type = EnumsService.getEnumDisplayFromName(Enums.CaseType, data.type);
            data.caseDetail.subtype = EnumsService.getEnumDisplayFromName(Enums.CaseSubtype, data.caseDetail.subtype);
            return data;
        }

        function transformManyAchCases(data) {
            for (var i = 0; i < data.length; i++)
                data[i] = transformSingleAchCase(data[i]);
            return data;
        }
        return service;
    }
})();
