(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ImportController', ImportController);

    ImportController.$inject = ['$scope'];

    function ImportController($scope) {
        $scope.showContent = function($fileContent) {
            $scope.content = $fileContent;
        };
    }
})();
