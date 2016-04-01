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

        $scope.gridOptions = {
            enableFiltering: true,
            enableGridMenu: true,
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
            name: 'case.id',
            headerCellClass: $scope.highlightFilteredHeader,
            enableCellEdit: false,
            displayName: 'Case ID',
            type: 'number',
            width: '9%',
            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
        }, {
            name: 'case.assignedTo',
            enableCellEdit: false,
            displayName: 'Assigned To',
            headerCellClass: $scope.highlightFilteredHeader,
            width: '16%'
        }, {
            name: 'case.status',
            displayName: 'Status',
            headerCellClass: $scope.highlightFilteredHeader,
            editableCellTemplate: 'ui-grid/dropdownEditor',
            width: '12%',
            filter: {
                term: '1',
                type: uiGridConstants.filter.SELECT,
                selectOptions: [{
                    value: '1',
                    label: 'opened'
                }, {
                    value: '2',
                    label: 'closed'
                }]
            },
            cellFilter: 'mapStatus',
            editDropdownValueLabel: 'status',
            editDropdownOptionsArray: [{
                id: 1,
                status: 'opened'
            }, {
                id: 2,
                status: 'closed'
            }]
        }, {
            name: 'case.beneficiaryName',
            headerCellClass: $scope.highlightFilteredHeader,
            displayName: 'Beneficiary Name',
            width: '16%'
        }, {
            name: 'case.totalAmt',
            headerCellClass: $scope.highlightFilteredHeader,
            displayName: 'Total Amount',
            type: 'number',
            cellFilter: 'currency',
            width: '12%'
        }, {
            name: 'case.openedDate',
            headerCellClass: $scope.highlightFilteredHeader,
            displayName: 'Opened Date',
            type: 'date',
            cellFilter: 'date:"yyyy-MM-dd"',
            width: '12%'
        }, {
            name: 'case.sla',
            headerCellClass: $scope.highlightFilteredHeader,
            displayName: 'SLA',
            type: 'date',
            cellFilter: 'date:"yyyy-MM-dd"',
            width: '12%'
        }, {
            name: 'case.daysOpen',
            headerCellClass: $scope.highlightFilteredHeader,
            enableCellEdit: false,
            displayName: 'Days Open',
            type: 'number',
            width: '11%'
        }];

        $scope.msg = {};

        $scope.gridOptions.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                $scope.msg.lastCellEdited = 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.case.id + ' from ' + oldValue + ' to ' + newValue;
                $scope.$apply();
            });
            $scope.gridApi.core.addRowHeaderColumn({
                name: 'rowHeaderCol',
                displayName: '',
                width: 60,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="index.html#/cases/{{case.id.COL_FIELD}}"><button class="btn" type="button" ng-click="grid.appScope.Main.openAddress(COL_FIELD)"  style="background-color:#309479; color:#fff; text-align:center; padding:0 12px">Edit</button></a> </div>'
            });
        };

        //console.log($location.path());
        var request = $location.path();

        $http.get("sampleData" + $location.path() + ".json")
            .then(function(response) {
                console.log(response);
                var data = response.data._embedded.caseResources;
                console.log(data.length);

                for (var i = 0; i < data.length; i++) {
                    data[i].case.status = data[i].case.status === 'opened' ? 1 : 2;
                    data[i].case.sla = new Date(data[i].case.sla);
                    data[i].case.openedDate = new Date(data[i].case.openedDate);
                }
                $scope.gridOptions.data = data;
            });


    }

    function mapStatusFilter() {
        var statusHash = {
            1: 'opened',
            2: 'closed'
        };

        return function(input) {
            if (!input) {
                return '';
            } else {
                return statusHash[input];
            }
        };
    }

    CaseFormController.$inject = ['$scope', '$http'];

    function CaseFormController($scope, $http, formlyVersion) {
        var vm = this;

        vm.onSubmit = onSubmit;

        function onSubmit() {
            //vm.model.openedDate = vm.model.openedDate.getTime();
            //vm.model.sla = vm.model.sla.getTime();

            alert(JSON.stringify(vm.formData), null, 2);
            console.log(vm.model.openedDate, vm.model.sla);
            $http({
                method: 'POST',
                url: 'http://localhost:8080/api/cases',
                data: vm.model
            }).then(function successCallback(response) {
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        }

        // variable assignment
        vm.author = { // optionally fill in your info below :-)
            name: 'Joe Zhou',
            url: 'https://plus.google.com/u/0/111062476999618400219/posts' // a link to your twitter/github/blog/whatever
        };
        // variable assignment
        vm.baseUrl = 'https://github.com/formly-js/angular-formly';
        vm.issueNumber = 345;
        vm.env = {
            angularVersion: angular.version.full,
            formlyVersion: formlyVersion
        };

        vm.formData = {};

        vm.model = {
            awesome: true
        };
        vm.exampleTitle = 'Repeating Section';


        vm.options = {
            formState: {
                awesomeIsForced: false
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
                                        console.log('new value is different from old value');
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

                        }, {
                            className: 'col-xs-4',
                            key: 'sla',
                            type: 'input',
                            templateOptions: {
                                type: 'date',
                                label: 'SLA',
                                placeholder: 'SLA'
                            }
                        }
                    ]
                }, {
                    className: 'section-label',
                    template: '<hr /><div><strong><font size ="6px">Beneficiary Information:</font></strong></div>'
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'firstName',
                        templateOptions: {
                            label: 'First Name'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'lastName',
                        templateOptions: {
                            label: 'Last Name'
                        }
                    }]
                }, {
                    className: 'row',
                    fieldGroup: [{
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'account_number',
                        templateOptions: {
                            label: 'Account Number'
                        }

                    }, {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'ssn',
                        templateOptions: {
                            type: 'password',
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
                                    console.log('new value is different from old value');
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
                        key: 'completed_Date',
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
                                key: 'pay_Amt',
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
                                    key: 'effective_Date',
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
