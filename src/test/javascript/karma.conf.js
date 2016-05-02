// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '../../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            // bower:js
            'src/main/webapp/bower_components/jquery/dist/jquery.js',
            'src/main/webapp/bower_components/angular/angular.js',
            'src/main/webapp/bower_components/angular-aria/angular-aria.js',
            'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/main/webapp/bower_components/angular-cache-buster/angular-cache-buster.js',
            'src/main/webapp/bower_components/angular-cookies/angular-cookies.js',
            'src/main/webapp/bower_components/ngstorage/ngStorage.js',
            'src/main/webapp/bower_components/angular-loading-bar/build/loading-bar.js',
            'src/main/webapp/bower_components/angular-resource/angular-resource.js',
            'src/main/webapp/bower_components/angular-sanitize/angular-sanitize.js',
            'src/main/webapp/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/main/webapp/bower_components/bootstrap-ui-datetime-picker/dist/datetime-picker.js',
            'src/main/webapp/bower_components/json3/lib/json3.js',
            'src/main/webapp/bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'src/main/webapp/bower_components/api-check/dist/api-check.js',
            'src/main/webapp/bower_components/angular-formly/dist/formly.js',
            'src/main/webapp/bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
            'src/main/webapp/bower_components/angular-ui-grid/ui-grid.js',
            'src/main/webapp/bower_components/csv-js/csv.js',
            'src/main/webapp/bower_components/pdfmake/build/pdfmake.js',
            'src/main/webapp/bower_components/pdfmake/build/vfs_fonts.js',
            'src/main/webapp/bower_components/angular-touch/angular-touch.js',
            'src/main/webapp/bower_components/angular-animate/angular-animate.js',
            'src/main/webapp/bower_components/angular-object-diff/dist/angular-object-diff.js',
            'src/main/webapp/bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
            'src/main/webapp/bower_components/bootstrap-material-design/dist/js/material.js',
            'src/main/webapp/bower_components/bootstrap-material-design/dist/js/ripples.js',
            'src/main/webapp/bower_components/moment/moment.js',
            'src/main/webapp/bower_components/angular-advanced-searchbox/dist/angular-advanced-searchbox-tpls.js',
            'src/main/webapp/bower_components/angular-messages/angular-messages.js',
            'src/main/webapp/bower_components/angular-material/angular-material.js',
            'src/main/webapp/bower_components/datatables.net/js/jquery.dataTables.js',
            'src/main/webapp/bower_components/datatables.net-buttons/js/dataTables.buttons.js',
            'src/main/webapp/bower_components/datatables.net-buttons/js/buttons.colVis.js',
            'src/main/webapp/bower_components/datatables.net-buttons/js/buttons.flash.js',
            'src/main/webapp/bower_components/datatables.net-buttons/js/buttons.html5.js',
            'src/main/webapp/bower_components/datatables.net-buttons/js/buttons.print.js',
            'src/main/webapp/bower_components/datatables/media/js/jquery.dataTables.js',
            'src/main/webapp/bower_components/angular-datatables/dist/angular-datatables.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/bootstrap/angular-datatables.bootstrap.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/colreorder/angular-datatables.colreorder.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/light-columnfilter/angular-datatables.light-columnfilter.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/colvis/angular-datatables.colvis.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/fixedcolumns/angular-datatables.fixedcolumns.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/fixedheader/angular-datatables.fixedheader.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/scroller/angular-datatables.scroller.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/tabletools/angular-datatables.tabletools.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/buttons/angular-datatables.buttons.js',
            'src/main/webapp/bower_components/angular-datatables/dist/plugins/select/angular-datatables.select.js',
            'src/main/webapp/bower_components/angular-mocks/angular-mocks.js',
            // endbower
            'main/webapp/scripts/app/app.js',
            'main/webapp/scripts/app/**/*.js',
            'main/webapp/scripts/components/**/*.+(js|html)',
            'test/javascript/spec/helpers/module.js',
            'test/javascript/spec/helpers/httpBackend.js',
            'test/javascript/**/!(karma.conf).js'
        ],


        // list of files / patterns to exclude
        exclude: [],

        preprocessors: {
            './**/*.js': ['coverage']
        },

        reporters: ['dots', 'jenkins', 'coverage', 'progress'],

        jenkinsReporter: {
            
            outputFile: '../build/test-results/karma/TESTS-results.xml'
        },

        coverageReporter: {
            
            dir: '../build/test-results/coverage',
            reporters: [
                {type: 'lcov', subdir: 'report-lcov'}
            ]
        },

        // web server port
        port: 9876,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false,

        // to avoid DISCONNECTED messages when connecting to slow virtual machines
        browserDisconnectTimeout : 10000, // default 2000
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 4*60*1000 //default 10000
    });
};
