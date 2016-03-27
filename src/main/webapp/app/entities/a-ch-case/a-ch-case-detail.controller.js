(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDetailController', ACHCaseDetailController);

    ACHCaseDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ACHCase'];

    function ACHCaseDetailController($scope, $rootScope, $stateParams, entity, ACHCase) {
        var vm = this;
        vm.aCHCase = entity;
        vm.load = function (id) {
            ACHCase.get({id: id}, function(result) {
                vm.aCHCase = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:aCHCaseUpdate', function(event, result) {
            vm.aCHCase = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
