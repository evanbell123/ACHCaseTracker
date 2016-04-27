(function()
{
    'use strict';
    angular
        .module('achCaseTrackingApp')
        .controller('ImportController', ImportController);

    ImportController.$inject = ['$scope'];

    function ImportController($scope) {
        $scope.partialDownloadLink = 'http://localhost:8080/download?filename=';
        $scope.filename = '';

        $scope.uploadFile = function () {
            $scope.processQueue();
        };

        $scope.reset = function () {
            $scope.resetDropzone();
        };
    }
})();
