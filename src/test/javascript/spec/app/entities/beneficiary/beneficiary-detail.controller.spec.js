'use strict';

describe('Controller Tests', function() {

    describe('Beneficiary Management Detail Controller', function() {
        var $scope, $rootScope;
        var MockEntity, MockBeneficiary;
        var createController;

        beforeEach(inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            MockEntity = jasmine.createSpy('MockEntity');
            MockBeneficiary = jasmine.createSpy('MockBeneficiary');
            

            var locals = {
                '$scope': $scope,
                '$rootScope': $rootScope,
                'entity': MockEntity ,
                'Beneficiary': MockBeneficiary
            };
            createController = function() {
                $injector.get('$controller')("BeneficiaryDetailController", locals);
            };
        }));


        describe('Root Scope Listening', function() {
            it('Unregisters root scope listener upon scope destruction', function() {
                var eventType = 'achCaseTrackingApp:beneficiaryUpdate';

                createController();
                expect($rootScope.$$listenerCount[eventType]).toEqual(1);

                $scope.$destroy();
                expect($rootScope.$$listenerCount[eventType]).toBeUndefined();
            });
        });
    });

});
