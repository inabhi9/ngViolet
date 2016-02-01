/**
 * PaginationService
 * =================
 *
 * This service provides complete set of methods and variables to fetch data and perform remove
 * action
 */

(function () {
    'use strict';

    angular
        .module('ngViolet')
        .service('PaginationService', service);

    /** @ngInject **/
    function service($location, $state, $log, $q) {
        return {
            install: install
        };

        function install(vm, options) {
            angular.extend(vm, {
                queryParams: {page_size: 10, page: $location.search().page},
                refresh    : refresh,
                remove     : remove,
                reload     : reload,
                data       : {items: [], hasMore: true},
                pageChanged: pageChanged,
                filter     : filter,
                // This variable holds th status of the API, if data is fetched through the API,
                // it'll turn true. It has to be done because not all pagination links are
                // populated during the page load so it triggers page change when refresh() sets
                // the current page
                isApiReady : false
            });

            options.scope.$on('searchUpdate', function () {
                refresh();
            });

            function refresh() {
                angular.extend(vm.queryParams, $location.search());
                // Set 'page' param to 1 when its value is missing but param exists in url
                vm.queryParams.page = vm.queryParams.page == true ? 1 : vm.queryParams.page;
                // Turning off hasMore, we'll decide if server has more items to load
                vm.data.hasMore = false;
                // Calling onBeforeLoad
                if (angular.isDefined(options.onBeforeLoad)) {
                    options.onBeforeLoad();
                }

                var q = options.api.list(vm.queryParams)
                    .then(function (resp) {
                        if (angular.isDefined(options.transformResponse))
                            resp = options.transformResponse(resp);
                        if (options.appendItems == true)
                            Array.prototype.push.apply(vm.data.items, resp);
                        else
                            vm.data.items = resp;

                        vm.data.meta = resp.meta;
                        vm.queryParams.page = $state.params.page || 1;
                        vm.data.pageState = calcPaginationState(
                            vm.queryParams.page, vm.queryParams.page_size, vm.data.items.length
                        );
                        vm.data.hasMore = vm.data.meta.next != null;
                        $log.debug('List data:', resp.meta, $state.params, vm.data.hasMore);
                        return resp;
                    })
                    .catch(function (resp) {
                        $log.debug('Pagination service error:', resp);
                        if (resp.status == 404 && resp.data.error.detail.indexOf('Invalid page') > -1) {
                            $log.debug('going to page 1');
                            vm.filter();
                        }
                        return $q.reject(resp);
                    })
                    .finally(function () {
                        vm.isApiReady = true;
                    });

                if (angular.isDefined(options.afterLoad))
                    options.afterLoad(q);
                return q;
            }

            function remove(id) {
                return options.api.remove(id).then(function () {
                    notify.info(options.title + ' deleted successfully', 'Delete ' + options.title);

                    // Don't blatantly refresh resource but check if page contains only one item and
                    // it's deleted we should move to the previous page
                    if (vm.data.items.length == 1) {
                        if (vm.queryParams.page > 1)
                            vm.queryParams.page -= 1;
                    }

                    refresh();
                });
            }

            function pageChanged() {
                if (vm.isApiReady === true)
                    $state.go('.', vm.queryParams);
            }

            function filter() {
                vm.queryParams.page = 1;
                $state.go('.', vm.queryParams);

                // If append item is true, we want to clear all items
                if (options.appendItems === true) {
                    vm.data.items = [];
                    vm.data.hasMore = true
                }
            }

            function reload() {
                vm.data.hasMore = true;
                refresh();
            }


            function calcPaginationState(currentPage, pageSize, returnedItemCount) {
                return {
                    start: (currentPage - 1) * pageSize + 1,
                    to   : (currentPage - 1) * pageSize + returnedItemCount
                }
            }

            return vm;
        }
    }
})();

