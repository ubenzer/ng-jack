(function() {
  "use strict";
  angular.module("app.directives.card", [])
    .directive("card", Card);

  function Card() { // Converts a card object to a visual card
    return {
      restrict: "E",
      scope: {
        card: "=cardData",
        cardClosed: "="
      },
      controller: CardController,
      controllerAs: "card",
      bindToController: true,
      templateUrl: "directives/card.html"
    };

    function CardController($scope) {
      var vm = this;
      $scope.$watch("card.cardClosed", updateCardUrl);

      function updateCardUrl() {
        vm.url = "cards/" + getFileNameBody() + ".svg";
      }

      function getFileNameBody() {
        if (vm.cardClosed === true) {
          return "closed";
        }

        var tbReturned = "";
        if (vm.card.cardNo === 1) {
          tbReturned += "ace";
        } else if (vm.card.cardNo < 11) {
          tbReturned += vm.card.cardNo;
        } else if (vm.card.cardNo === 11) {
          tbReturned += "jack";
        } else if (vm.card.cardNo === 12) {
          tbReturned += "queen";
        } else {
          tbReturned += "king";
        }

        tbReturned += "_of_";

        if (vm.card.kind === "H") {
          tbReturned += "hearts";
        } else if (vm.card.kind === "D") {
          tbReturned += "diamonds";
        } else if (vm.card.kind === "C") {
          tbReturned += "clubs";
        } else {
          tbReturned += "spades";
        }

        return tbReturned;
      }
    }
  }
})();
