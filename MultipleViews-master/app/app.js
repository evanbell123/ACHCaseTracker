// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var app = angular.module('app', ['ngRoute', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'formly', 'formlyBootstrap'], function config(formlyConfigProvider) {
    // set templates here
    formlyConfigProvider.setType({
        name: 'createCase',
        templateUrl: 'caseForm.html',
        name: 'repeatSection',
        templateUrl: 'caseForm.html',
        controller: function ($scope) {
            $scope.formOptions = {formState: $scope.formState};
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
                angular.forEach(fields, function (field, index) {
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
    });

});

app.directive('onReadFile', function ($parse) {
    return {
        restrict: 'A',
        scope: false,
        link: function (scope, element, attrs) {
            var fn = $parse(attrs.onReadFile);

            element.on('change', function (onChangeEvent) {
                var reader = new FileReader();

                reader.onload = function (onLoadEvent) {
                    scope.$apply(function () {
                        fn(scope, {$fileContent: onLoadEvent.target.result});
                    });


                    var cases = [];
                    var lines = this.result.split('\n');
                    for (var line = 2; line < lines.length; line += 2) {
                        var nachaLineOne = lines[line];


                        if (nachaLineOne !== '' && isNaN(nachaLineOne[51])) {
                            var firstName = nachaLineOne.substring(51, 62).replace(/ /g, '');
                            var lastName = nachaLineOne.substring(63, 71).replace(/ /g, '');
                            var beneficiaryNumber = nachaLineOne.substring(12, 50).replace(/ /g, '');

                            var nachaLineTwo = lines[line + 1];

                            var dateOfDeath = nachaLineTwo.substring(17, 23);
                            var ssn = nachaLineTwo.substring(37, 46);
                            var paymentAmount = nachaLineTwo.substring(54, 83);
                            paymentAmount = paymentAmount.substring(0, paymentAmount.indexOf('\\'));

                            cases.push({
                                "firstName": firstName,
                                "lastName": lastName,
                                "beneficiaryNumber": beneficiaryNumber,
                                "dateOfDeath": dateOfDeath,
                                "ssn": ssn,
                                "paymentAmount": paymentAmount
                            });
                        }

                    }
                    console.log(cases);
                };


                reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
            });
        }
    };
});

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'homeController'
        })

        // route for the about page
        .when('/auditlog', {
            templateUrl: 'partials/auditlog.html',
            controller: 'auditlogController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl: 'partials/contact.html',
            controller: 'contactController'
        })

        .when('/myCases', {
            templateUrl: 'partials/cases.html',
            controller: 'casesController'
        })

        .when('/import', {
            templateUrl: 'partials/import.html',
            controller: 'importController'
        })

        .when('/caseForm', {
            templateUrl: 'partials/caseForm.html',
            controller: 'caseFormController as vm'
        })

        .when('/cases', {
            templateUrl: 'partials/cases.html',
            controller: 'casesController'
        });

});


app.controller('importController', ['$scope', function ($scope) {
    $scope.showContent = function ($fileContent) {
        $scope.content = $fileContent;
    };
}]);

app.controller('homeController', function ($scope) {
    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});

app.controller('auditlogController', function ($scope) {
    $scope.message = 'Look! I am an audit log.';
});

