'use strict';

angular.module('achcasetrackerApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


