(function () {
    'use strict';

    // Use when sorting from table header is needed. it's value should be the query parameter
    // that needs to be queried
    angular.module("ngViolet")
        .directive("ngvStringToNumber", fn);

    function fn() {
        return {
            require: 'ngModel',
            link   : function (scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function (value) {
                    return '' + value;
                });
                ngModel.$formatters.push(function (value) {
                    return parseFloat(value, 10);
                });
            }
        };
    }
})();
