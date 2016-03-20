'use strict';

angular.module('achcasetrackerApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('requestReset', {
                parent: 'account',
                url: '/reset/request',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/account/reset/request/reset.request.html',
                        controller: 'RequestResetController'
                    }
                },
                resolve: {
                    
                }
            });
    });
