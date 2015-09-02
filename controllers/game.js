(function() {
  "use strict";
  angular.module("app.controllers.game",
    [
      "app.services.blackjack"
    ])
    .controller("Game", GameController);

  function GameController(Blackjack) { // Main controller that uses Blackjack service
    var vm = this;

    vm.actions = {
      startGame: startGame,
      endGame: endGame,
      addPlayer: addPlayer,
      removePlayer: removePlayer,
      hit: hit,
      stand: stand
    };

    vm.state = null;

    vm.visual = {
      gameOver: false
    };

    var game = null;

    init();

    function updateGameStatus(checkGameOver) {
      vm.state = game.getGameStatus();
      if (checkGameOver === true && !vm.state.inProgress) {
        vm.visual.gameOver = true;
      }
    }

    function init() {
      game = Blackjack.createGame(); // create a brand new table
      game.addPlayer();
      updateGameStatus();
    }

    function endGame() {
      // Nukes current game and initializes a new one.
      vm.visual.gameOver = false;
      init();
    }

    function startGame() {
      game.startGame();
      updateGameStatus();
    }

    function addPlayer() {
      game.addPlayer();
      updateGameStatus();
    }

    function removePlayer() {
      game.removePlayer();
      updateGameStatus();
    }

    function hit() {
      game.hit();
      updateGameStatus(true);
    }

    function stand() {
      game.stand();
      updateGameStatus(true);
    }
  }
})();
