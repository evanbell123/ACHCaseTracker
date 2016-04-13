(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('SLADetailController', SLADetailController);

    SLADetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SLA'];

    function SLADetailController($scope, $rootScope, $stateParams, entity, SLA) {
        var vm = this;
        vm.SLA = entity;
        vm.load = function (id) {
            SLA.get({id: id}, function(result) {
                vm.SLA = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:sLAUpdate', function(event, result) {
            vm.SLA = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
