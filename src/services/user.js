/**
 * Provides User service that stores user json data into session or in local storage if rememberMe
 * attribute is set to true
 */

(function () {
    'use strict';

    angular
        .module('ngViolet', ['ngCookies'])
        .service('UserService', ['$window', '$cookies', UserService]);

    function UserService($window, $cookies) {
        var vm = this;

        var cookieStorage = {
            setItem   : function (key, value) {
                $cookies.put(key, value, {expire: new Date([2099, 1, 1])});
            },
            getItem   : function (key) {
                return $cookies.get(key);
            },
            removeItem: function (key) {
                $cookies.remove(key)
            }
        };

        var storage = {
            setItem   : function (key, value, withLocalStorage) {
                if (typeof(value) == 'object')
                    value = angular.toJson(value);
                try {
                    $window.sessionStorage.setItem(key, value);
                    if (withLocalStorage === true)
                        localStorage.setItem(key, value);
                } catch (e) {
                    cookieStorage.setItem(key, value);
                }
            },
            getItem   : function (key) {
                var sValue = $window.sessionStorage.getItem(key);
                var lValue = localStorage.getItem(key);
                var cValue = cookieStorage.getItem(key);
                var value = sValue || lValue || cValue;

                try {
                    return angular.fromJson(value);
                } catch (e) {
                    return value;
                }
            },
            removeItem: function (key) {
                $window.sessionStorage.removeItem(key);
                localStorage.removeItem(key);
                cookieStorage.removeItem(key);
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

        this.savePref = function (key, val) {
            key = vm.get().id + '_' + key;
            $cookies.putObject(key, val);
        };

        this.getPref = function (key) {
            key = vm.get().id + '_' + key;
            return $cookies.getObject(key);
        }
    }
})();

