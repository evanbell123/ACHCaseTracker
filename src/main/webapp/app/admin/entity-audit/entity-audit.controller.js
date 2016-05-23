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
            var style = {
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
                    color: 'green'
                }
            };

            var docDefinition =  {
                content: {
                    style: 'tableExample',
                    widths: [ '20%', '5%', '5%', "40%", '15%', '10%', "5%"],
                    table: { headerRows: 1, body: [] }
                },
                styles: style,
                pageOrientation: 'landscape',
                pageSize: 'LETTER'
            };

            function createTable(audits) {
                addHeader();
                for (var i = 0; i < audits.length; i++) {
                   addRow(audits[i]);
                }
            }

            function addHeader() {
                var headers = ['Entity Id', 'Action', 'Version', 'Value',
                    'Modified Date', 'Modified By'];
                var tableHeader = [];
                for (var i = 0; i < headers.length; i++) {
                    var object = { text: headers[i], style: 'tableHeader' };
                    tableHeader.push(object);
                }
                docDefinition.content.table.body[0] = tableHeader;
            }

            function addRow(auditRecord) {
                var properties = ['entityId', 'action', 'commitVersion', 'entityValue',
                    'modifiedDate', 'modifiedBy'];
                var row = [];
                for (var i = 0; i < properties.length; i++) {
                    if (properties[i] == 'entityValue' || properties[i] == 'commitVersion')
                        row.push(JSON.stringify(auditRecord[properties[i]], null, 2));
                    else
                        row.push(auditRecord[properties[i]]);

                }
                docDefinition.content.table.body.push(row);
            }

            createTable(vm.audits);

            // open the PDF in a new window
            pdfMake.createPdf(docDefinition).open();
        };
    }
})();
