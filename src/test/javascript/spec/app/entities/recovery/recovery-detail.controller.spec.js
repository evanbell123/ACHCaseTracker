'use strict';

describe('Controller Tests', function() {

    describe('Recovery Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockRecovery;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockRecovery = jasmine.createSpy('MockRecovery');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Recovery': MockRecovery
            };
            createController = function() {
                $injector.get('$controller')("RecoveryDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'achCaseTrackingApp:recoveryUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
