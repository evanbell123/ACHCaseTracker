'use strict';

describe('Controller Tests', function() {

    describe('GovRec Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockGovRec;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockGovRec = jasmine.createSpy('MockGovRec');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'GovRec': MockGovRec
            };
            createController = function() {
                $injector.get('$controller')("GovRecDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'achCaseTrackingApp:govRecUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
