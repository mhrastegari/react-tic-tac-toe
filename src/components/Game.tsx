import { Square } from "./Square";
import { PlayerType } from "../types";
import { useEffect, useState } from "react";

const initialGameState = Array(9).fill("");
const initialScores = { X: 0, 0: 0 };
const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function Game() {
  const [gameState, setGameState] = useState(initialGameState);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerType>("X");
  const [scores, setScores] = useState(initialScores);

  function handleSquareClick(index: number) {
    const currentValue = gameState[index];

    if (currentValue) return;

    const newValues = [...gameState];
    newValues[index] = currentPlayer;

    setGameState(newValues);
  }

  function changePlayer() {
    setCurrentPlayer(currentPlayer === "X" ? "0" : "X");
  }

  function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winningCombos.length; i++) {
      const winCombo = winningCombos[i];

      let a = gameState[winCombo[0]];
      let b = gameState[winCombo[1]];
      let c = gameState[winCombo[2]];

      if ([a, b, c].includes("")) continue;

      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      setTimeout(() => {
        window.alert(`Congrats player ${currentPlayer}! You are the winner!`);

        const newPlayerScore = scores[currentPlayer] + 1;
        const newScores = { ...scores };
        newScores[currentPlayer] = newPlayerScore;
        setScores(newScores);

        localStorage.setItem("scores", JSON.stringify(newScores));

        setGameState(initialGameState);
      }, 500);
      return;
    }

    if (!gameState.includes("")) {
      setTimeout(() => {
        window.alert("The game ended in a draw!");
        setGameState(initialGameState);
      }, 500);
      return;
    }

    changePlayer();
  }

  useEffect(() => {
    if (gameState === initialGameState) return;

    checkWinner();
  }, [gameState]);

  useEffect(() => {
    const storedScores = localStorage.getItem("scores");
    if (storedScores) {
      setScores(JSON.parse(storedScores));
    }
  }, []);

  return (
    <div className="h-full p-8">
      <h1 className="text-center text-5xl mb-4">Tic Tac Toe</h1>
      <div>
        <div className="grid grid-cols-3 gap-3 mx-auto">
          {gameState.map((player, index) => (
            <Square
              key={index}
              index={index}
              player={player}
              onClick={() => handleSquareClick(index)}
            ></Square>
          ))}
        </div>
        <div className="py-8">
          <p>Next player: {currentPlayer}</p>
          <p>Player X wins: {scores["X"]}</p>
          <p>Player 0 wins: {scores["0"]}</p>
        </div>
      </div>
    </div>
  );
}
