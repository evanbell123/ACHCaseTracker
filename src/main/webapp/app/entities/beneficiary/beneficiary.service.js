(function() {
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .factory('Beneficiary', Beneficiary);

    Beneficiary.$inject = ['$resource', 'DateUtils'];

    function Beneficiary ($resource, DateUtils) {
        var resourceUrl =  'api/beneficiaries/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.dateOfDeath = DateUtils.convertLocalDateFromServer(data.dateOfDeath);
                    data.dateCBAware = DateUtils.convertDateTimeFromServer(data.dateCBAware);
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.dateOfDeath = DateUtils.convertLocalDateToServer(data.dateOfDeath);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.dateOfDeath = DateUtils.convertLocalDateToServer(data.dateOfDeath);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
