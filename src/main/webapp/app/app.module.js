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
                templateUrl: 'app/home/form/paymentForm.html'

            }])
        })
        .run(run);

    run.$inject = ['stateHandler'];

    function run(stateHandler) {
        stateHandler.initialize();
    }
})();