app.controller('casesController', ['$location','$scope', '$http', '$timeout', 'uiGridConstants', function ($location, $scope, $http, $timeout, uiGridConstants) {
        $scope.highlightFilteredHeader = function (row, rowRenderIndex, col, colRenderIndex) {
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
            exporterPdfDefaultStyle: {fontSize: 9},
            exporterPdfTableStyle: {margin: [0, 30, 30, 30]},
            exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
            exporterPdfHeader: {text: "Cases", style: 'headerStyle'},
            exporterPdfFooter: function (currentPage, pageCount) {
                return {text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle'};
            },
            exporterPdfCustomFormatter: function (docDefinition) {
                docDefinition.styles.headerStyle = {fontSize: 22, bold: true};
                docDefinition.styles.footerStyle = {fontSize: 10, bold: true};
                return docDefinition;
            },
            exporterPdfOrientation: 'portrait',
            exporterPdfPageSize: 'LETTER',
            exporterPdfMaxGridWidth: 450,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };


        $scope.gridOptions.columnDefs = [
            {
                name: 'case.id',
                headerCellClass: $scope.highlightFilteredHeader,
                enableCellEdit: false,
                displayName: 'Case ID',
                type: 'number',
                width: '9%',
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="index.html/#/cases/{{COL_FIELD}}">{{COL_FIELD}}</a></div>'
            },
            {
                name: 'case.assignedTo',
                enableCellEdit: false,
                displayName: 'Assigned To',
                headerCellClass: $scope.highlightFilteredHeader,
                width: '16%'
            },
            {
                name: 'case.status',
                displayName: 'Status',
                headerCellClass: $scope.highlightFilteredHeader,
                editableCellTemplate: 'ui-grid/dropdownEditor',
                width: '12%',
                headerCellClass: $scope.highlightFilteredHeader,
                filter: {
                    term: '1',
                    type: uiGridConstants.filter.SELECT,
                    selectOptions: [
                        {value: '1', label: 'opened'},
                        {value: '2', label: 'closed'}]
                },
                cellFilter: 'mapStatus',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: [
                    {id: 1, status: 'opened'},
                    {id: 2, status: 'closed'}
                ]
            },
            {
                name: 'case.beneficiaryName',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'Beneficiary Name',
                width: '16%'
            },
            {
                name: 'case.totalAmt',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'Total Amount',
                type: 'number',
                cellFilter: 'currency',
                width: '12%'
            },
            {
                name: 'case.openedDate',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'Opened Date',
                type: 'date',
                cellFilter: 'date:"yyyy-MM-dd"',
                width: '12%'
            },
            {
                name: 'case.sla',
                headerCellClass: $scope.highlightFilteredHeader,
                displayName: 'SLA',
                type: 'date',
                cellFilter: 'date:"yyyy-MM-dd"',
                width: '12%'
            },
            {
                name: 'case.daysOpen',
                headerCellClass: $scope.highlightFilteredHeader,
                enableCellEdit: false,
                displayName: 'Days Open',
                type: 'number',
                width: '11%'
            }
        ];

        $scope.msg = {};

        $scope.gridOptions.onRegisterApi = function (gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                $scope.msg.lastCellEdited = 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.case.id + ' from ' + oldValue + ' to ' + newValue;
                $scope.$apply();
            });
        };

    console.log($location.path());
    var request = $location.path();

        $http.get("data" + $location.path() + ".json")
            .then(function (response) {
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
    }])
    .filter('mapStatus', function () {
        var statusHash = {
            1: 'opened',
            2: 'closed'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return statusHash[input];
            }
        };
    });

angular.module('staticSelect', [])
    .controller('ExampleController', ['$scope', function ($scope) {
        $scope.data = {
            singleSelect: null,
            multipleSelect: [],
            option1: 'option-1',
        };

        $scope.forceUnknownOption = function () {
            $scope.data.singleSelect = 'nonsense';
        };
    }]);

