(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('RecoveryDetailController', RecoveryDetailController);

    RecoveryDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'Recovery'];

    function RecoveryDetailController($scope, $rootScope, $stateParams, entity, Recovery) {
        var vm = this;
        vm.recovery = entity;
        vm.load = function (id) {
            Recovery.get({id: id}, function(result) {
                vm.recovery = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:recoveryUpdate', function(event, result) {
            vm.recovery = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
