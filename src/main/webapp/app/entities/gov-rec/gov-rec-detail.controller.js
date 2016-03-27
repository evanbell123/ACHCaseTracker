(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('GovRecDetailController', GovRecDetailController);

    GovRecDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'GovRec'];

    function GovRecDetailController($scope, $rootScope, $stateParams, entity, GovRec) {
        var vm = this;
        vm.govRec = entity;
        vm.load = function (id) {
            GovRec.get({id: id}, function(result) {
                vm.govRec = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:govRecUpdate', function(event, result) {
            vm.govRec = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