app.controller('caseFormController', ['$scope', '$http', function ($scope, $http, formlyVersion) {
    var vm = this;

    vm.onSubmit = onSubmit;
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
    vm.model = {};

    function init() {





        // An array of our form fields with configuration
        // and options set. We make reference to this in
        // the 'fields' attribute on the <formly-form> element
        vm.fields = [
            {
                "type": "radio",
                "key": "status",
                defaultValue: 'open',
                "templateOptions": {
                    "options": [
                        {
                            "name": "Open",
                            "value": "open"
                        },
                        {
                            "name": "In Process",
                            "value": "process"
                        },
                        {
                            "name": "Closed",
                            "value": "closed"
                        }
                    ],
                    "label": "Field Type",
                    "required": true
                }
            },
            {
                className: 'row',
                fieldGroup: [

                    {
                        className: 'col-xs-4',
                        key: 'type',
                        type: 'select',
                        templateOptions: {
                            label: 'Case Type',
                            required: true,
                            options: [],
                            valueProp: 'id',
                            labelProp: 'name'
                        },
                        controller: /* @ngInject */ function ($scope, DataService) {
                            $scope.to.loading = DataService.type().then(function (response) {
                                $scope.to.options = response;
                                return response;
                            });

                        }
                    },
                    {
                        className: 'col-xs-4',
                        key: 'subtype',
                        type: 'select',
                        templateOptions: {
                            label: 'Case Subtype',
                            options: [],
                            valueProp: 'id',
                            labelProp: 'name'

                        },
                        controller: /* @ngInject */ function ($scope, DataService) {
                            $scope.$watch('model.type', function (newValue, oldValue, theScope) {
                                if (newValue !== oldValue) {
                                    // logic to reload this select's options asynchronusly based on state's value (newValue)
                                    console.log('new value is different from old value');
                                    if ($scope.model[$scope.options.key] && oldValue) {
                                        // reset this select
                                        $scope.model[$scope.options.key] = '';
                                    }
                                    // Reload options
                                    $scope.to.loading = DataService.subtype(newValue).then(function (res) {
                                        $scope.to.options = res;
                                    });
                                }
                            });

                        }

                    },
                    {
                        className: 'col-xs-4',
                        key: 'sla',
                        type: 'input',
                        templateOptions: {
                            type: 'date',
                            label: 'SLA',
                            placeholder: 'SLA',
                            required: true
                        }
                    }
                ]
            },
            {
                className: 'section-label',
                template: '<hr /><div><strong><font size ="6px">Beneficiary Information:</font></strong></div>'
            },
            {
                className: 'row',
                fieldGroup: [
                    {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'firstName',
                        templateOptions: {
                            label: 'First Name',
                            required: true
                        }

                    },
                    {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'lastName',
                        templateOptions: {
                            label: 'Last Name',
                            required: true
                        }
                    }
                ]
            },
            {
                className: 'row',
                fieldGroup: [
                    {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'account_number',
                        templateOptions: {
                            label: 'Account Number',
                            required: true
                        }

                    },
                    {
                        className: 'col-xs-6',
                        type: 'input',
                        key: 'ssn',
                        templateOptions: {
                            type: 'password',
                            label: 'Social Security Number',
                            required: true
                        }

                    }
                ]
            },

            {
                className: 'section-label',
                template: '<hr /><div><strong><font size ="6px">Payment Information:</font></strong></div>'
            },

            {
                className: 'row',
                //type: 'repeatSection',
                //key: 'payments',
                //templateOptions: {
                //    btnText: 'Add another payment',

                fieldGroup: [
                    {
                        className: 'col-xs-4',
                        key: 'pay_Amt',
                        type: 'input',
                        templateOptions: {
                            type: 'number',
                            label: 'Payment Amount',
                            placeholder: 'Enter payment amount',
                            required: true
                        }
                    },
                    {
                        className: 'col-xs-4',
                        key: 'recovery_method',
                        type: 'select',
                        templateOptions: {
                            label: 'Recovery Method',
                            required: true,
                            options: [],
                            valueProp: 'id',
                            labelProp: 'name'
                        },
                        controller: /* @ngInject */ function ($scope, DataService) {
                            $scope.$watch('model.subtype', function (newValue, oldValue, theScope) {
                                if (newValue !== oldValue) {
                                    // logic to reload this select's options asynchronusly based on state's value (newValue)
                                    console.log('new value is different from old value');
                                    if ($scope.model[$scope.options.key] && oldValue) {
                                        // reset this select
                                        $scope.model[$scope.options.key] = '';
                                    }
                                    // Reload options
                                    $scope.to.loading = DataService.recovery(newValue).then(function (res) {
                                        $scope.to.options = res;
                                    });
                                }
                            });
                        }
                    },
                    {
                        className: 'row',
                        fieldGroup: [
                            {
                                className: 'col-xs-4',
                                key: 'completed_Date',
                                type: 'input',
                                templateOptions: {
                                    type: 'date',
                                    label: 'Completed Date',
                                    placeholder: 'Enter completed date',
                                    required: true
                                }
                            }]
                    }

                ]

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


}]);

app.factory('DataService', function DataService($http, $q) {
    return {
        type: type,
        subtype: subtype,
        recovery: recovery
    };

    function type() {
        var deferred = $q.defer();
        // dummy data
        var data = [{
            id: 1,
            name: 'Government Reclamations'
        }, {
            id: 2,
            name: 'POA'
        }, {
            id: 3,
            name: 'Reversals/Deletions'
        }, {
            id: 4,
            name: 'Returns'
        }, {
            id: 5,
            name: 'Unresolved/Dishonored Returns'
        }
        ];
        deferred.resolve(data);
        return deferred.promise;
    }

    function subtype(type_id) {
        var deferred = $q.defer();
        // dummy data
        var data = [{
            id: 1,
            fk: 1,
            name: 'Government Reclamations'
        }, {
            id: 2,
            fk: 1,
            name: 'CRF'
        }, {
            id: 3,
            fk: 1,
            name: 'DCN'
        }, {
            id: 4,
            fk: 1,
            name: 'DNE'
        }, {
            id: 5,
            fk: 1,
            name: 'Treasury Referral'
        }, {
            id: 6,
            fk: 1,
            name: 'Treasury Refund'
        }];
        if (!!type_id) {
            var tmp = [];
            angular.forEach(data, function (val) {
                if (val.fk === type_id)
                    tmp.push(val);
            });
            deferred.resolve(tmp);
        } else {
            deferred.resolve(data);
        }


        return deferred.promise;
    }

    function recovery(subtype_id) {
        var deferred = $q.defer();
        // dummy data
        var data = [{
            id: 1,
            fk: 1,
            name: 'ACH Return'
        }, {
            id: 2,
            fk: 1,
            name: 'Cashiers Check Mailed'
        }, {
            id: 3,
            fk: 1,
            name: 'Mixed Method'
        }, {
            id: 4,
            fk: 2,
            name: 'ACH Return'
        }, {
            id: 5,
            fk: 2,
            name: 'Cashiers Check Mailed'
        }, {
            id: 6,
            fk: 2,
            name: 'Mixed Method'
        }, {
            id: 7,
            fk: 3,
            name: 'ACH Return'
        }, {
            id: 8,
            fk: 3,
            name: 'Cashiers Check Mailed'
        }, {
            id: 9,
            fk: 3,
            name: 'Mixed Method'
        }, {
            id: 10,
            fk: 4,
            name: 'ACH Return'
        }, {
            id: 11,
            fk: 4,
            name: 'Cashiers Check Mailed'
        }, {
            id: 12,
            fk: 4,
            name: 'Mixed Method'
        }, {
            id: 13,
            fk: 5,
            name: 'Commerce Bank'
        }, {
            id: 14,
            fk: 5,
            name: 'Customer DDA'
        }, {
            id: 15,
            fk: 5,
            name: 'Other'
        }, {
            id: 16,
            fk: 6,
            name: 'Commerce Bank'
        }, {
            id: 17,
            fk: 6,
            name: 'Customer DDA'
        }, {
            id: 18,
            fk: 6,
            name: 'Other'
        }
        ];
        if (!!subtype_id) {
            var tmp = [];
            angular.forEach(data, function (val) {
                if (val.fk === subtype_id)
                    tmp.push(val);
            });
            deferred.resolve(tmp);
        } else {
            deferred.resolve(data);
        }


        return deferred.promise;
    }
});
