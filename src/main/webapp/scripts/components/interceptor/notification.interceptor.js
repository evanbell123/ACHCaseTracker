 'use strict';

angular.module('achcasetrackerApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-achcasetrackerApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-achcasetrackerApp-params')});
                }
                return response;
            }
        };
    });
