(function () {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('EnumsService', EnumsService);

    function EnumsService() {
        return {
            getEnumIdFromName: function (CaseEnum, name) {
                var enumId = CaseEnum.filter(function (value) {
                    return value.name === name;
                })[0].id;
                return enumId;
            },
            getEnumDisplayFromName: function (CaseEnum, name) {
                var enumId = CaseEnum.filter(function (value) {
                    return value.name === name;
                })[0].displayName;
                return enumId;
            },
            getEnumNameFromDisplay: function (CaseEnum, display) {
                var enumId = CaseEnum.filter(function (value) {
                    return value.displayName === display;
                })[0].name;
                return enumId;
            },
            getDomainFromEnumId: function(CaseTypeEnum, id) {
                var domain = CaseTypeEnum.filter(function (value) {
                    return value.id === id;
                })[0].domain;
                return domain;
            }

        }
    }
})();
