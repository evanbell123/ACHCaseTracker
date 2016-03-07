// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var app = angular.module('app', ['ngRoute', 'ngTouch', 'ui.grid', 'ui.grid.edit', 'ui.grid.exporter', 'formly', 'formlyBootstrap']);

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

angular.module('addressFormatter', []).filter('address', function () {
    return function (input) {
        return input.street + ', ' + input.city + ', ' + input.state + ', ' + input.zip;
    };
});

// configure our routes
app.config(function ($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'homeController'
        })

        // route for the about page
        .when('/auditlog', {
            templateUrl: 'pages/auditlog.html',
            controller: 'auditlogController'
        })

        // route for the contact page
        .when('/contact', {
            templateUrl: 'pages/contact.html',
            controller: 'contactController'
        })

        .when('/myCases', {
            templateUrl: 'pages/myCases.html',
            controller: 'myCasesController'
        })

        .when('/import', {
            templateUrl: 'pages/import.html',
            controller: 'importController'
        })

        .when('/caseForm', {
            templateUrl: 'pages/caseForm.html',
            controller: 'caseFormController as vm'
        })

        .when('/cases', {
            templateUrl: 'pages/cases.html',
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

app.controller('contactController', function ($scope) {
    $scope.message = 'Contact us! JK. This is just a demo.';
});

app.controller('casesController', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
    $scope.gridOptions = {};

    $scope.gridOptions.columnDefs = [
        {name: 'case.assignedTo', displayName: 'Assigned To', width: '10%'},
        {name: '_links.case-status.href', displayName: 'Status', width: '10%'},
        {name: 'case.beneficiaryName', displayName: 'Beneficiary Name', width: '30%'},
        {name: 'case.totalAmt', displayName: 'Total Amount', width: '10%'},
        {name: 'case.openedDate', displayName: 'Opened Date', width: '10%'},
        {name: 'case.sla', displayName: 'SLA', width: '10%'},
        {name: 'case.daysOpen', displayName: 'Days Open', width: '10%'}
    ];

    $scope.msg = {};

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        //set gridApi on scope
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            $scope.msg.lastCellEdited = 'edited row id:' + rowEntity.id + ' Column:' + colDef.name + ' newValue:' + newValue + ' oldValue:' + oldValue;
            $scope.$apply();
        });
    };

    $http.get("data/cases.json")
        .then(function(response) {
            console.log(response);
            $scope.gridOptions.data = response.data._embedded.caseResources;
        });

}])

angular.module('staticSelect', [])
    .controller('ExampleController', ['$scope', function($scope) {
        $scope.data = {
            singleSelect: null,
            multipleSelect: [],
            option1: 'option-1',
        };

        $scope.forceUnknownOption = function() {
            $scope.data.singleSelect = 'nonsense';
        };
    }]);

app.controller('caseFormController', ['$scope', '$http', function ($scope, $http) {
    var vm = this;

    vm.onSubmit = onSubmit;

    vm.model = {
        awesome: true
    };

    vm.options = {
        formState: {
            awesomeIsForced: false
        }
    };

    // The model object that we reference
    // on the <formly-form> element in index.html
    vm.model = {};


    // An array of our form fields with configuration
    // and options set. We make reference to this in
    // the 'fields' attribute on the <formly-form> element
    vm.fields = [
        {
            key: 'assignedTo',
            type: 'input',
            templateOptions: {
                type: 'number',
                label: 'Assigned To ID',
                placeholder: 'Enter the id of the user this case is assigned to',
                required: true
            }
        },
        {
            key: 'beneficiaryName',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Beneficiary Name',
                placeholder: "Enter the beneficiary's name",
                required: true
            }
        },
        {
            key: 'totalAmt',
            type: 'input',
            templateOptions: {
                type: 'number',
                label: 'Total Amount',
                placeholder: 'Enter total amount',
                required: true
            }
        },
        {
            key: 'openedDate',
            type: 'input',
            templateOptions: {
                type: 'date',
                label: 'Opened Date',
                placeholder: 'Enter the opened date',
                required: true
            }
        },
        {
            key: 'daysOpen',
            type: 'input',
            templateOptions: {
                type: 'number',
                label: 'Days Open',
                placeholder: 'days open',
                required: true
            }
        },
        {
            key: 'sla',
            type: 'input',
            templateOptions: {
                type: 'date',
                label: 'SLA',
                placeholder: 'SLA',
                required: true
            }
        },
        {
            key: 'status',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'status',
                placeholder: 'status',
                required: true
            }
        },
        {
            key: 'notes',
            type: 'input',
            templateOptions: {
                type: 'text',
                label: 'Notes',
                placeholder: 'notes',
                required: true
            }
        },
    ];

    function onSubmit() {
        //vm.model.openedDate = vm.model.openedDate.getTime();
        //vm.model.sla = vm.model.sla.getTime();

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

app.controller('myCasesController', ['$scope', '$http', function ($scope, $http) {
    $scope.gridOptions = {
        columnDefs: [
            {field: 'name'},
            {field: 'gender', visible: false},
            {field: 'company'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterCsvFilename: 'myFile.csv',
        exporterPdfDefaultStyle: {fontSize: 9},
        exporterPdfTableStyle: {margin: [30, 30, 30, 30]},
        exporterPdfTableHeaderStyle: {fontSize: 10, bold: true, italics: true, color: 'red'},
        exporterPdfHeader: {text: "My Header", style: 'headerStyle'},
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
        exporterPdfMaxGridWidth: 500,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $http.get('data/100.json')
        .success(function (data) {
            $scope.gridOptions.data = data;
        });

}]);


