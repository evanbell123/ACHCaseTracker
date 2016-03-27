(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('SLADetailController', SLADetailController);

    SLADetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'SLA'];

    function SLADetailController($scope, $rootScope, $stateParams, entity, SLA) {
        var vm = this;
        vm.sLA = entity;
        vm.load = function (id) {
            SLA.get({id: id}, function(result) {
                vm.sLA = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:sLAUpdate', function(event, result) {
            vm.sLA = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
