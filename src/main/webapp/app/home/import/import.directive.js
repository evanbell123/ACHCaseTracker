(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .directive('onReadFile', onReadFileDirective);

    onReadFileDirective.$inject = ['$parse'];

    function onReadFileDirective($parse) {
        return {
            restrict: 'A',
            scope: false,
            link: function(scope, element, attrs) {
                var fn = $parse(attrs.onReadFile);

                element.on('change', function(onChangeEvent) {
                    var reader = new FileReader();

                    reader.onload = function(onLoadEvent) {
                        scope.$apply(function() {
                            fn(scope, {
                                $fileContent: onLoadEvent.target.result
                            });
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
    }
})();
