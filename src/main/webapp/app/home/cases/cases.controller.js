(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CasesController', CasesController)

    CasesController.$inject = ['$scope', '$location', '$http', '$timeout', 'uiGridConstants', 'Enums'];

    function CasesController($scope, $location, $http, $timeout, uiGridConstants, Enums) {
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
                    return Enums.CaseStatus[input-1].displayName;
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
                    selectOptions: function() {
                      var caseStatus = Enums.CaseStatus;
                      var selectOptions = [];
                      for(var i=0; i < Enums.CaseStatus.length; i++) {
                        var option = {value: caseStatus.id, label: caseStatus.displayName};
                        selectOptions.push(option);
                      }
                      console.log(selectOptions);
                      return selectOptions;
                    }
                    /*
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
                    */
                },
                cellFilter: 'mapCaseStatus',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: function() {
                  var caseStatus = Enums.CaseStatus;
                  var selectOptions = [];
                  for(var i=0; i < Enums.CaseStatus.length; i++) {
                    var option = {id: caseStatus.id, status: caseStatus.displayName};
                    selectOptions.push(option);
                  }
                  console.log(selectOptions);
                  return selectOptions;
                }
                /*
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
                */
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
                /*
                editDropdownOptionsArray: function() {
                  var dropdownOptions = [];
                  for (var i = 0; i < Enums.CaseType.length; i++) {
                    var option = {id: Enums.CaseType[i].id, status: Enums.CaseType[i].name};
                    dropdownOptions.push(option);
                  }
                }
                */
                /*
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
                */
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

              var data = rowEntity;

              var status = data.status;
              var type = data.type;

              data.status = getCaseStatusLabel(status);
              data.type = getCaseTypeLabel(type);

              $http({
                  method: 'PUT',
                  url: 'api/a-ch-cases',
                  data: data
              }).then(function successCallback(response) {


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
                return statusLabel;
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
                return statusValue;
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
                return typeLabel;
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
                return typeValue;
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
                return subtypeLabel;
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
                return subtypeValue;
                break;
        }
    }
})();
