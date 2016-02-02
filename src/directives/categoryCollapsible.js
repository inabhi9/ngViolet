/**
 * Directives to list categories with collapsible button
 */

(function () {
    'use strict';

    angular
        .module('ngViolet')
        .directive('ngvCategoryCollapsible', fn);

    /** @ngInject */
    function fn() {
        return {
            priority: -1,
            restrict: 'E',
            scope   : {
                items: '='
            },
            link    : function ($scope) {
                $scope.ui = {items: []};
            },
            template: '<div ng-if="items.length"' +
            'class="label label-info label-sm margin-right-5">' +
            '{{items[0].name}}</div>' +
            '<div ng-repeat="c in items"' +
            'ng-if="$index>0"' +
            'ng-show="ui.items[$this.id]==true"' +
            'class="label label-info label-sm margin-right-5">' +
            '{{c.name}}</div>' +
            '<button ng-if="items.length>1"' +
            'class="btn btn-default btn-xs margin-right-5"' +
            'ng-click="ui.items[$this.id]=!ui.items[$this.id]">' +
            '...' +
            '</button>'
        };
    }
})();
