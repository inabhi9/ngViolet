/**
 * Provides User service that stores user json data into session or in local storage if rememberMe
 * attribute is set to true
 */

(function () {
    'use strict';

    angular
        .module('ngViolet')
        .service('UserService', UserService);

    function UserService($window) {
        var vm = this;

        var storage = {
            setItem   : function (key, value, withLocalStorage) {
                if (typeof(value) == 'object')
                    value = angular.toJson(value);

                $window.sessionStorage.setItem(key, value);
                if (withLocalStorage === true)
                    localStorage.setItem(key, value);
            },
            getItem   : function (key) {
                var sValue = $window.sessionStorage.getItem(key);
                var lValue = localStorage.getItem(key);
                var value = sValue || lValue;

                try {
                    return angular.fromJson(value);
                } catch (e) {
                    return value;
                }
            },
            removeItem: function (key) {
                $window.sessionStorage.removeItem(key);
                localStorage.removeItem(key);
            }
        };

        this.login = function (user) {
            var withLocalStorage = false;
            if (user.rememberMe === true)
                withLocalStorage = true;
            storage.setItem('user', user, withLocalStorage);

            return true;
        };

        this.isLoggedIn = function () {
            var user = storage.getItem('user');

            return !!user;

        };

        this.logout = function () {
            storage.removeItem('user');
        };

        this.get = function () {
            return storage.getItem('user');
        };

        this.set = function (data) {
            this.login(data);
        };
    }
})();

