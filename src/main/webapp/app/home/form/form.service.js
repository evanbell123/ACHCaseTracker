(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('FormDataService', FormDataService);
    FormDataService.$inject = ['$http', '$q', 'Enums'];

    function FormDataService($http, $q, Enums) {
        return {
            status: status,
            type: type,
            subtype: subtype,
            recovery: recovery
        };

        function status() {
            var data = [];
            for (var i = 0; i < Enums.CaseStatus.length; i++) {
              var status = {
                name: Enums.CaseStatus[i].displayName,
                value: Enums.CaseStatus[i].id
              }
              data.push(status);
            }
            return data;
        }

        function getFilteredFormData(data, fk, deferred) {
            if (fk !== null) {
                var tmp = [];
                angular.forEach(data, function(val) {
                    if (val.fk === fk)
                        tmp.push(val);
                });
                deferred.resolve(tmp);
            } else {
                deferred.resolve(data);
            }
        }

        function generateSimpleFormData(CaseEnum) {
            var simpleFormData = [];
            for (var i = 0; i < CaseEnum.length; i++) {
                var data = {
                    id: CaseEnum[i].id,
                    name: CaseEnum[i].displayName
                };
                simpleFormData.push(data);
            }
            return simpleFormData;
        }

        function type() {
            var deferred = $q.defer();
            var data = generateSimpleFormData(Enums.CaseType);
            deferred.resolve(data);
            return deferred.promise;
        }


        function generateDependencyFormData(CaseEnum) {
            var denpendencyFormData = [];
            for (var i = 0; i < CaseEnum.length; i++) {
                for (var j = 0; j < CaseEnum[i].fk.length; j++) {
                    var data = {
                        id: CaseEnum[i].id,
                        fk: CaseEnum[i].fk[j],
                        name: CaseEnum[i].displayName
                    };
                    denpendencyFormData.push(data);
                }
            }
            return denpendencyFormData;
        }

        function subtype(type_id) {
            var deferred = $q.defer();
            var data = generateDependencyFormData(Enums.CaseSubtype);
            getFilteredFormData(data, type_id, deferred);
            return deferred.promise;
        }

        function recovery(subtype_id) {
            var deferred = $q.defer();
            var data = generateDependencyFormData(Enums.RecoveryMethod);
            getFilteredFormData(data, subtype_id, deferred);
            return deferred.promise;
        }
    }
})();
