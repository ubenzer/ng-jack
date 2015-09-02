(function() {
  "use strict";
  angular.module("app.services.blackjack",
    [
      "app.services.blackjack.cardDeck",
      "app.services.blackjack.player"
    ])
    .factory("Blackjack", Blackjack);

  function Blackjack(Player, CardDeck) { // Represents a single game of Blackjack
    return {
      createGame: BlackjackInstance
    };

    function BlackjackInstance() {
      var dealer = Player.create();
      var players = [];
      var cards = null;
      var gameInProgress = false;
      var gameFinished = false;
      var currentPlayerId = 0; // Who is playing now?

      return {
        startGame: startGame,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        getGameStatus: getGameStatus,
        hit: hit,
        stand: stand
      };

      function startGame() {
        if (players.length < 1) { throw new Error("Not enough players!"); }

        gameInProgress = true;
        cards = CardDeck.get();
        cards.suffle();

        for (var i = 0; i < 2; i++) {
          players.forEach(addCard);
          addCard(dealer);
        }

        currentPlayerId = 0;

        function addCard(player) {
          player.addCard(cards.getNext());
        }
      }

      function addPlayer() {
        if (gameInProgress || gameFinished) { throw new Error("Can't alter players once game started!"); }
        var newPlayer = Player.create();
        players.push(newPlayer);
      }

      function removePlayer() {
        if (gameInProgress || gameFinished) { throw new Error("Can't alter players once game started!"); }
        players.pop();
      }

      function getGameStatus() {
        /* This service represents a Blackjack game indepented of any controllers. But, controllers
           constantly needs game state, bacause they'll update the scope (and view).

           We need to expose almost everything (players, dealer, game status, player cards) etc.
           and exposing those much thing makes a highly tightly coupled api between controller and
           service, which in my opinion reduces flexibility.

           Instead, controllers may call this API to get an object that represents current state of
           the game anytime they want and update the scope respectively.
         */
        var dealerCards = dealer.getCards();
        var dealerScore = dealer.getPoints();

        var tbReturned = {
          inProgress: gameInProgress,
          dealer: {
            score: dealerScore,
            isBust: isBust(dealerScore),
            cards: dealerCards,
            firstCardVisible: !gameInProgress
          },
          players: []
        };

        for (var i = 0; i < players.length; i++) {
          var player = players[i];
          var playerCards = player.getCards();
          var playerScore = player.getPoints();
          var playerStatus = player.getStatus();

          tbReturned.players.push({
            score: playerScore,
            isCurrent: currentPlayerId === i,
            isBust: isBust(playerScore),
            isLost: playerStatus === Player.PLAYER_STATUS.LOST,
            isWin: playerStatus === Player.PLAYER_STATUS.WIN,
            isPush: playerStatus === Player.PLAYER_STATUS.PUSH,
            cards: playerCards
          });
        }

        return tbReturned;
      }

      function hit() {
        if (!gameInProgress || gameFinished) { throw new Error("Game is not started"); }
        var player = players[currentPlayerId];
        player.addCard(cards.getNext());
        var points = player.getPoints();
        if (isBust(points)) {
          player.setStatus(Player.PLAYER_STATUS.BUSTED);
          setNextPlayerActive();
        }
      }

      function stand() {
        if (!gameInProgress || gameFinished) { throw new Error("Game is not started"); }
        setNextPlayerActive();
      }

      function endGame() {
        gameInProgress = false;
        gameFinished = true;
        // play dealer
        while (dealer.getPoints(true) < 17) {
          dealer.addCard(cards.getNext());
        }
        var dealerPoints = dealer.getPoints();
        if (isBust(dealerPoints)) {
          dealer.setStatus(Player.PLAYER_STATUS.BUSTED);
        }

        // for each player calculate points & win/loss
        angular.forEach(players, function(player) {
          if (player.getStatus() === Player.PLAYER_STATUS.BUSTED) {
            return; // we already calculated. mini optimization
          }

          if (dealer.getStatus() === Player.PLAYER_STATUS.BUSTED) {
            player.setStatus(Player.PLAYER_STATUS.WIN);
          } else {
            var playerPoints = player.getPoints();
            var playerStatus = null;
            if (playerPoints === dealerPoints) {
              playerStatus = Player.PLAYER_STATUS.PUSH;
            } else if (playerPoints > dealerPoints) {
              playerStatus = Player.PLAYER_STATUS.WIN;
            } else {
              playerStatus = Player.PLAYER_STATUS.LOST;
            }
            player.setStatus(playerStatus);
          }
        });
      }

      function setNextPlayerActive() {
        currentPlayerId++;
        if (currentPlayerId === players.length) {
          endGame();
        }
      }

      function isBust(score) {
        return score > 21;
      }
    }
  }
})();
