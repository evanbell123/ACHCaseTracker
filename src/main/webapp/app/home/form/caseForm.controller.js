/*
 This controller is used for both /create-case and /edit-case
 For more information about angular-formly go here
 http://angular-formly.com/#/
 */

(function () {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseFormController', CaseFormController)

    CaseFormController.$inject = ['$scope', '$rootScope', '$uibModalInstance', 'entity', 'Enums', 'ACHCase'];

    function CaseFormController($scope, $rootScope, $uibModalInstance, entity, Enums, ACHCase, formlyVersion) {
        var vm = this;

        var unsubscribe = $rootScope.$on('achCaseTrackingApp:ACHCaseUpdate', function (event, result) {
            vm.model = result;
        });
        $scope.$on('$destroy', unsubscribe);

        vm.load = function (id) {
            ACHCase.one({
                id: id
            }, function (result) {
                vm.model = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('achCaseTrackingApp:ACHCaseUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        };

        var onSaveError = function () {
            vm.isSaving = false;
        };

        vm.save = function () {
            vm.isSaving = true;
            vm.watchItem = true;
            if (vm.model.id !== null) {
                ACHCase.update(vm.model, onSaveSuccess, onSaveError);
            } else {
                ACHCase.create(vm.model, onSaveSuccess, onSaveError);
            }
        };

        vm.clear = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        vm.model = entity;

        vm.formData = {};

        init();

        vm.originalFields = angular.copy(vm.fields);

        /*
         Input: An element from the the RecoveryDetailEnum defined in enums.constants.js
         that should be displayed if a certain recovery method has been selected by the user
         Output: a boolean conditional expression
         that will return true if the field should be hidden
         and false if it should be displayed

         Example Input: { id: 1, name: "GL_COST", displayName: "GL Cost Center", fk: [3]}
         Example Output: !model.caseDetail.recoveryInfo.method||model.caseDetail.recoveryInfo.method != 3
         */
        function generateHideExpression(RecoveryDetailEnum) {
            /*
             Here is an example of what a genereted expression may look like
             */
            var hideExpression = "model.caseDetail.recoveryInfo.method === null";

            if (RecoveryDetailEnum.fk.length === 0) {
                return hideExpression;
            }

            hideExpression += "||";

            for (var i = 0; i < RecoveryDetailEnum.fk.length; i++) {
                hideExpression += "model.caseDetail.recoveryInfo.method != ";
                hideExpression += RecoveryDetailEnum.fk[i];
                if ((i + 1) != (RecoveryDetailEnum.fk.length)) {
                    hideExpression += "&&";
                }
            }

            return hideExpression;
        }

        function init() {

            // An array of our form fields with configuration
            // and options set. We make reference to this in
            // the 'fields' attribute on the <formly-form> element
            vm.fields = [
                {
                    template: '<br/><div><H3><strong>Case Info</strong></H3></div>',
                },{
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'assignedTo',
                        templateOptions: {
                            label: 'Assigned To'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'totalAmount',
                        templateOptions: {
                            type: 'currency',
                            label: 'Total Amount'
                        }

                    }]
                },{
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'daysOpen',
                        templateOptions: {
                            label: 'Days Open'
                        }
                    },{
                        className: 'col-xs-6',
                        type: 'textarea',
                        key: 'createdDate',
                        templateOptions: {
                            label: 'Created On'
                        }

                    }]
                },{
                    className: 'row',
                    //key:'random',
                    fieldGroup: [

                        {
                            className: 'col-xs-6',
                            key: 'type',
                            type: 'select',
                            templateOptions: {
                                label: 'Case Type',
                                options: [],
                                valueProp: 'id',
                                labelProp: 'name'
                            },
                            controller: /* @ngInject */ function ($scope, FormDataService) {
                                $scope.to.loading = FormDataService.type().then(function (response) {
                                    $scope.to.options = response;
                                    return response;
                                });
                            },
                            watcher: {
                                listener: function (field, newValue, oldValue, scope, stopWatching) {
                                    /*If the user changes case type, the model must be reset*/
                                }
                            }
                        }, {
                            className: 'col-xs-6',
                            key: 'caseDetail.subtype',
                            type: 'select',
                            templateOptions: {
                                label: 'Case Subtype',
                                options: [],
                                valueProp: 'id',
                                labelProp: 'name'
                            },
                            controller: /* @ngInject */ function ($scope, FormDataService) {
                                $scope.$watch('model.type', function (newValue, oldValue, theScope) {
                                    if (newValue !== oldValue) {
                                        // logic to reload this select's options asynchronusly based on state's value (newValue)
                                        //console.log('new value is different from old value');
                                        if ($scope.model[$scope.options.key] && oldValue) {
                                            // reset this select
                                            $scope.model[$scope.options.key] = '';
                                        }
                                        // Reload options
                                        $scope.to.loading = FormDataService.subtype(newValue).then(function (res) {
                                            $scope.to.options = res;
                                        });
                                    }
                                });

                            }
                        }
                    ]
                }, {

                    template: '<br/><div><H3><strong>Beneficiary</strong></H3></div>',
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'beneficiary.name',
                        templateOptions: {
                            label: 'Name'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'beneficiary.customerID',
                        templateOptions: {
                            label: 'Customer ID'
                        }

                    }]
                },{
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'datepicker',
                        key: 'beneficiary.dateOfDeath',
                        templateOptions: {
                            type: 'text',
                            label: 'Date of Death',
                            placeholder: 'Enter date of death',
                            datepickerPopup: 'dd-MMMM-yyyy'
                        }
                    },{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'beneficiary.ssn',
                        templateOptions: {
                            label: 'Social Security Number'
                        },
                        validators: {
                            ssn: {
                                expression: function (viewValue, modelValue) {
                                    var value = modelValue || viewValue;
                                    var pattern = /^((?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}|null|)$/;
                                    return pattern.test(value);
                                },
                                message: '$viewValue + " is not a valid ssn"'
                            }
                        }
                    }, {
                        className: 'row',
                        fieldGroup: [{
                            className: 'col-xs-6',
                            type: 'datepicker',
                            key: 'beneficiary.dateCBAware',
                            templateOptions: {
                                type: 'text',
                                label: 'Awareness Date',
                                placeholder: 'Enter date CB became aware',
                                datepickerPopup: 'dd-MMMM-yyyy'
                            }
                        }, {
                            className: 'col-xs-6',
                            type: 'input',
                            key: 'beneficiary.accountNum',
                            templateOptions: {
                                label: 'Account Number'
                            }
                        }]
                    }, {
                        className: 'row',
                        fieldGroup: [{
                            className: 'col-xs-6',
                            type: 'checkbox',
                            key: 'beneficiary.otherGovBenefits',
                            templateOptions: {
                                label: 'Other Government Benefits',
                            }
                        }]
                    }]
                },

                {
                    className: 'section-label',
                    template: '<br/><div><H3><strong>Disposition</strong></H3></div>'
                },{
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.method',
                        type: 'select',
                        templateOptions: {
                            label: 'Recovery Method',
                            options: [],
                            valueProp: 'id',
                            labelProp: 'name'
                        },
                        controller: /* @ngInject */ function ($scope, FormDataService) {
                            $scope.$watch('model.caseDetail.subtype', function (newValue, oldValue, theScope) {
                                if (newValue !== oldValue) {
                                    // logic to reload this select's options asynchronusly based on state's value (newValue)
                                    //console.log('new value is different from old value');
                                    if ($scope.model[$scope.options.key] && oldValue) {
                                        // reset this select
                                        $scope.model[$scope.options.key] = '';
                                    }
                                    // Reload options
                                    $scope.to.loading = FormDataService.recovery(newValue).then(function (res) {
                                        $scope.to.options = res;
                                    });
                                }
                            });
                        }
                    }, {
                        className: 'col-xs-6',
                        key: 'completedOn',
                        type: 'datepicker',
                        templateOptions: {
                            type: 'text',
                            label: 'Completed Date',
                            placeholder: 'Enter completed date',
                            datepickerPopup: 'dd-MMMM-yyyy'

                        }
                    }, {
                        className: 'row',
                        fieldGroup: [{
                            className: 'col-xs-6',
                            type: 'checkbox',
                            key: 'caseDetail.fullRecovery',
                            templateOptions: {
                                label: 'Full Recovery',
                            }

                        }]
                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.detailValue',
                        type: 'input',
                        validators: {
                            detailString: {
                                expression: function (viewValue, modelValue) {
                                    var value = modelValue || viewValue;
                                    var pattern = /^([0-9]+|)$/;
                                    return pattern.test(value);
                                },
                                message: '$viewValue + " value must be numerical."'
                            }
                        },
                        templateOptions: {

                            label: 'Check Number'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[0])
                    }, {
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.detailString',
                        type: 'input',
                        templateOptions: {
                            label: 'Mailed to'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[0])
                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.detailValue',
                        type: 'input',
                        validators: {
                            detailString: {
                                expression: function (viewValue, modelValue) {
                                    var value = modelValue || viewValue;
                                    var pattern = /^([0-9]+|)$/;
                                    return pattern.test(value);
                                },
                                message: '$viewValue + " value must be numerical."'
                            }
                        },
                        templateOptions: {
                            type: 'number',
                            label: 'GL and Call Center'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[1])
                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.detailValue',
                        type: 'input',
                        validators: {
                            detailString: {
                                expression: function (viewValue, modelValue) {
                                    var value = modelValue || viewValue;
                                    var pattern = /^([0-9]+|)$/;
                                    return pattern.test(value);
                                },
                                message: '$viewValue + " value must be numerical."'
                            }
                        },
                        templateOptions: {
                            label: 'Customer DDA Account Number'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[2])
                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'caseDetail.recoveryInfo.detailString',
                        type: 'input',
                        templateOptions: {
                            label: 'Comment'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[3])
                    }]
                },

                {
                    className: 'section-label',
                    template: '<br/><div><H3><strong>Payments</strong></H3></div>'
                },

                {
                    className: 'row',
                    type: 'repeatingSection',
                    key: 'payments',
                    templateOptions: {
                        fields: [{
                            className: 'col-xs-4',
                            key: 'amount',
                            type: 'input',
                            templateOptions: {
                                type: 'currency',
                                label: 'Payment Amount',
                                addonLeft: {
                                    class: 'glyphicon glyphicon-usd'
                                },
                                placeholder: 'Enter payment amount'
                            }
                        },

                            {
                                className: 'row',
                                fieldGroup: [{
                                    className: 'col-xs-4',
                                    key: 'effectiveOn',
                                    type: 'datepicker',
                                    templateOptions: {
                                        type: 'text',
                                        label: 'Effective Date',
                                        placeholder: 'mm/dd/yyyy',
                                        datepickerPopup: 'dd-MMMM-yyyy'
                                    }
                                }]
                            }
                        ],
                        btnText: 'Add another payment'
                    },
                },
                {
                    className: 'section-label',
                    template: '<br/><div><H3><strong>Notes</strong></H3></div>'
                },

                {
                    className: 'row',
                    type: 'repeatingSection',
                    key: 'notes',
                    templateOptions: {
                        fields: [{
                            key: 'note',
                            type: 'textarea',
                            templateOptions: {
                                type: 'text',
                                placeholder: '',
                                rows: 2
                            }
                        }],
                        btnText: 'Add another note'
                    },
                },
            ];
        }
    }
})();
