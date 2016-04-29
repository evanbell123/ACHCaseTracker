(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('ACHCaseDetailController', ACHCaseDetailController);

    ACHCaseDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'entity', 'ACHCase', 'Enums', 'FormDataService'];

    function ACHCaseDetailController($scope, $rootScope, $stateParams, entity, ACHCase, Enums, FormDataService) {
        var vm = this;
        console.log(entity);
        vm.ACHCase = entity;
        vm.load = function (id) {
            ACHCase.get({id: id}, function(result) {
                vm.ACHCase = result;
            });
        };
        var unsubscribe = $rootScope.$on('achCaseTrackingApp:ACHCaseUpdate', function(event, result) {
            vm.ACHCase = result;
        });
        $scope.$on('$destroy', unsubscribe);

        console.log(vm.editMode);

        vm.onSubmit = onSubmit;

        /*
        When the user clicks submit,
        Make sure the json is properly formatted,
        then send a POST request if the current url = /create-case
        other-wise the url must be /edit-case,
        In this case send a PUT request to update the case.
        */
        function onSubmit() {

        }

        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        /*
        Specify the JSON model
        This is the model object that we reference
        on the <formly-form> element in caseForm.html
        */
        vm.model = {
            "totalAmount": null,
            "id": null,
            "status": "OPEN",
            "lastPaymentOn": null,
            "slaDeadline": null,
            "sla": null,
            "daysOpen": 0,
            "type": null,
            "beneficiary": {
                "customerID": null,
                "name": null,
                "ssn": null,
                "accountNum": null,
                "dateOfDeath": null,
                "dateCBAware": null,
                "otherGovBenefits": false,
                "govBenefitsComment": null
            },
            "assignedTo": null,
            "caseDetail": {
                "@class": "com.commercebank.www.domain.GovRec",
                "claimNumber": null,
                "completedOn": null,
                "verifiedOn": null,
                "fullRecovery": false,
                "paymentTotal": 0.0,
                "paymentCount": 0,
                "verifiedBy": null,
                "recoveryInfo": {
                    "method": null,
                    "detailType": null,
                    "detailValue": null,
                    "detailString": null,
                },
                "notes": null,
                "payments": null
            }
        }

        /*
        specify form options
        */
        vm.options = {
            formState: {
                awesomeIsForced: true
            }
        };

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
            var hideExpression = "!model.caseDetail.recoveryInfo.method";

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

            console.log(hideExpression);

            return hideExpression;

        }



        function init() {
            /*
            if the current state is edit-case
            initialize the form fields with case values
            */
            if (vm.editMode) {
                vm.model = ACHCaseTwo.one({
                    id: $stateParams.caseId
                });
            }

            // An array of our form fields with configuration
            // and options set. We make reference to this in
            // the 'fields' attribute on the <formly-form> element
            vm.fields = [{
                    type: "radio",
                    key: "status",
                    defaultValue: 'open',
                    templateOptions: {
                        options: FormDataService.status(),
                        label: "Case Status",
                        required: true,
                    }
                }, {
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
                            controller: /* @ngInject */ function($scope, FormDataService) {
                                $scope.to.loading = FormDataService.type().then(function(response) {
                                    $scope.to.options = response;
                                    return response;
                                });

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
                            controller: /* @ngInject */ function($scope, FormDataService) {
                                $scope.$watch('model.type', function(newValue, oldValue, theScope) {
                                    if (newValue !== oldValue) {
                                        // logic to reload this select's options asynchronusly based on state's value (newValue)
                                        //console.log('new value is different from old value');
                                        if ($scope.model[$scope.options.key] && oldValue) {
                                            // reset this select
                                            $scope.model[$scope.options.key] = '';
                                        }
                                        // Reload options
                                        $scope.to.loading = FormDataService.subtype(newValue).then(function(res) {
                                            $scope.to.options = res;
                                        });
                                    }
                                });

                            }
                        }
                    ]
                }, {

                    template: '<hr /><div><strong><font size ="6px">Beneficiary Information:</font></strong></div>',
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
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'beneficiary.accountNum',
                        templateOptions: {
                            label: 'Account Number'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'beneficiary.ssn',
                        templateOptions: {
                            label: 'Social Security Number'
                        },
                        validators: {
                            ssn: {
                                expression: function(viewValue, modelValue) {
                                    var value = modelValue || viewValue;
                                    var pattern = /^((?!000|666)[0-8][0-9]{2}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4}|null|)$/;
                                    return pattern.test(value);
                                },
                                message: '$viewValue + " is not a valid ssn"'
                            }
                        },
                    }, {
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

                        }, {
                            className: 'col-xs-6',
                            type: 'datepicker',
                            key: 'beneficiary.dateCBAware',
                            templateOptions: {
                                type: 'text',
                                label: 'Awareness Date',
                                placeholder: 'Enter date CB became aware',
                                datepickerPopup: 'dd-MMMM-yyyy'
                            }
                        }]
                    }, {
                        className: 'row',
                        fieldGroup: [{
                            className: 'col-xs-6',
                            type: 'checkbox',
                            key: 'beneficiary.otherGovBenefits',
                            templateOptions: {
                                label: 'Other Government Benfits',
                            }

                        }]
                    }]
                },

                {
                    className: 'section-label',
                    template: '<hr /><div><strong><font size ="6px">Disposition</font></strong></div>'
                },


                {
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
                        controller: /* @ngInject */ function($scope, FormDataService) {
                            $scope.$watch('model.caseDetail.subtype', function(newValue, oldValue, theScope) {
                                if (newValue !== oldValue) {
                                    // logic to reload this select's options asynchronusly based on state's value (newValue)
                                    //console.log('new value is different from old value');
                                    if ($scope.model[$scope.options.key] && oldValue) {
                                        // reset this select
                                        $scope.model[$scope.options.key] = '';
                                    }
                                    // Reload options
                                    $scope.to.loading = FormDataService.recovery(newValue).then(function(res) {
                                        $scope.to.options = res;
                                    });
                                }
                            });
                        }
                    }, {
                        className: 'col-xs-6',
                        key: 'caseDetail.completedOn',
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
                                expression: function() {
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
                                expression: function() {
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
                                expression: function() {
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
                    template: '<hr /><div><strong><font size ="6px">Payments</font></strong></div>'
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
                                    type: 'number',
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
                                        placeholder: 'Enter effective date',
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
                    template: '<hr /><div><strong><font size ="6px">Notes</font></strong></div>'
                },

                {
                    className: 'row',
                    type: 'repeatingSection',
                    key: 'notes',
                    templateOptions: {
                        fields: [{
                            //className: 'col-xs-4',
                            key: 'note',
                            type: 'textarea',
                            templateOptions: {
                                type: 'text',
                                placeholder: 'This has 5 rows',
                                rows: 5
                            }
                        }],
                        btnText: 'Add another note'
                    },
                },
            ];
        }

    }
})();
