(function() {
  "use strict";
  angular.module("app.controllers.application", [])
    .controller("Application", ApplicationController);

  function ApplicationController() {
    var vm = this;
    // Remove loading and show the actual application.
    vm.loaded = true;
  }
})();
