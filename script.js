const Gameboard = (() => {

   let board = [
      "", "", "",
      "", "", "",
      "", "", ""
   ]
   const setMark = (index, mark) => {
      if (index < 0 || index > 8) {
         console.log("index is out of the board!!");
         return false;
      }
      else if (board[index] !== "") {
         console.log("This place is already taken ");
         return false ;
      }
      board[index] = mark ;
      return true; 
   }
   const getBoard = () => {
      return [...board] 
   }
   const reset = () => {
         board = [
         "", "", "",
         "", "", "",
         "", "", ""
      ]
   }
   return {setMark, getBoard, reset}
})()

const Player = (name , mark) => {
   return {name, mark}
}
const GameController = (() => {
   let player1, player2;
   let currentPlayer;

   const startGame = (p1, p2) => {
      player1 = p1;
      player2 = p2;
      currentPlayer = player1;
      Gameboard.reset();
      DisplayController.render();
      DisplayController.setStatus(`${currentPlayer.name}'s Turn`);
   };

   const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1;
   };

   const checkWin = () => {
      const board = Gameboard.getBoard();
      const winPatterns = [
         [0,1,2], [3,4,5], [6,7,8],
         [0,3,6], [1,4,7], [2,5,8],
         [0,4,8], [2,4,6]
      ];

      for (const pattern of winPatterns) {
         const [a,b,c] = pattern;
         if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            DisplayController.setStatus(`${currentPlayer.name} Wins! 🎉`);
            return true;
         }
      }
      return false;
   };

   const checkTie = () => {
      const board = Gameboard.getBoard();
      if (board.every(cell => cell !== "") && !checkWin()) {
         DisplayController.setStatus("It's a Tie! 🤝");
         return true;
      }
      return false;
   };

   const playTurn = (index) => {
      if (!player1 || !player2) {
         DisplayController.setStatus("Please start the game first!");
         return;
      }

      if (Gameboard.setMark(index, currentPlayer.mark)) {
         DisplayController.render();

         if (checkWin() || checkTie()) {
            return; 
         }

         switchPlayer();
         DisplayController.setStatus(`${currentPlayer.name}'s Turn`);
      }
   };


   return { startGame, playTurn, checkWin, checkTie };
})();

const StartGame = (() => {
   const parent = document.querySelector('.info');
   const startBtn = document.querySelector("#start");
   const playerOneInput = document.querySelector('#pOne');
   const playerTwoInput = document.querySelector('#pTwo');
   const warning = document.createElement('p');

   startBtn.addEventListener("click", () => {
      const playerOneName = playerOneInput.value.trim();
      const playerTwoName = playerTwoInput.value.trim();

      if (!playerOneName || !playerTwoName) {
         warning.textContent = "Please enter both names!";
         warning.style.color = "red";
         warning.style.margin = "10px 0";
         parent.prepend(warning);
         return;
      }

      if (warning.parentNode) warning.remove();

      const player1 = Player(playerOneName, "X");
      const player2 = Player(playerTwoName, "O");
      GameController.startGame(player1, player2);


      playerOneInput.disabled = true;
      playerTwoInput.disabled = true;
      startBtn.textContent = "Restart";
      startBtn.id = "restart"; 

      if (startBtn.textContent === "Restart") {
         playerOneInput.disabled = false;
         playerTwoInput.disabled = false;
         startBtn.textContent = "Start";
         DisplayController.setStatus("Enter names and press Start");

      }
   });

   return {};
})();

const DisplayController = (() => {
   const gridContainer = document.querySelector(".gridContainer");
   const status = document.createElement("div");
   status.id = "status";
   document.body.insertBefore(status, gridContainer.nextSibling);

   const render = () => {
      const gameBoard = Gameboard.getBoard();
      const cells = document.querySelectorAll(".gridCell");
      cells.forEach((cell, index) => {
         cell.textContent = gameBoard[index];
      });
   };

   const setStatus = (message) => {
      status.textContent = message;
   };

   gridContainer.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      if (index === undefined) return;
      GameController.playTurn(parseInt(index));
   });

  
   render();

   return { render, setStatus };
})();