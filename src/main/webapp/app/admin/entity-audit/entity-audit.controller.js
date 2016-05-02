(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .controller('EntityAuditController', EntityAuditController);

    EntityAuditController.$inject = ['$scope', '$filter', '$uibModal', 'EntityAuditService', 'AlertService', 'ObjectDiff'];

    function EntityAuditController ($scope, $filter, $uibModal, EntityAuditService, AlertService, ObjectDiff) {
        var vm = this;

        vm.entities = [];
        vm.audits = [];
        vm.limits = [25, 50, 100, 200];
        vm.limit = 25;
        vm.loading = false;
        vm.loadChanges = loadChanges;
        vm.findAllAudited = findAllAudited;
        vm.getEntityName = getEntityName;
        vm.format = format;
        vm.isObject = isObject;
        vm.isDate = isDate;
        vm.openChange = openChange;
        vm.exportPDF = exportPDF;

        vm.findAllAudited();
        vm.loadChanges();

        function findAllAudited() {
            EntityAuditService.findAllAudited().then(function (data) {
                vm.entities = data;
            });
        }

        function loadChanges() {
            vm.loading = true;
            var entityType = vm.qualifiedName;
            EntityAuditService.findByEntity(entityType, vm.limit).then(function (data) {
                vm.audits = data.map(function(it){
                    it.entityValue = JSON.parse(it.entityValue);
                    return it;
                });
                vm.loading = false;
            }, function(){
                vm.loading = false;
            });
        };

        function getEntityName(qualifiedName) {
            if (qualifiedName) {
                var splits = qualifiedName.split(".");
                return splits[splits.length - 1];
            }
            else return null;
        };

        function format(val){
            if(val)
                return ObjectDiff.objToJsonView(val);
            else return '';
        };

        function isObject(val){
            return (val && (typeof val) == 'object');
        };

        function isDate(key){
            return (key && key.indexOf("Date") != -1);
        };

        function openChange(audit){

            if(audit.commitVersion < 2){
               AlertService.warning("There is no previous version available for this entry.\nThis is the first" +
                    " audit entry captured for this object");
            }
            else {
                EntityAuditService.getPrevVersion(audit.entityType, audit.entityId, audit.commitVersion).then(function (data) {
                    var previousVersion = JSON.parse(data.entityValue),
                        currentVersion = audit.entityValue;
                    // enable below to have the dates formatted
                    previousVersion = convertDates(previousVersion);
                    currentVersion = convertDates(currentVersion);
                    var diff = ObjectDiff.diffOwnProperties(previousVersion, currentVersion);

                    $uibModal.open({
                        templateUrl: 'app/admin/entity-audit/entity-audit.detail.html',
                        controller: 'AuditDetailModalCtrl',
                        controllerAs: 'vm',
                        size: 'lg',
                        resolve: {
                            diff: function () {
                                return diff;
                            },
                            audit: function () {
                                return audit;
                            }
                        }
                    });
                });
            }
        };

        function convertDates(obj) {
            for(var key in obj) {
                if (obj.hasOwnProperty(key) && obj[key]) {
                    if (key.indexOf("Date") != -1 && (obj[key] instanceof Date || Object.prototype.toString.call(obj[key]) === '[object Date]' || (new Date(obj[key]) !== "Invalid Date" && !isNaN(new Date(obj[key]))))) {
                        obj[key] = $filter('date')(obj[key]);
                    }
                }
            }
            return obj;
        }

        function exportPDF() {
            var docDefinition =  {
                content: [
                    { text: vm.getEntityName(vm.qualifiedName), style: 'header' },
                    'Official documentation is in progress, this document is just a glimpse of what is possible with pdfmake and its layout engine.',
                    { text: 'A simple table (no headers, no width specified, no spans, no styling)', style: 'subheader' },
                    'The following table has nothing more than a body array',
                    {
                        style: 'tableExample',
                        table: {
                            body: [
                                ['Column 1', 'Column 2', 'Column 3'],
                                ['One value goes here', 'Another one here', 'OK?']
                            ]
                        }
                    },
                    { text: 'A simple table with nested elements', style: 'subheader' },
                    'It is of course possible to nest any other type of nodes available in pdfmake inside table cells',
                    {
                        style: 'tableExample',
                        table: {
                            body: [
                                ['Column 1', 'Column 2', 'Column 3'],
                                [
                                    {
                                        stack: [
                                            'Let\'s try an unordered list',
                                            {
                                                ul: [
                                                    'item 1',
                                                    'item 2'
                                                ]
                                            }
                                        ]
                                    },
                                    [
                                        'or a nested table',
                                        {
                                            table: {
                                                body: [
                                                    [ 'Col1', 'Col2', 'Col3'],
                                                    [ '1', '2', '3'],
                                                    [ '1', '2', '3']
                                                ]
                                            },
                                        }
                                    ],
                                    { text: [
                                        'Inlines can be ',
                                        { text: 'styled\n', italics: true },
                                        { text: 'easily as everywhere else', fontSize: 10 } ]
                                    }
                                ]
                            ]
                        }
                    },
                    { text: 'Defining column widths', style: 'subheader' },
                    'Tables support the same width definitions as standard columns:',
                    {
                        bold: true,
                        ul: [
                            'auto',
                            'star',
                            'fixed value'
                        ]
                    },
                    {
                        style: 'tableExample',
                        table: {
                            widths: [100, '*', 200, '*'],
                            body: [
                                [ 'width=100', 'star-sized', 'width=200', 'star-sized'],
                                [ 'fixed-width cells have exactly the specified width', { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }, { text: 'nothing interesting here', italics: true, color: 'gray' }]
                            ]
                        }
                    },
                    { text: 'Headers', style: 'subheader' },
                    'You can declare how many rows should be treated as a header. Headers are automatically repeated on the following pages',
                    { text: [ 'It is also possible to set keepWithHeaderRows to make sure there will be no page-break between the header and these rows. Take a look at the document-definition and play with it. If you set it to one, the following table will automatically start on the next page, since there\'s not enough space for the first row to be rendered here' ], color: 'gray', italics: true },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            // keepWithHeaderRows: 1,
                            // dontBreakRows: true,
                            body: [
                                [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                [
                                    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
                                ]
                            ]
                        }
                    },
                    { text: 'Column/row spans', style: 'subheader' },
                    'Each cell-element can set a rowSpan or colSpan',
                    {
                        style: 'tableExample',
                        color: '#444',
                        table: {
                            widths: [ 200, 'auto', 'auto' ],
                            headerRows: 2,
                            // keepWithHeaderRows: 1,
                            body: [
                                [{ text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                                [{ text: 'Header 1', style: 'tableHeader', alignment: 'center' }, { text: 'Header 2', style: 'tableHeader', alignment: 'center' }, { text: 'Header 3', style: 'tableHeader', alignment: 'center' }],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ { rowSpan: 3, text: 'rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor' }, 'Sample value 2', 'Sample value 3' ],
                                [ '', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', { colSpan: 2, rowSpan: 2, text: 'Both:\nrowSpan and colSpan\ncan be defined at the same time' }, '' ],
                                [ 'Sample value 1', '', '' ],
                            ]
                        }
                    },
                    { text: 'Styling tables', style: 'subheader' },
                    'You can provide a custom styler for the table. Currently it supports:',
                    {
                        ul: [
                            'line widths',
                            'line colors',
                            'cell paddings',
                        ]
                    },
                    'with more options coming soon...\n\npdfmake currently has a few predefined styles (see them on the next page)',
                    { text: 'noBorders:', fontSize: 14, bold: true, pageBreak: 'before', margin: [0, 0, 0, 8] },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                            ]
                        },
                        layout: 'noBorders'
                    },
                    { text: 'headerLineOnly:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                            ]
                        },
                        layout: 'headerLineOnly'
                    },
                    { text: 'lightHorizontalLines:', fontSize: 14, bold: true, margin: [0, 20, 0, 8] },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                            ]
                        },
                        layout: 'lightHorizontalLines'
                    },
                    { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: [
                                [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader'}, { text: 'Header 3', style: 'tableHeader' }],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                                [ 'Sample value 1', 'Sample value 2', 'Sample value 3' ],
                            ]
                        },
                        layout: {
                            hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function(i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                            // paddingLeft: function(i, node) { return 4; },
                            // paddingRight: function(i, node) { return 4; },
                            // paddingTop: function(i, node) { return 2; },
                            // paddingBottom: function(i, node) { return 2; }
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }

            }

            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();
        };
    }
})();
