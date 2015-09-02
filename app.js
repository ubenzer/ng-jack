(function() {
  "use strict";
  angular.module("ub-app",
    [
      "app.controllers.application",
      "app.controllers.game",
      "app.directives.card",
      "app.services.blackjack"
    ]);
})();
