(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .filter('mapCaseStatus', mapCaseStatusFilter)
        .filter('mapCaseType', mapCaseTypeFilter)
        .filter('mapCaseSubtype', mapCaseSubtypeFilter);

    mapCaseStatusFilter.$inject = ['Enums'];

    function mapCaseStatusFilter(Enums) {

        var statusHash = {};

        for (var i = 0; i < Enums.CaseStatus.length; i++) {
          statusHash[Enums.CaseStatus[i].id] = Enums.CaseStatus[i].name;
        }

        //console.log(statusHash);

        return function(input) {
            if (input==null) {
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

        //console.log(typeHash);

        return function(input) {
            if (input==null) {
                return '--';
            } else {
                return typeHash[input];
            }
        };
    }

    mapCaseSubtypeFilter.$inject = ['Enums'];

    function mapCaseSubtypeFilter(Enums) {

        var subtypeHash = {};

        for (var i = 0; i < Enums.CaseSubtype.length; i++) {
          subtypeHash[Enums.CaseSubtype[i].id] = Enums.CaseSubtype[i].name;
        }

        return function(input) {
            if (input==null) {
                return '';
            } else {
                return subtypeHash[input];
            }
        };
    }
})();
