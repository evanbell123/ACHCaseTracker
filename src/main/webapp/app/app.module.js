(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp', [
            'ngStorage',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            'ds.objectDiff',
            'angular-advanced-searchbox',
            'ngMaterial',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar',
            'ui.grid',
            'ui.grid.edit',
            'ui.grid.exporter',
            'formly',
            'formlyBootstrap'
        ], function config(formlyConfigProvider) {
            // set templates here
            /*
            Date Picker
            */
            var attributes = [
                'date-disabled',
                'custom-class',
                'show-weeks',
                'starting-day',
                'init-date',
                'min-mode',
                'max-mode',
                'format-day',
                'format-month',
                'format-year',
                'format-day-header',
                'format-day-title',
                'format-month-title',
                'year-range',
                'shortcut-propagation',
                'datepicker-popup',
                'show-button-bar',
                'current-text',
                'clear-text',
                'close-text',
                'close-on-date-selection',
                'datepicker-append-to-body'
            ];

            var bindings = [
                'datepicker-mode',
                'min-date',
                'max-date'
            ];

            var ngModelAttrs = {};

            angular.forEach(attributes, function(attr) {
              //console.log(attr, camelize(attr));
                ngModelAttrs[camelize(attr)] = {
                    attribute: attr
                };
            });

            angular.forEach(bindings, function(binding) {
              //console.log(binding, camelize(binding));
                ngModelAttrs[camelize(binding)] = {
                    bound: binding
                };
            });

            //console.log(ngModelAttrs);

            formlyConfigProvider.setType({
                name: 'datepicker',
                templateUrl: 'app/home/form/datepicker.html',
                wrapper: ['bootstrapLabel', 'bootstrapHasError'],
                defaultOptions: {
                    ngModelAttrs: ngModelAttrs,
                    templateOptions: {
                        datepickerOptions: {
                            format: 'MM.dd.yyyy',
                            initDate: new Date()
                        }
                    }
                },
                controller: ['$scope', function($scope) {
                    $scope.datepicker = {};

                    $scope.datepicker.opened = false;

                    $scope.datepicker.open = function($event) {
                        $scope.datepicker.opened = !$scope.datepicker.opened;
                    };
                }]
            });

            function camelize(string) {
                string = string.replace(/[\-_\s]+(.)?/g, function(match, chr) {
                    return chr ? chr.toUpperCase() : '';
                });
                // Ensure 1st char is always lowercase
                return string.replace(/^([A-Z])/, function(match, chr) {
                    return chr ? chr.toLowerCase() : '';
                });
            }
            /*
            Repeating Section
            */
            var unique = 1;
            formlyConfigProvider.setType([{
                name: 'repeatingSection',
                templateUrl: 'app/home/form/repeatingSection.html',
                controller: function($scope) {
                    $scope.formOptions = {
                        formState: $scope.formState
                    };
                    $scope.addNew = addNew;

                    $scope.copyFields = copyFields;

                    function copyFields(fields) {
                        fields = angular.copy(fields);
                        addRandomIds(fields);
                        return fields;
                    }

                    function addNew() {
                        $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                        var repeatsection = $scope.model[$scope.options.key];
                        var lastSection = repeatsection[repeatsection.length - 1];
                        var newsection = {};
                        /*
                        if (lastSection) {
                            newsection = angular.copy(lastSection);
                        }
                        */
                        repeatsection.push(newsection);
                    }

                    function addRandomIds(fields) {
                        unique++;
                        angular.forEach(fields, function(field, index) {
                            if (field.fieldGroup) {
                                addRandomIds(field.fieldGroup);
                                return; // fieldGroups don't need an ID
                            }

                            if (field.templateOptions && field.templateOptions.fields) {
                                addRandomIds(field.templateOptions.fields);
                            }

                            field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                        });
                    }

                    function getRandomInt(min, max) {
                        return Math.floor(Math.random() * (max - min)) + min;
                    }
                }
            }])
        },
        function config(mdThemingProvider) {
            mdThemingProvider.theme('defaultTheme').primaryPalette('green');
        })
        .run(run);

    run.$inject = ['stateHandler'];

    function run(stateHandler) {
        stateHandler.initialize();
    }
})();
