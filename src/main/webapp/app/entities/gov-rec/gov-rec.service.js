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
                    if (data.completedOn !== null) { data.completedOn = DateUtils.convertDateTimeFromServer(data.completedOn); }
                    else { data.completedOn  = undefined; }
                    if (data.verifiedOn !== null) { data.verifiedOn = DateUtils.convertDateTimeFromServer(data.verifiedOn); }
                    else { data.verifiedOn = undefined; }
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    }
})();
