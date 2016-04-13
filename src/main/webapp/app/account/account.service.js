(function() {
    'use strict';

    angular
        .module('achCaseTrackingApp')
        .factory('AccountService', AccountService);

    //EnumService.$inject = ['Enums'];

    AccountService.$inject = ['Principal'];

    function AccountService(Principal) {
        return {
            getCurrentUser: currentUser
        }

        function currentUser(Principal, Auth) {
            /**
             * Store the "account" in a separate variable, and not in the shared "account" variable.
             */
            var copyAccount = function(account) {
                return {
                    activated: account.activated,
                    email: account.email,
                    firstName: account.firstName,
                    langKey: account.langKey,
                    lastName: account.lastName,
                    login: account.login
                };
            };
            Principal.identity().then(function(account) {
                console.log(account);
                console.log(copyAccount(account));
                return copyAccount(account);
            });
        }
    }
})();
