(function() {
  "use strict";
  angular.module("app.services.blackjack.cardDeck", [])
    .factory("CardDeck", CardDeck);

  function CardDeck() { // Represents 52 cards set on a table
    return {
      get: CardDeckInstance
    };

    function CardDeckInstance() {
      var cards = null;
      init();

      return {
        getNext: getNext,
        hasNext: hasNext,
        suffle: suffle
      };

      function init() {
        cards = [];
        ["H", "D", "C", "S"].forEach(function(aDeckKind) {
          for (var j = 1; j <= 13; j++) {
            cards.push({
              kind: aDeckKind,
              cardNo: j
            });
          }
        });
      }

      function suffle() {
        doShuffle(cards);

        function doShuffle(array) {
          // The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
          // credits to: http://stackoverflow.com/a/2450976/158523
          var currentIndex = array.length;

          // While there remain elements to shuffle...
          while (currentIndex !== 0) {
            // Pick a remaining element...
            var randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            var temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
        }
      }

      function getNext() {
        if (cards.length === 0) { return null; }
        return cards.pop();
      }

      function hasNext() {
        return cards.length > 0;
      }
    }
  }
})();
