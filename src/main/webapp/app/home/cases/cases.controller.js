(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CasesController', CasesController)

    CasesController.$inject = ['$scope', '$location', '$http', '$timeout', 'uiGridConstants', 'Enums', 'EnumsService', 'Principal'];



    function CasesController($scope, $location, $http, $timeout, uiGridConstants, Enums, EnumsService, Principal) {

      function updateRequest(data, successResponse, errorResonse) {
        $http({
            method: 'PUT',
            url: 'api/ach-case',
            data: data
        }).then(function successCallback(response) {

            //console.log(response.data.status);

            $scope.msg.lastCellEdited = successResponse;
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            alert(errorResonse);
        });
      }

        $scope.watch = function(data) {

            if (data.isWatched == true) {
              var copyAccount;
                Principal.identity().then(function(account) {
                    //console.log(account);
                    copyAccount = account;
                    //console.log(copyAccount);

                    data.assignedTo = Object.assign({}, copyAccount);
                    data.assignedTo.fullName = data.assignedTo.firstName + " " + data.assignedTo.lastName;
                    //console.log(data.assignedTo);
                });



                //console.log(data.assignedTo);
            } else {
                data.assignedTo = null;
            }
            console.log(data);

            updateRequest(data, "Item watched", "Watch item failed");
        }

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
            exporterFieldCallback: function(grid, row, col, input) {
                if (col.name == 'status') {
                    return Enums.CaseStatus[input].displayName;
                }
                if (col.name == 'type') {
                    return Enums.CaseType[input].displayName;
                }
                if (col.name == 'subtype') {
                    return Enums.CaseSubtype[input].displayName;
                } else {
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

        $scope.gridOptions.columnDefs = [
            /*
                            name: 'id',
                            headerCellClass: $scope.highlightFilteredHeader,
                            enableCellEdit: false,
                            displayName: 'Case ID',
                            type: 'number',
                            width: '9%',
                            cellTemplate: '<div class="ui-grid-cell-contents">{{COL_FIELD}}</div>'
                        },
                        */
            {
                name: 'isWatched',
                displayName: 'Watch Item',
                enableCellEdit: false,
                type: 'boolean',
                enableFiltering: false,
                cellTemplate: '<input type="checkbox" ng-model="row.entity.isWatched" ng-change="grid.appScope.watch(row.entity)">',
                width: '5%'
            }, {
                name: 'assignedTo.fullName',
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
                    selectOptions: dropdownFilterOptions(Enums.CaseStatus)
                },
                cellFilter: 'mapCaseStatus',
                editDropdownValueLabel: 'status',
                editDropdownOptionsArray: dropdownEditorOptions(Enums.CaseStatus)
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
                    selectOptions: dropdownFilterOptions(Enums.CaseType)
                },
                cellFilter: 'mapCaseType',
                editDropdownValueLabel: 'type'
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



                //console.log(colDef.isWatched);
                updateRequest(rowEntity, 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.id + ' from ' + oldValue + ' to ' + newValue, "Failed to update");
/*
                $http({
                    method: 'PUT',
                    url: 'api/ach-case',
                    data: rowEntity
                }).then(function successCallback(response) {

                    //console.log(response.data.status);

                    $scope.msg.lastCellEdited = 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.id + ' from ' + oldValue + ' to ' + newValue;
                }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.

                });
                */
                $scope.$apply();
            });
            $scope.gridApi.core.addRowHeaderColumn({
                name: 'rowHeaderCol',
                displayName: '',
                width: 60,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="index.html#/ach-case/{{id.COL_FIELD}}"><button class="btn" type="button" ng-click="grid.appScope.Main.openAddress(COL_FIELD)"  style="background-color:#309479; color:#fff; text-align:center; padding:0 12px">Edit</button></a> </div>'
            });
        };

        //console.log($location.path());
        var request = $location.path();

        $http.get("api/ach-case")
            .then(function(response) {

                var data = response.data;



                for (var i = 0; i < data.length; i++) {
                    //console.log(data[i].status, data[i].type);
                    data[i].status = EnumsService.getEnumIdFromName(Enums.CaseStatus, data[i].status);
                    data[i].type = EnumsService.getEnumIdFromName(Enums.CaseType, data[i].type);
                    //console.log(data[i].status, data[i].type);
                    data[i].lastPaymentOn = new Date(data[i].lastPaymentOn);
                    data[i].slaDeadline = new Date(data[i].slaDeadline);

                    data[i].isWatched = false;

                    if (data[i].assignedTo !== null) {
                        data[i].isWatched = true;
                        data[i].assignedTo.fullName = data[i].assignedTo.firstName + " " + data[i].assignedTo.lastName;
                    }
                    //console.log(data[i].isWatched);
                }
                $scope.gridOptions.data = data;


                //console.log(data);
            });
    }
    /*
        function getEnumIdFromName(CaseEnum, name) {
            var enumId = CaseEnum.filter(function(value) {
                return value.name === name;
            })[0].id;

            console.log(enumId, name);

            return enumId;
        }
        */

    function dropdownEditorOptions(CaseEnum) {
        //console.log(caseStatus);
        var selectOptions = [];
        for (var i = 0; i < CaseEnum.length; i++) {
            var option = {
                id: CaseEnum[i].id,
                status: CaseEnum[i].name
            };
            selectOptions.push(option);
        }
        //console.log(selectOptions);
        return selectOptions;
    }

    function dropdownFilterOptions(CaseEnum) {
        var selectOptions = [];
        for (var i = 0; i < CaseEnum.length; i++) {
            var option = {
                value: CaseEnum[i].id,
                label: CaseEnum[i].name
            };
            selectOptions.push(option);
        }
        //console.log(selectOptions);
        return selectOptions;
    }
})();
