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

const GameController = ( () => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;

    const switchPlayer = () => {
      currentPlayer = currentPlayer === player1 ? player2 : player1 ;
   };
   const checkWin = () => {
      const board = Gameboard.getBoard();
      const winPatterns = [
         [0, 1, 2], [3, 4, 5], [6, 7, 8],
         [0, 3, 6], [1, 4, 7], [2, 5, 8],
         [0, 4, 8], [2, 4, 6]
      ]
      for (const pattern of winPatterns) {
         const [a, b, c] = pattern;
         if (board[a] && board[a] === board[b] && board[a] === board[c]){
            console.log(`${currentPlayer.name} wins!`);
            return true;
         }
      }
      return false;
   }
   const playTurn = (index) => {
      if (Gameboard.setMark(index, currentPlayer.mark)) {
         console.log(`${currentPlayer.name} played at ${index}`)
         console.log(Gameboard.getBoard());

         if (checkWin()) {
            console.log("Game over!");
            return;
         }
         switchPlayer();
      } else {
         console.log("Invalid move - spot taken or out of bounds.");
      }
   }
   return {playTurn, switchPlayer, checkWin};
})();