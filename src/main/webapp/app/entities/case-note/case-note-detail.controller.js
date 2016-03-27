(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseNoteDetailController', CaseNoteDetailController);

    CaseNoteDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'CaseNote'];

    function CaseNoteDetailController($scope, $rootScope, $stateParams, entity, CaseNote) {
        var vm = this;
        vm.caseNote = entity;
        vm.load = function (id) {
            CaseNote.get({id: id}, function(result) {
                vm.caseNote = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:caseNoteUpdate', function(event, result) {
            vm.caseNote = result;
        });
        $scope.$on('$destroy', unsubscribe);

    }
})();
