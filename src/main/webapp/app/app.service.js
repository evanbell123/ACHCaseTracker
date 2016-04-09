(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('EnumsService', EnumsService);

    //EnumService.$inject = ['Enums'];

    function EnumsService() {
        return {
          getEnumIdFromName: function(CaseEnum, name) {
              var enumId = CaseEnum.filter(function(value) {
                  return value.name === name;
              })[0].id;

              console.log(enumId, name);

              return enumId;
          }
        }
    }
})();
