(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('DataService', FormDataService);
    FormDataService.$inject = ['$http', '$q'];

    function FormDataService($http, $q) {
        return {
            type: type,
            subtype: subtype,
            recovery: recovery
        };

        function type() {
            var deferred = $q.defer();
            // dummy data
            var data = [{
                id: 1,
                name: 'Government Reclamations'
            }, {
                id: 2,
                name: 'POA'
            }, {
                id: 3,
                name: 'Reversals/Deletions'
            }, {
                id: 4,
                name: 'Returns'
            }, {
                id: 5,
                name: 'Unresolved/Dishonored Returns'
            }];
            deferred.resolve(data);
            return deferred.promise;
        }

        function subtype(type_id) {
            var deferred = $q.defer();
            // dummy data
            var data = [{
                id: 1,
                fk: 1,
                name: 'Government Reclamations'
            }, {
                id: 2,
                fk: 1,
                name: 'CRF'
            }, {
                id: 3,
                fk: 1,
                name: 'DCN'
            }, {
                id: 4,
                fk: 1,
                name: 'DNE'
            }, {
                id: 5,
                fk: 1,
                name: 'Treasury Referral'
            }, {
                id: 6,
                fk: 1,
                name: 'Treasury Refund'
            }];
            if (!!type_id) {
                var tmp = [];
                angular.forEach(data, function(val) {
                    if (val.fk === type_id)
                        tmp.push(val);
                });
                deferred.resolve(tmp);
            } else {
                deferred.resolve(data);
            }


            return deferred.promise;
        }

        function recovery(subtype_id) {
            var deferred = $q.defer();
            // dummy data
            var data = [{
                id: 1,
                fk: 1,
                name: 'ACH Return'
            }, {
                id: 2,
                fk: 1,
                name: 'Cashiers Check Mailed'
            }, {
                id: 3,
                fk: 1,
                name: 'Mixed Method'
            }, {
                id: 4,
                fk: 2,
                name: 'ACH Return'
            }, {
                id: 5,
                fk: 2,
                name: 'Cashiers Check Mailed'
            }, {
                id: 6,
                fk: 2,
                name: 'Mixed Method'
            }, {
                id: 7,
                fk: 3,
                name: 'ACH Return'
            }, {
                id: 8,
                fk: 3,
                name: 'Cashiers Check Mailed'
            }, {
                id: 9,
                fk: 3,
                name: 'Mixed Method'
            }, {
                id: 10,
                fk: 4,
                name: 'ACH Return'
            }, {
                id: 11,
                fk: 4,
                name: 'Cashiers Check Mailed'
            }, {
                id: 12,
                fk: 4,
                name: 'Mixed Method'
            }, {
                id: 13,
                fk: 5,
                name: 'Commerce Bank'
            }, {
                id: 14,
                fk: 5,
                name: 'Customer DDA'
            }, {
                id: 15,
                fk: 5,
                name: 'Other'
            }, {
                id: 16,
                fk: 6,
                name: 'Commerce Bank'
            }, {
                id: 17,
                fk: 6,
                name: 'Customer DDA'
            }, {
                id: 18,
                fk: 6,
                name: 'Other'
            },{
                id: 19,
                fk: 1,
                name: 'No Funds'
            },{
                id: 20,
                fk: 2,
                name: 'No Funds'
            },{
                id: 21,
                fk: 3,
                name: 'No Funds'
            },{
                id: 22,
                fk: 4,
                name: 'No Funds'
            },{
                id: 23,
                fk: 5,
                name: 'No Funds'
            },{
                id: 24,
                fk: 6,
                name: 'No Funds'
            }];
            if (!!subtype_id) {
                var tmp = [];
                angular.forEach(data, function(val) {
                    if (val.fk === subtype_id)
                        tmp.push(val);
                });
                deferred.resolve(tmp);
            } else {
                deferred.resolve(data);
            }


            return deferred.promise;
        }
    }

    mapCaseStatusFilter.$inject = ['Enums'];

    function mapCaseStatusFilter(Enums) {

        var statusHash = {};

        for (var i = 0; i < Enums.CaseStatus.length; i++) {
          statusHash[Enums.CaseStatus[i].id] = Enums.CaseStatus[i].name;
        }

        return function(input) {
            if (!input) {
                return '--';
            } else {
                return statusHash[input];
            }
        };
    }

    mapCaseTypeFilter.$inject = ['Enums'];

    function mapCaseTypeFilter(Enums) {

        var typeHash = {};

        for (var i = 0; i < Enums.CaseType.length; i++) {
          typeHash[Enums.CaseType[i].id] = Enums.CaseType[i].name;
        }

        return function(input) {
            if (!input) {
                return '';
            } else {
                return typeHash[input];
            }
        };
    }

    mapCaseSubtypeFilter.$inject = ['Enums'];

    function mapCaseSubtypeFilter(Enums) {
      /*
        var subtypeHash = {
            1: 'GOV_REC',
            2: 'DNE',
            3: 'CRF',
            4: 'TREAS_REFERRAL',
            5: 'TREAS_REFUND'
        };
        */

        var subtypeHash = {};

        for (var i = 0; i < Enums.CaseSubtype.length; i++) {
          subtypeHash[Enums.CaseSubtype[i].id] = Enums.CaseSubtype[i].name;
        }

        return function(input) {
            if (!input) {
                return '';
            } else {
                return subtypeHash[input];
            }
        };
    }
})();
