(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('DataService', FormDataService);
    FormDataService.$inject = ['$http', '$q', 'Enums'];

    function FormDataService($http, $q, Enums) {
        return {
            type: type,
            subtype: subtype,
            recovery: recovery
        };

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
            //console.log(simpleFormData);
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
              //console.log(CaseEnum[i].fk, "Size="+CaseEnum[i].fk.length);
              for (var j = 0; j < CaseEnum[i].fk.length; j++) {
                //console.log(CaseEnum[i].fk[j]);
                var data = {
                    id: CaseEnum[i].id,
                    //id: uniqueId,
                    fk: CaseEnum[i].fk[j],
                    name: CaseEnum[i].displayName
                };
                //console.log(data);
                denpendencyFormData.push(data);
              }

            }
            //console.log(denpendencyFormData.length);
            return denpendencyFormData;
        }

        function subtype(type_id) {
            var deferred = $q.defer();
            var data = generateDependencyFormData(Enums.CaseSubtype);
            getFilteredFormData(data, type_id, deferred);

            return deferred.promise;
        }

        function recovery(subtype_id) {

          //console.log(subtype_id);

            var deferred = $q.defer();

            var data = generateDependencyFormData(Enums.RecoveryMethod);

            //console.log("data Length = " + data.length);

            getFilteredFormData(data, subtype_id, deferred);

            return deferred.promise;
        }
    }
})();
