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

          //console.log(data);
          console.log(!!fk);

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
          var uniqueId = 0;
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
                uniqueId++;
                denpendencyFormData.push(data);
              }

            }
            //console.log(denpendencyFormData.length);
            return denpendencyFormData;
        }

        function subtype(type_id) {
            var deferred = $q.defer();
            // dummy data
            var data = generateDependencyFormData(Enums.CaseSubtype);
            getFilteredFormData(data, type_id, deferred);

            return deferred.promise;
        }

        function recovery(subtype_id) {

          //console.log(subtype_id);

            var deferred = $q.defer();

            var data = generateDependencyFormData(Enums.RecoveryMethod);

            //console.log("data Length = " + data.length);

            var data2 = [{
                id: 0,
                fk: 0,
                name: 'ACH Return'
            }, {
                id: 1,
                fk: 0,
                name: 'Cashiers Check Mailed'
            }, {
                id: 2,
                fk: 0,
                name: 'Mixed Method'
            }, {
                id: 3,
                fk: 1,
                name: 'ACH Return'
            }, {
                id: 4,
                fk: 1,
                name: 'Cashiers Check Mailed'
            }, {
                id: 5,
                fk: 1,
                name: 'Mixed Method'
            }, {
                id: 6,
                fk: 2,
                name: 'ACH Return'
            }, {
                id: 7,
                fk: 2,
                name: 'Cashiers Check Mailed'
            }, {
                id: 8,
                fk: 2,
                name: 'Mixed Method'
            }, {
                id: 9,
                fk: 3,
                name: 'ACH Return'
            }, {
                id: 10,
                fk: 3,
                name: 'Cashiers Check Mailed'
            }, {
                id: 11,
                fk: 3,
                name: 'Mixed Method'
            }, {
                id: 12,
                fk: 4,
                name: 'Commerce Bank'
            }, {
                id: 13,
                fk: 4,
                name: 'Customer DDA'
            }, {
                id: 14,
                fk: 4,
                name: 'Other'
            }, {
                id: 15,
                fk: 5,
                name: 'Commerce Bank'
            }, {
                id: 16,
                fk: 5,
                name: 'Customer DDA'
            }, {
                id: 17,
                fk: 5,
                name: 'Other'
            },{
                id: 18,
                fk: 0,
                name: 'No Funds'
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
         }];

            //console.log("data2 Length = " + data2.length);

            //console.log(data==data2);

            getFilteredFormData(data, subtype_id, deferred);

            return deferred.promise;
        }
    }
})();
