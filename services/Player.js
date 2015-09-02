(function() {
  "use strict";
  angular.module("app.services.blackjack.player", [])
    .factory("Player", Player);

  function Player() { // Represents some on the table including dealer
    var api = {
      PLAYER_STATUS: { // Enum like
        BUSTED: 0,
        LOST: 1,
        WIN: 2,
        PLAYING: 3,
        PUSH: 4
      },
      create: PlayerInstance // Class like
    };
    return api;

    function PlayerInstance() {
      var cards = [];
      var status = api.PLAYER_STATUS.PLAYING;

      return {
        getStatus: getStatus,
        setStatus: setStatus,
        getCards: getCards,
        addCard: addCard,
        getPoints: getPoints
      };

      function getStatus() {
        return status;
      }

      function setStatus(s) {
        status = s;
      }

      function getCards() {
        return angular.copy(cards); // I secure actual content from accidental change in some other place
      }

      function addCard(cardObj) {
        cards.push(cardObj);
        return getCards();
      }

      function getPoints(hardOnly) {
        var points = 0;
        var acesCount = 0;

        angular.forEach(cards, function(aCard) {
          if (aCard.cardNo === 1) {
            acesCount++;
          } else if (aCard.cardNo >= 11) {
            points += 10;
          } else {
            points += aCard.cardNo;
          }
        });

        for (var i = 0; i < acesCount; i++) {
          if (hardOnly === true || points + 11 > 21) {
            points += 1;
          } else {
            points += 11;
          }
        }

        return points;
      }
    }
  }
})();
