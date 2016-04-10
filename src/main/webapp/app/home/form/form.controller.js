(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CaseFormController', CaseFormController)

    CaseFormController.$inject = ['$scope', '$http', 'Enums'];

    function CaseFormController($scope, $http, Enums, formlyVersion) {
        var vm = this;

        vm.onSubmit = onSubmit;

        function onSubmit() {
            //vm.model.openedDate = vm.model.openedDate.getTime();
            //console.log(vm.model.openedDate);
            $http({
                method: 'POST',
                url: 'api/a-ch-cases',
                data: vm.model
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        vm.formData = {};
        /*
        vm.model = {
            awesome: true
        };
        */
        //vm.exampleTitle = 'Repeating Section';


        vm.options = {
            formState: {
                awesomeIsForced: true
            }
        };

        init();

        vm.originalFields = angular.copy(vm.fields);

        // The model object that we reference
        // on the <formly-form> element in index.html
        //vm.model = {};

        function generateHideExpression(RecoveryDetailEnum) {

          //'!model.recovery_method || (model.recovery_method != 2 && model.recovery_method != 5 && model.recovery_method != 8 && model.recovery_method != 11)'
          var hideExpression = "!model.recovery_method";

          if (RecoveryDetailEnum.fk.length===0) {
            return hideExpression;
          }

          hideExpression += "||";

          for (var i = 0; i < RecoveryDetailEnum.fk.length; i++) {
            hideExpression+="model.recovery_method != ";
            hideExpression+=RecoveryDetailEnum.fk[i];
            if ((i+1) != (RecoveryDetailEnum.fk.length)) {
              hideExpression+="&&";
            }
          }

          console.log(hideExpression);

          return hideExpression;

        }

        function init() {
            // An array of our form fields with configuration
            // and options set. We make reference to this in
            // the 'fields' attribute on the <formly-form> element
            vm.fields = [{
                    type: "radio",
                    key: "status",
                    defaultValue: 'open',
                    templateOptions: {
                        options: [{
                            "name": "Open",
                            "value": "open"
                        }, {
                            "name": "In Process",
                            "value": "process"
                        }, {
                            "name": "Closed",
                            "value": "closed"
                        }],
                        "label": "Field Type",
                        "required": true
                    }
                }, {
                    className: 'row',
                    //key:'random',
                    fieldGroup: [

                        {
                            className: 'col-xs-4',
                            key: 'type',
                            type: 'select',
                            templateOptions: {
                                label: 'Case Type',
                                options: [],
                                valueProp: 'id',
                                labelProp: 'name'
                            },
                            controller: /* @ngInject */ function($scope, DataService) {
                                $scope.to.loading = DataService.type().then(function(response) {
                                    $scope.to.options = response;
                                    return response;
                                });

                            }
                        }, {
                            className: 'col-xs-4',
                            key: 'subtype',
                            type: 'select',
                            templateOptions: {
                                label: 'Case Subtype',
                                options: [],
                                valueProp: 'id',
                                labelProp: 'name'

                            },
                            controller: /* @ngInject */ function($scope, DataService) {
                                $scope.$watch('model.type', function(newValue, oldValue, theScope) {
                                    if (newValue !== oldValue) {
                                        // logic to reload this select's options asynchronusly based on state's value (newValue)
                                        //console.log('new value is different from old value');
                                        if ($scope.model[$scope.options.key] && oldValue) {
                                            // reset this select
                                            $scope.model[$scope.options.key] = '';
                                        }
                                        // Reload options
                                        $scope.to.loading = DataService.subtype(newValue).then(function(res) {
                                            $scope.to.options = res;
                                        });
                                    }
                                });

                            }
                        }
                    ]
                }, {
                    className: 'section-label',
                    template: '<hr /><div><strong><font size ="6px">Beneficiary Information:</font></strong></div>',
                    ngModelElAttrs: {
                        'ng-model': 'model["whatever-i-want"]["cool!"].i.know["right?"]'
                    },
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'first_name',
                        templateOptions: {
                            label: 'First Name'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'last_name',
                        templateOptions: {
                            label: 'Last Name'
                        }
                    }]
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'account_num',
                        templateOptions: {
                            label: 'Account Number'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'ssn',
                        templateOptions: {
                            type: 'number',
                            label: 'Social Security Number'
                        }

                    }]
                },

                {
                    className: 'section-label',
                    template: '<hr /><div><strong><font size ="6px">Payment Information:</font></strong></div>'
                },


                {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'recovery_method',
                        type: 'select',
                        templateOptions: {
                            label: 'Recovery Method',
                            options: [],
                            valueProp: 'id',
                            labelProp: 'name'
                        },
                        controller: /* @ngInject */ function($scope, DataService) {
                            $scope.$watch('model.subtype', function(newValue, oldValue, theScope) {
                                if (newValue !== oldValue) {
                                    // logic to reload this select's options asynchronusly based on state's value (newValue)
                                    //console.log('new value is different from old value');
                                    if ($scope.model[$scope.options.key] && oldValue) {
                                        // reset this select
                                        $scope.model[$scope.options.key] = '';
                                    }
                                    // Reload options
                                    $scope.to.loading = DataService.recovery(newValue).then(function(res) {
                                        $scope.to.options = res;
                                    });
                                }
                            });
                        }
                    }, {
                        className: 'col-xs-6',
                        key: 'completed_date',
                        type: 'input',
                        templateOptions: {
                            type: 'date',
                            label: 'Completed Date',
                            placeholder: 'Enter completed date'
                        }


                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'check_number',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            label: 'Check Number'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[0])
                    }, {
                        className: 'col-xs-6',
                        key: 'mailed_to',
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
                        key: 'gl_call',
                        type: 'input',
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
                        key: 'dda_account_number',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            label: 'Customer DDA Account Number'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[2])
                    }]
                }, {
                    className: "row",
                    fieldGroup: [{
                        className: 'col-xs-6',
                        key: 'other_comment',
                        type: 'input',
                        templateOptions: {
                            label: 'Comment'
                        },
                        hideExpression: generateHideExpression(Enums.RecoveryDetail[3])
                    }]
                }, {
                    className: 'section-break',
                    template: '<hr />'
                },

                {
                    className: 'row',
                    type: 'repeatSection',
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
                                    key: 'effective_on',
                                    type: 'input',
                                    templateOptions: {
                                        type: 'date',
                                        label: 'Effective Date',
                                        placeholder: 'Enter effective date'
                                    }
                                }]
                            }

                        ],
                        btnText: 'Add another payment'
                    },
                    controller: function($scope) {
                        var unique = 1;
                        $scope.formOptions = {
                            formState: $scope.formState
                        };
                        $scope.addNew = addNew;

                        $scope.copyFields = copyFields;

                        function copyFields(fields) {
                            fields = angular.copy(fields);
                            addRandomIds(fields);
                            return fields;
                        }

                        function addNew() {
                            $scope.model[$scope.options.key] = $scope.model[$scope.options.key] || [];
                            var repeatsection = $scope.model[$scope.options.key];
                            var lastSection = repeatsection[repeatsection.length - 1];
                            var newsection = {};
                            if (lastSection) {
                                newsection = angular.copy(lastSection);
                            }
                            repeatsection.push(newsection);
                        }

                        function addRandomIds(fields) {
                            unique++;
                            angular.forEach(fields, function(field, index) {
                                if (field.fieldGroup) {
                                    addRandomIds(field.fieldGroup);
                                    return; // fieldGroups don't need an ID
                                }

                                if (field.templateOptions && field.templateOptions.fields) {
                                    addRandomIds(field.templateOptions.fields);
                                }

                                field.id = field.id || (field.key + '_' + index + '_' + unique + getRandomInt(0, 9999));
                            });
                        }

                        function getRandomInt(min, max) {
                            return Math.floor(Math.random() * (max - min)) + min;
                        }
                    }
                },


                {
                    className: 'section-label',
                    template: '<hr /><div><strong><font size ="6px">Notes:</font></strong></div>'
                },

                {
                    key: 'notes',
                    type: 'textarea',
                    templateOptions: {
                        type: 'text',
                        placeholder: 'This has 5 rows',
                        rows: 5

                    }
                }
            ];
        }
    }

})();
