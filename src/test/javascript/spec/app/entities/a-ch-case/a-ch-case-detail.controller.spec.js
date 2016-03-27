'use strict';

describe('Controller Tests', function() {

    describe('ACHCase Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockACHCase;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockACHCase = jasmine.createSpy('MockACHCase');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'ACHCase': MockACHCase
            };
            createController = function() {
                $injector.get('$controller')("ACHCaseDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'achCaseTrackingApp:aCHCaseUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
