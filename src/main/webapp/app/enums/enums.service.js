(function () {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('EnumsService', EnumsService);

    //EnumService.$inject = ['Enums'];

    function EnumsService() {
        return {
            getEnumIdFromName: function (CaseEnum, name) {
                console.log(CaseEnum, name);
                var enumId = CaseEnum.filter(function (value) {
                    return value.name === name;
                })[0].id;
                //console.log(enumId, name);
                return enumId;
            },
            getDomainFromEnumId: function(CaseTypeEnum, id) {
                var domain = CaseTypeEnum.filter(function (value) {
                    return value.id === id;
                })[0].domain;
                console.log(domain);
                return domain;
            }

        }
    }
})();
