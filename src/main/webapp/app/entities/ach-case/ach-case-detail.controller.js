(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDetailController', ACHCaseDetailController);

    ACHCaseDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ACHCase'];

    function ACHCaseDetailController($scope, $rootScope, $stateParams, entity, ACHCase) {
        var vm = this;
        console.log(entity);
        vm.ACHCase = entity;
        vm.load = function (id) {
            ACHCase.get({id: id}, function(result) {
                vm.ACHCase = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:ACHCaseUpdate', function(event, result) {
            vm.ACHCase = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
