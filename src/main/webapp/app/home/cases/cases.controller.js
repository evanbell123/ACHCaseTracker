/*
This controller is used for both /ach-case and /my-cases
*/

(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('CasesController', CasesController)

    CasesController.$inject = ['$scope', '$location', '$http', '$timeout', 'uiGridConstants', 'ACHCaseTwo', 'Enums', 'EnumsService', 'Principal'];



    function CasesController($scope, $location, $http, $timeout, uiGridConstants, ACHCaseTwo, Enums, EnumsService, Principal) {



        /*
        Listen for when the user checks or unchecks the watch item check box
        */
        $scope.watch = function(data) {
            /*
            If the user checks 'watch item'
            assign that user to the case
            */
            if (data.isWatched == true) {
                var copyAccount;
                Principal.identity().then(function(account) {
                    copyAccount = account;
                    data.assignedTo = copyAccount.login;
                });
            } else { //If the user unchecks 'watch item', unassign the currently assigned user
                data.assignedTo = null;
            }
            /*
            notify the server of this change of assignment
            */

            ACHCaseTwo.update(data);
        }

        /*
        Highlight columns that are filtering the results
        */
        $scope.highlightFilteredHeader = function(row, rowRenderIndex, col, colRenderIndex) {
            if (col.filters[0].term) {
                return 'header-filtered';
            } else {
                return '';
            }
        };

        /*
        Export to CSV or PDF
        */
        $scope.export = function() {
            if ($scope.export_format == 'csv') {
                var myElement = angular.element(document.querySelectorAll(".custom-csv-link-location"));
                $scope.gridApi.exporter.csvExport($scope.export_row_type, $scope.export_column_type, myElement);
            } else if ($scope.export_format == 'pdf') {
                $scope.gridApi.exporter.pdfExport($scope.export_row_type, $scope.export_column_type);
            };
        };

        /*
        Set basic grid options
        */
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
            /*
            Convert integers back to enum values
            before exporting to PDF
            If any data needs to be altered to a more presentable format before exporting,
            to that here
            */
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

            /*
            Specify the PDF footer
            */
            exporterPdfFooter: function(currentPage, pageCount) {
                return {
                    text: currentPage.toString() + ' of ' + pageCount.toString(),
                    style: 'footerStyle'
                };
            },

            /*
            Customize PDF Style
            */
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

        /*
        Add columns to the grid
        */
        $scope.gridOptions.columnDefs = [{
                name: 'isWatched',
                displayName: 'Watch Item',
                enableCellEdit: false,
                type: 'boolean',
                enableFiltering: false,
                cellTemplate: '<input type="checkbox" ng-model="row.entity.isWatched" ng-change="grid.appScope.watch(row.entity)">',
                width: '5%'
            }, {
                name: 'assignedTo',
                enableCellEdit: false,
                displayName: 'Assigned To',
                headerCellClass: $scope.highlightFilteredHeader,
                width: '16%',
                visible: false
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

        $scope.selectGridRow = function() {
            if ($scope.selectedItem[0].total != 0) {
                //$location.path('edit-case/' + $scope.selecteditem[0].id);
                return $scope.selecteditem[0].id;
            }
        };

        /*
        Specify what happens after editing a cell
        and custom templates if needed
        */
        $scope.gridOptions.onRegisterApi = function(gridApi) {
            //set gridApi on scope
            $scope.gridApi = gridApi;
            gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
                $scope.msg.lastCellEdited = 'You changed ' + colDef.displayName + ' of case number ' + rowEntity.id + ' from ' + oldValue + ' to ' + newValue, "Failed to update";
                ACHCaseTwo.update(rowEntity);

                $scope.$apply();
            });
            $scope.gridApi.core.addRowHeaderColumn({
                name: 'rowHeaderCol',
                displayName: '',
                width: 60,
                cellTemplate: '<div class="ui-grid-cell-contents"><a href="#/edit-case/{{row.entity.id}}"><button class="btn" type="button"  style="background-color:#309479; color:#fff; text-align:center; padding:0 12px">Edit</button></a> </div>'
            });
        };

        /*
        If the user clicks the cases tab, request == /ach-case
        If the user clicks the my cases tab, request == /my-cases
        */
        var currentLocation = $location.path();
        /*
        If the current location == /my-cases
        then show only cases that are assigned to the user
        that is currently logged in
        */
        if (currentLocation !== "/ach-case") {
            $scope.gridOptions.data = ACHCaseTwo.assigned();
            //console.log($scope.gridOptions.data);
        } else { //else the current location is /ach-case
            $scope.gridOptions.data = ACHCaseTwo.all();
            //console.log($scope.gridOptions.data);
        }
        /*
        $http.get("api" + request)
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
                }
                $scope.gridOptions.data = data;
            });
            */

    }

    /*
    Input: Constant Enum Value from enums.constants.js
    Output: Array of selectOptions for that constant enum value
    */
    function dropdownEditorOptions(CaseEnum) {
        var selectOptions = [];
        for (var i = 0; i < CaseEnum.length; i++) {
            var option = {
                id: CaseEnum[i].id,
                status: CaseEnum[i].name
            };
            selectOptions.push(option);
        }
        return selectOptions;
    }

    /*
    Input: Constant Enum Value from enums.constants.js
    Output: Array of filterOptions for that constant enum value
    */
    function dropdownFilterOptions(CaseEnum) {
        var filterOptions = [];
        for (var i = 0; i < CaseEnum.length; i++) {
            var option = {
                value: CaseEnum[i].id,
                label: CaseEnum[i].name
            };
            filterOptions.push(option);
        }
        return filterOptions;
    }
})();
