var ImportDirectives = angular.module('ImportDirectives', []);

ImportDirectives.directive('dropzone', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var config = {
                url: 'http://localhost:8080/import',
                maxFilesize: 100,
                paramName: "importfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
                autoProcessQueue: false
            };

            var eventHandlers    = {
                'addedfile': function(file) {
                    scope.file = file;
                    if (this.files[1]!=null) {
                        console.log("added file");
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function() {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {
                }

            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function(handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function() {
                console.log("process dropzone");
                dropzone.processQueue();
            };

            scope.resetDropzone = function() {
                dropzone.removeAllFiles();
            }
        }
    }
});
