'use strict';

describe('Controller Tests', function() {

    describe('CaseNote Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockCaseNote;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockCaseNote = jasmine.createSpy('MockCaseNote');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'CaseNote': MockCaseNote
            };
            createController = function() {
                $injector.get('$controller')("CaseNoteDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'achCaseTrackingApp:caseNoteUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
