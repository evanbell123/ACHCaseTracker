(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('HomeController', HomeController)
        .controller('CasesController', CasesController)
        .controller('CaseFormController', CaseFormController)
        .controller('AuditLogController', AuditLogController)
        .controller('ImportController', ImportController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService'];

    function HomeController($scope, Principal, LoginService) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
    }


    CasesController.$inject = ['$scope', '$location', '$http', '$timeout', 'uiGridConstants'];

    function CasesController($scope, $location, $http, $timeout, uiGridConstants) {
        $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        $scope.export = function() {
            if ($scope.export_format == 'csv') {
                var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
                $scope.gridApi.exporter.csvExport($scope.export_row_type, $scope.export_column_type, myElement);
            } else if ($scope.export_format == 'pdf') {
                $scope.gridApi.exporter.pdfExport($scope.export_row_type, $scope.export_column_type);
            };
        };

        $scope.gridOptions = {
            enableFiltering: true,
            //enableGridMenu: true,
            enableSelectAll: true,
            exporterCsvFilename: 'myFile.csv',
            exporterPdfDefaultStyle: {
                fontSize: 9
            },
            exporterPdfTableStyle: {
                margin: [0, 30, 30, 30]
            },
            exporterPdfTableHeaderStyle: {
                fontSize: 10,
                bold: true,
                italics: true,
                color: 'red'
            },
            exporterPdfHeader: {
                text: "Cases",
                style: 'headerStyle'
            },
            exporterFieldCallback: function(grid, row, col, input) {
                if (col.name == 'status') {
                    return getCaseStatusLabel(input)
                }
                if (col.name == 'type') {
                    return getCaseTypeLabel(input)
                }
                if (col.name == 'subtype') {
                    return getCaseSubtypeLabel(input)
                }
                else {
                  return input;
                }
            },

            exporterPdfFooter: function(currentPage, pageCount) {
                return {
                    text: currentPage.toString() + ' of ' + pageCount.toString(),
                    style: 'footerStyle'
                };
            },
            exporterPdfCustomFormatter: function(docDefinition) {
                docDefinition.styles.headerStyle = {
                    fontSize: 22,
                    bold: true
                };
                docDefinition.styles.footerStyle = {
                    fontSize: 10,
                    bold: true
                };
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 450,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };


        $scope.gridOptions.columnDefs = [{

                name: 'id',
                headerCellClass: $scope.highlightFilteredHeader,
                enableCellEdit: false,
                displayName: 'Case ID',
                type: 'number',
                width: '9%',
                cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
            }, {
                name: 'assignedTo',
                enableCellEdit: false,
                displayName: 'Assigned To',
                headerCellClass: $scope.highlightFilteredHeader,
                width: '16%'
            }, {
                name: 'status',
                displayName: 'Status',
                headerCellClass: $scope.highlightFilteredHeader,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                width: '12%',
                filter: {
                    //term: '1',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: '1',
                        label: 'OPEN'
                    }, {
                        value: '2',
                        label: 'IN_PROGRESS'
                    },{
                        value: '3',
                        label: 'CLOSED'
                    }]
                },
                cellFilter: 'mapCaseStatus',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: [{
                    id: 1,
                    status: 'OPEN'
                }, {
                    id: 2,
                    status: 'IN_PROGRESS'
                }, {
                    id: 3,
                    status: 'CLOSED'
                }]
            },

            {
                name: 'type',
                displayName: 'Case Type',
                enableCellEdit: false,
                headerCellClass: $scope.highlightFilteredHeader,
                width: '12%',
                filter: {
                    //term: '1',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [{
                        value: '1',
                        label: 'GOV_REC'
                    }, {
                        value: '2',
                        label: 'POA'
                    }, {
                        value: '3',
                        label: 'REV_DEL'
                    }, {
                        value: '4',
                        label: 'RETURN'
                    }, {
                        value: '5',
                        label: 'UNRESOLVED'
                    }, ]
                },
                cellFilter: 'mapCaseType',
                editDropdownValueLabel: 'type',
                editDropdownOptionsArray: [{
                    id: 1,
                    status: 'GOV_REC'
                }, {
                    id: 2,
                    status: 'POA'
                }, {
                    id: 3,
                    status: 'REV_DEL'
                }, {
                    id: 4,
                    status: 'RETURN'
                }, {
                    id: 5,
                    status: 'UNRESOLVED'
                }, ]
            },

            {
                name: 'beneficiary.name',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'Beneficiary Name',
                width: '16%'
            }, {
                name: 'totalAmount',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'Total Amount',
                type: 'number',
                cellFilter: 'currency',
                width: '12%'
            }, {
                name: 'daysOpen',
                headerCellClass: $scope.highlightFilteredHeader,
                enableCellEdit: false,
                displayName: 'Days Open',
                type: 'number',
                width: '11%'
            }
        ];

        $scope.msg = {};

        $scope.gridOptions.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {

              $http({
                  method: 'PUT',
                  url: 'http://localhost:9000/api/a-ch-cases',
                  data: rowEntity
              }).then(function successCallback(response) {
                  // this callback will be called asynchronously
                  // when the response is available
                  $scope.msg.lastCellEdited = 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.id + ' from ' + oldValue + ' to ' + newValue;
              }, function errorCallback(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });


                $scope.$apply();
            });
            $scope.gridApi.core.addRowHeaderColumn({
                name: 'rowHeaderCol',
                displayName: '',
                width: 60,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="index.html#/a-ch-cases/{{id.COL_FIELD}}"><button class="btn" type="button" ng-click="grid.appScope.Main.openAddress(COL_FIELD)"  style="background-color:#309479; color:#fff; text-align:center; padding:0 12px">Edit</button></a> </div>'
            });
        };

        //console.log($location.path());
        var request = $location.path();

        $http.get("api/a-ch-cases")
            .then(function(response) {
                console.log(response.data);
                //console.log(response.data.length);

                var data = response.data;

                for (var i = 0; i < data.length; i++) {
                    //console.log(data[i].status);
                    data[i].status = getCaseStatusValue(data[i].status);
                    data[i].type = getCaseTypeValue(data[i].type);
                    //console.log(data[i].type);
                    data[i].lastPaymentOn = new Date(data[i].lastPaymentOn);
                    data[i].slaDeadline = new Date(data[i].slaDeadline);
                }
                $scope.gridOptions.data = data;
            });


    }

    function getCaseStatusValue(statusLabel) {
        switch (statusLabel) {
            case 'OPEN':
                return 1;
                break;
            case 'IN_PROGRESS':
                return 2;
                break;
            case 'CLOSED':
                return 3;
                break;
            default:
                return statusValue;
                break;

        }
    }

    function getCaseStatusLabel(statusValue) {
        switch (statusValue) {
            case 1:
                return 'OPEN';
                break;
            case 2:
                return 'IN_PROGRESS';
                break;
            case 3:
                return 'CLOSED';
                break;
            default:
                return statusKey;
                break;
        }
    }

    function getCaseTypeValue(typeLabel) {
        switch (typeLabel) {
            case 'GOV_REC':
                return 1;
                break;
            case 'POA':
                return 2;
                break;
            case 'REV_DEL':
                return 3;
                break;
            case 'RETURN':
                return 4;
                break;
            case 'UNRESOLVED':
                return 5;
                break;
            default:
                return typeValue;
                break;
        }
    }

    function getCaseTypeLabel(typeValue) {
        switch (typeValue) {
            case 1:
                return 'GOV_REC';
                break;
            case 2:
                return 'POA';
                break;
            case 3:
                return 'REV_DEL';
                break;
            case 4:
                return 'RETURN';
                break;
            case 5:
                return 'UNRESOLVED';
                break;
            default:
                return typeKey;
                break;
        }
    }

    function getCaseSubtypeValue(subtypeLabel) {
        switch (subtypeLabel) {
            case 'GOV_REC':
                return 1;
                break;
            case 'DNE':
                return 2;
                break;
            case 'CRF':
                return 3;
                break;
            case 'TREAS_REFERRAL':
                return 4;
                break;
            case 'TREAS_REFUND':
                return 5;
                break;
            default:
                return subtypeValue;
                break;
        }
    }

    function getCaseSubtypeLabel(subtypeValue) {
        switch (subtypeValue) {
            case 1:
                return 'GOV_REC';
                break;
            case 2:
                return 'DNE';
                break;
            case 3:
                return 'CRF';
                break;
            case 4:
                return 'TREAS_REFERRAL';
                break;
            case 5:
                return 'TREAS_REFUND';
                break;
            default:
                return subtypeKey;
                break;
        }
    }



    CaseFormController.$inject = ['$scope', '$http'];

    function CaseFormController($scope, $http, formlyVersion) {
        var vm = this;

        vm.onSubmit = onSubmit;

        function onSubmit() {
            //vm.model.openedDate = vm.model.openedDate.getTime();
            //console.log(vm.model.openedDate);
            $http({
                method: 'POST',
                url: 'http://localhost:9000/api/a-ch-cases',
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
                            type: 'input',
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
                        hideExpression: '!model.recovery_method || (model.recovery_method != 2 && model.recovery_method != 5 && model.recovery_method != 8 && model.recovery_method != 11)'
                    }, {
                        className: 'col-xs-6',
                        key: 'mailed_to',
                        type: 'input',
                        templateOptions: {
                            label: 'Mailed to'
                        },
                        hideExpression: '!model.recovery_method || (model.recovery_method != 2 && model.recovery_method != 5 && model.recovery_method != 8 && model.recovery_method != 11)'
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
                        hideExpression: '!model.recovery_method || (model.recovery_method != 13 && model.recovery_method != 16)'
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
                        hideExpression: '!model.recovery_method || (model.recovery_method != 14 && model.recovery_method != 17)'
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
                        hideExpression: '!model.recovery_method || (model.recovery_method != 15 && model.recovery_method != 18)'
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

    ImportController.$inject = ['$scope'];

    function ImportController($scope) {
        $scope.showContent = function($fileContent) {
            $scope.content = $fileContent;
        };
    }



    AuditLogController.$inject = ['$scope'];

    function AuditLogController($scope) {
        var vm = this;
        $scope.message = 'Look! I am an audit log.';
    }




})();
