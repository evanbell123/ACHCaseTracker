(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp', [
            'ngStorage',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar',
            'ui.grid',
            'ui.grid.edit',
            'ui.grid.exporter',
            'formly',
            'formlyBootstrap'
        ], function config(formlyConfigProvider) {
            // set templates here

            formlyConfigProvider.setType([{
                name: 'createCase',
                templateUrl: 'caseForm.html'
            }, {
                name: 'repeatSection',
                templateUrl: 'app/partials/paymentForm.html'

            }])


        })
        .filter('mapCaseStatus', mapCaseStatusFilter)
        .filter('mapCaseType', mapCaseTypeFilter)
        .filter('mapCaseSubtype', mapCaseSubtypeFilter)
        .directive('onReadFile', onReadFileDirective)
        .factory('DataService', FormDataService)
        //.module('CaseFormConfig', CaseFormConfig)
        .run(run);

    run.$inject = ['stateHandler'];

    function run(stateHandler) {
        stateHandler.initialize();
    }


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

    onReadFileDirective.$inject = ['$parse'];

    function onReadFileDirective($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {
                                $fileContent: onLoadEvent.target.result
                            });
                        });


                        var cases = [];
                        var lines = this.result.split('\n');
                        for (var line = 2; line < lines.length; line += 2) {
                            var nachaLineOne = lines[line];


                            if (nachaLineOne !== '' && isNaN(nachaLineOne[51])) {
                                var firstName = nachaLineOne.substring(51, 62).replace(/ /g, '');
                                var lastName = nachaLineOne.substring(63, 71).replace(/ /g, '');
                                var beneficiaryNumber = nachaLineOne.substring(12, 50).replace(/ /g, '');

                                var nachaLineTwo = lines[line + 1];

                                var dateOfDeath = nachaLineTwo.substring(17, 23);
                                var ssn = nachaLineTwo.substring(37, 46);
                                var paymentAmount = nachaLineTwo.substring(54, 83);
                                paymentAmount = paymentAmount.substring(0, paymentAmount.indexOf('\\'));

                                cases.push({
                                    "firstName": firstName,
                                    "lastName": lastName,
                                    "beneficiaryNumber": beneficiaryNumber,
                                    "dateOfDeath": dateOfDeath,
                                    "ssn": ssn,
                                    "paymentAmount": paymentAmount
                                });
                            }

                        }
                        console.log(cases);
                    };


                    reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
                });
            }
        };
    }

    function mapCaseStatusFilter() {
        var statusHash = {
            1: 'OPEN',
            2: 'IN_PROGRESS',
            3: 'CLOSED'
        };

        return function(input) {
            if (!input) {
                return '';
            } else {
                return statusHash[input];
            }
        };
    }

    function mapCaseTypeFilter() {
        var typeHash = {
            1: 'GOV_REC',
            2: 'POA',
            3: 'REV_DEL',
            4: 'RETURN',
            5: 'UNRESOLVED'
        };

        return function(input) {
            if (!input) {
                return '';
            } else {
                return typeHash[input];
            }
        };
    }

    function mapCaseSubtypeFilter() {
        var subtypeHash = {
            1: 'GOV_REC',
            2: 'DNE',
            3: 'CRF',
            4: 'TREAS_REFERRAL',
            5: 'TREAS_REFUND'
        };

        return function(input) {
            if (!input) {
                return '';
            } else {
                return subtypeHash[input];
            }
        };
    }
})();
