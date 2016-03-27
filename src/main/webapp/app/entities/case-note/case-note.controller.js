(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseNoteController', CaseNoteController);

    CaseNoteController.$inject = ['$scope', '$state', 'CaseNote', 'ParseLinks', 'AlertService'];

    function CaseNoteController ($scope, $state, CaseNote, ParseLinks, AlertService) {
        var vm = this;
        vm.caseNotes = [];
        vm.predicate = 'id';
        vm.reverse = true;
        vm.page = 0;
        vm.loadAll = function() {
            CaseNote.query({
                page: vm.page,
                size: 20,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                for (var i = 0; i < data.length; i++) {
                    vm.caseNotes.push(data[i]);
                }
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        };
        vm.reset = function() {
            vm.page = 0;
            vm.caseNotes = [];
            vm.loadAll();
        };
        vm.loadPage = function(page) {
            vm.page = page;
            vm.loadAll();
        };

        vm.loadAll();

    }
})();
