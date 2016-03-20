'use strict';

angular.module('achcasetrackerApp', ['LocalStorageModule',
    'ngResource', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'formly', 'formlyBootstrap',
    // jhipster-needle-angularjs-add-module JHipster will add new module here
    'ui.bootstrap', 'ui.router', 'ui.router.stateHelper', 'infinite-scroll', 'angular-loading-bar'
], function config(formlyConfigProvider) {
    // set templates here

    formlyConfigProvider.setType([{
        name: 'createCase',
        templateUrl: 'caseForm.html'
    }, {
        name: 'repeatSection',
        templateUrl: 'scripts/app/partials/paymentForm.html'

    }])


})

.run(function($rootScope, $location, $window, $http, $state, Auth, Principal, ENV, VERSION) {

        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }


        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'ACHCaseTracker';

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'login' && $rootScope.previousStateName) {
                $rootScope.previousStateName = fromState.name;
                $rootScope.previousStateParams = fromParams;
            }

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            $window.document.title = titleKey;
        });

        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                $state.go('home');
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })
    .config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, httpRequestInterceptorCacheBusterProvider, AlertServiceProvider) {
        // uncomment below to make alerts look like toast
        //AlertServiceProvider.showAsToast(true);

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function(Auth) {
                        return Auth.authorize();
                    }
                ]
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');
        // jhipster-needle-angularjs-add-interceptor JHipster will add new application interceptor here

    })
    // jhipster-needle-angularjs-add-config JHipster will add new application configuration here
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name: 'boolean',
            decode: function(val) {
                return val == true ? true : val == "true" ? true : false
            },
            encode: function(val) {
                return val ? 1 : 0;
            },
            equals: function(a, b) {
                return this.is(a) && a === b;
            },
            is: function(val) {
                return [true, false, 0, 1].indexOf(val) >= 0
            },
            pattern: /bool|true|0|1/
        });
    }])
    .directive('onReadFile', function($parse) {
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
    });
