(function () {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('Register', Register);

    Register.$inject = ['$resource'];

    function Register ($resource) {
        return $resource('api/register', {}, {});
    }
})();
